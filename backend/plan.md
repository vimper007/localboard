create issue
read issue
update issue
delete issue

LocalBoard is a barebones, real-time issue tracker built entirely without frameworks. By stripping away React, Express, and MongoDB, you are forced to manually handle the exact mechanical problems those frameworks usually hide from you.

Here is the exact blueprint for building it in your 45/60-minute loops, stage by stage.

## Phase 1: The Core Foundation (HTTP & The DOM)

Instead of using `express()` to handle routing or React to render components, you will write the raw engine.

- **The Node Backend:** You will use the native `http` module. You must manually inspect `req.url` and `req.method` to route requests. When a user submits a task, you will receive the data as a raw buffer stream. You have to manually listen to the `req.on('data')` chunks, assemble them, and parse the JSON. Finally, you write that JSON into a local `tasks.json` file using the `fs` module.
- **The Vanilla JS Client:** You will fetch the `tasks.json` data via the `fetch()` API. Instead of writing JSX, you will use `document.createElement()`, assign CSS classes manually, and append the elements to the DOM.
- **The Core Lesson:** You will learn exactly how HTTP headers, status codes, and manual DOM manipulation work—the exact things React and Express automate.

## Phase 2: State Management & Memory (Closures)

Next, you will add a live search bar that filters issues as you type. If you query the server on every single keystroke, you will crash it.

- **The Mechanics:** You will write a custom **Debounce** function. This forces you to understand **Closures**. A closure allows a function to remember the variables in its outer scope even after that outer function has returned. You will use a closure to store a `setTimeout` ID, clearing and resetting it every time the user hits a key, so the server is only pinged after the user stops typing for 300 milliseconds.
- **Building a State Manager:** Instead of re-querying the DOM every time data changes, you will build a central `State` object. You will learn how to use JavaScript Getters and Setters (`Object.defineProperty` or ES6 Proxies) so that whenever a task is updated in memory, the DOM automatically re-renders. This is how React's `useState` actually functions under the hood.

## Phase 3: File Attachments (Streams)

You want users to be able to drag and drop a screenshot onto a task.

- **The Trap:** A junior developer will read the entire image file into Node's memory (RAM) and then write it to the disk. If 10 users upload a 5MB image at the same time, the server's memory spikes by 50MB. If 1,000 users do it, the Node process crashes.
- **The Mechanics:** You will learn **Streams**. Streams are instances of `EventEmitter`. You will use `fs.createWriteStream()` to take the incoming `req` stream and pipe it directly to the hard drive (`req.pipe(fileWriter)`). The data flows in small chunks directly to the disk without ever bloating the server's memory. You will learn about backpressure and asynchronous I/O.

## Phase 4: The Live Activity Feed (Events)

If you open LocalBoard in two different browser tabs, updating a task in Tab A should instantly reflect in Tab B without refreshing the page.

- **The Node Backend:** You will implement the publish-subscribe pattern using Node's native `EventEmitter` class. Whenever the `/tasks` route successfully writes to the database, you will call `emitter.emit('taskUpdated', taskData)`.
- **Server-Sent Events (SSE):** You will create a new route called `/stream`. When a client connects to this route, you do *not* close the HTTP connection. You keep it open and attach a listener to your EventEmitter. Whenever 'taskUpdated' fires, you push a chunk of data down that open HTTP connection.
- **The Vanilla JS Client:** You will use the native `EventSource` API in the browser to listen to that stream and update the DOM in real-time.

### Your Directory Structure

Keep it incredibly simple. You do not need Webpack, Babel, or complex build tools.

Plaintext

```
localboard/
│
├── server/
│   ├── index.js          # The raw http.createServer entry point
│   ├── router.js         # Manually routing req.url logic
│   ├── eventBus.js       # Your custom EventEmitter instance
│   └── data/
│       └── tasks.json    # Your "database"
│
└── client/
    ├── index.html        # Ugly, semantic HTML
    ├── style.css         # Bare minimum layout
    ├── app.js            # Fetch calls and DOM manipulation
    └── state.js          # Your custom proxy/closure state manager
```
---

# Product Requirements Document: LocalBoard (Phase 1)

**Objective:** Build a framework-free, decoupled client-server architecture capable of full CRUD (Create, Read, Update, Delete) operations, utilizing raw HTTP streams, the native file system, and manual DOM manipulation.

## 1. Technical Constraints (The "No Magic" Rules)

To guarantee adherence to the "Mechanics Before Magic" methodology, the following constraints are strictly enforced:

