That is a bold and fantastic choice. Building a full project using strictly vanilla Node.js (no Express) and vanilla JavaScript on the frontend is the absolute best way to master how the web actually works under the hood.

Since you are not using frameworks, the Udemy courses that rely heavily on Express.js will frustrate you. You need resources that teach you how to manually parse URLs, stream data chunks, and build your own router using just the raw `http` module.

Here are the best resources focused specifically on vanilla Node.js architecture:

### 1. The Best Video Course: "Node.js Crash Course" & "Node.js API No Frameworks" by Traversy Media (YouTube)

Brad Traversy has two legendary, completely free crash courses on YouTube that do exactly what you are asking for.

* **Why it fits:** He builds a complete server, handles different routes (like `/users` or `/posts`), and reads/writes database files using absolutely zero external packages.
* **What you will learn:** You will learn how to manually look at that `req` bucket, check `req.url` to see what page the user wants, check `req.method` to see if they are asking for data (GET) or submitting data (POST), and then use the `res` bucket to send back raw JSON or HTML.

### 2. The Best Udemy Option: "Node.js - The Complete Guide" by Maximilian Schwarzmüller (Section 3 & 4)

If you still want a structured Udemy course, Maximilian's course is excellent, but with a major caveat for your specific goal: you only need the first few sections.

* **Why it fits:** Before he introduces Express.js, he forces you to spend several hours building a web server the hard way. He teaches you how to catch the raw stream of data coming from a frontend HTML form, parse it byte-by-byte in vanilla Node, and save it to a text file. It directly builds on the `http.createServer(req, res)` concept you just mastered.

### 3. The Best Text Resource: "Anatomy of an HTTP Transaction" (Node.js Official Docs)

This is an official, built-in guide from the creators of Node.js.

* **Why it fits:** It is a step-by-step written tutorial on exactly how the `req` and `res` objects work inside `createServer`. It walks you through how to manually extract data from the Request, format it, and send a proper Response without any outside libraries.

### The 4 Built-In Tools You Will Need

Since you are doing this vanilla, your entire backend architecture for the localboard will rely on just four built-in Node.js modules. You will `require()` these at the top of your file:

* **`http`**: To use `createServer` and catch the `req` and `res`.
* **`fs` (File System)**: To read and write your board posts to a local file (since you aren't using a heavy database).
* **`url`**: To chop up the web address the user typed in so you know which board they are trying to look at.
* **`path`**: To safely glue file paths together when you want to send your vanilla JS and HTML files back to the user's browser.

Building your own router from scratch is challenging, but once you do it, you will never be intimidated by backend code again.

Are you planning to store the localboard posts in a simple JSON file, or are you going to try writing to a local database?