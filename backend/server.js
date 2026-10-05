const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const PORT = process.env.PORT || 3000;
const filePath = path.join(__dirname, "data", "issues.json");

function readFileHandler(_, res) {
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

function parseBody(req,res,next){
  let body = ''
  req.on('data', (chunk)=> body+=chunk.toString())
  req.on('end', ()=>{
    req.body = JSON.parse(body)
    next()
  })
}

function logger(req, res, next) {
  console.log(req.method + " " + req.url);
  next();
}

// function writeFileHandler(req, res) {
//   logger(req, res, () => {
//     let body = "";
//     req.on("data", (chunk) => (body += chunk.toString()));
//     req.on("end", () => {
//       const newBody = JSON.parse(body);
//       fs.readFile(filePath, "utf-8", (err, data) => {
//         if (err) {
//           res.writeHead(500, { "content-type": "application/json" });
//           res.end("Server error");
//           return;
//         }
//         const parsedData = JSON.parse(data);
//         console.log(parsedData);
//         parsedData.issues.push(newBody);
//         const stringifiedData = JSON.stringify(parsedData);

//         fs.writeFile(filePath, stringifiedData, (err) => {
//           if (err) {
//             res.writeHead(500, { "content-type": "text/plain" });
//             res.end("Server Error");
//             return;
//           }
//           res.writeHead(200, { "content-type": "application/json" });
//           res.end(stringifiedData);
//         });
//       });
//     });
//   });
// }

function writeFileHandler(req, res) {
  logger(req, res, () => {
      parseBody(req,res,()=>{
        fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
          res.writeHead(500, { "content-type": "application/json" });
          res.end("Server error");
          return;
        }
        const parsedData = JSON.parse(data);
        console.log(parsedData);
        parsedData.issues.push(req.body);
        const stringifiedData = JSON.stringify(parsedData);

        fs.writeFile(filePath, stringifiedData, (err) => {
          if (err) {
            res.writeHead(500, { "content-type": "text/plain" });
            res.end("Server Error");
            return;
          }
          res.writeHead(200, { "content-type": "application/json" });
          res.end(stringifiedData);
        });
      });
      })
  });
}

console.log(PORT);
const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, "data", "issues.json");
  switch (req.url) {
    case "/api/v1/issues":
      if (req.method === "GET") {
        readFileHandler(req, res);
      } else if (req.method === "POST") {
        writeFileHandler(req, res);
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
