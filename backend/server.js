const http = require("http");
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "data", "issues.json");

function readFile(req, res) {
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      res.writeHead(500, { "content-type": "text/plain" });
      res.end("Server Error");
      return;
    }
    res.writeHead(200, { "content-type": "application/json" });
    res.end(data);
  });
}

const PORT = process.env.PORT || 3000;
console.log(PORT);
const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, "data", "issues.json");
  switch (req.url) {
    case "/api/v1/issues":
      if (req.method === "GET") {
        readFile(req, res);
      } else if (req.method === "POST") {
        
      }
      break;
    default:
      res.statusCode = 404;
      res.end("Not Found");
  }
});

server.listen(PORT, () =>
  console.log(`Server listening on http://localhost:${PORT}`),
);