* **Backend:** Native Node.js only. The use of Express, Fastify, or any `npm` routing package is strictly forbidden.
* **Frontend:** Vanilla JavaScript (ES6+), semantic HTML5, and raw CSS. No React, Vue, or jQuery.
* **Database:** A local `issues.json` file. No MongoDB, PostgreSQL, or SQLite.
* **Network:** The frontend and backend must run on different ports (e.g., Frontend on 5500, Backend on 3000) to force manual CORS configuration.

## 2. Data Model

Every issue stored in `backend/data/issues.json` must adhere strictly to this JSON structure.

| Field | Type | Description |
| --- | --- | --- |
| `id` | String | A unique identifier (e.g., generated via `Date.now().toString()`). |
| `title` | String | The main headline of the issue. |
| `description` | String | The detailed body of the issue. |
| `status` | String | Must be one of three values: `"Open"`, `"In Progress"`, or `"Done"`. |
| `createdAt` | Number | The Unix timestamp of when the issue was created. |

## 3. Backend API Specifications (Node.js `http`)

The server must manually parse `req.method` and `req.url` to expose the following endpoints.

### A. Read Issues

* **Endpoint:** `GET /api/issues`
* **Mechanic:** Must asynchronously read `issues.json` using `fs.readFile` (or `fs.promises.readFile`) to avoid blocking the single thread.
* **Response:** Returns `200 OK` with the JSON array of issues.

### B. Create Issue

* **Endpoint:** `POST /api/issues`
* **Mechanic:** The server must attach a `req.on('data')` listener, capture the raw buffer chunks, assemble them, and parse the resulting string into a JSON object.
* **Execution:** Push the new issue object into the array and overwrite the file using `fs.writeFile`.
* **Response:** Returns `201 Created` with the newly created issue object.

### C. Update Issue Status

* **Endpoint:** `PATCH /api/issues/:id` *(Note: You must manually extract the `:id` from the URL string).*
* **Mechanic:** Parse the incoming stream (like the POST route) to get the new status. Map through the array in memory, find the matching ID, update the status, and rewrite the file.
* **Response:** Returns `200 OK` on success, or `404 Not Found` if the ID does not exist.

### D. Delete Issue

* **Endpoint:** `DELETE /api/issues/:id`
* **Mechanic:** Filter the array in memory to remove the object matching the ID, then rewrite the file.
* **Response:** Returns `204 No Content`.

### E. The CORS Preflight (Critical)

* **Endpoint:** `OPTIONS /api/issues` (and all other routes)
* **Mechanic:** Browsers send an `OPTIONS` request before a `POST`, `PATCH`, or `DELETE` to check permissions. The server must intercept `req.method === 'OPTIONS'` and return a `200 OK` with headers explicitly allowing the frontend origin (e.g., `Access-Control-Allow-Origin: *`) and allowed methods.

## 4. Frontend Specifications (Vanilla JS)

The browser client must handle data fetching, state rendering, and user input manually.

### A. The User Interface (HTML/CSS)

* **Form Area:** Contains `<input>` for Title, `<textarea>` for Description, and a Submit `<button>`.
* **Board Area:** A container `div` (`#issue-board`) where issues will be rendered.

### B. DOM Manipulation Mechanics

* **Rendering:** On page load, execute a `fetch()` to `GET /api/issues`. Iterate over the array, use `document.createElement()` to build the issue cards, and append them to `#issue-board`.
* **Form Submission:** Intercept the form's `submit` event, call `e.preventDefault()`, extract the values, and send a `fetch()` `POST` request. On success, instantly append the new issue to the DOM without refreshing the page.

### C. Event Delegation (Mandatory)

* **Rule:** You are forbidden from attaching an `addEventListener` to the "Delete" or "Status Change" buttons of individual issues.
* **Execution:** You must attach a single `click` and `change` listener to the parent `#issue-board`. When an event fires, use `e.target` to determine if a delete button or status dropdown was interacted with, read the specific issue ID from a data attribute (e.g., `data-id="1710923"`), and execute the respective `fetch()` call.

## 5. Acceptance Criteria (Definition of Done)

Before moving to Phase 2 (State Management & Closures), the following must be true:

1. I can start the Node server in the terminal and it does not crash.
2. I can submit the frontend form, and the new issue immediately appears on the screen.
3. If I completely refresh the browser tab, the issue is still there (verifying file system persistence).
4. I can change an issue from "Open" to "In Progress", refresh the page, and it remains "In Progress".
5. I can click "Delete", the issue disappears from the DOM, and checking the raw `issues.json` file confirms the object is gone.

---