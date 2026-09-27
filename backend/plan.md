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