const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const PORT = process.env.PORT || 3000;
const filePath = path.join(__dirname, "data", "issues.json");

function getIssuesHandler(req, res) {
  readFile(req, res, () => {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(req.issues));
  });
}

function parseBody(req, res, next) {
  let body = "";
  req.on("data", (chunk) => (body += chunk.toString()));
  req.on("end", () => {
    req.body = JSON.parse(body);
    next();
  });
}

function logger(req, res, next) {
  console.log(req.method + " " + req.url);
  next();
}

function validateCreateIssue(req, res, next) {
  const status = ["open", "in-progress", "done"];
  req.body.id = crypto.randomUUID();
  req.body.createdAt = Date.now().toString();

  if (typeof req.body?.title !== "string" || !req.body.title) {
    res.writeHead(400, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        error: "Invalid title",
        message: "title should be a non-empty string value",
      }),
    );
    return;
  }
  if (typeof req.body?.description !== "string" || !req.body.description) {
    res.writeHead(400, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        error: "Invalid description",
        message: "description should be a non-empty string value",
      }),
    );
    return;
  }
  if (!status.includes(req.body?.status)) {
    res.writeHead(400, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        error: "Invalid status",
        message: "status should be an enum of value [open, in-progress, done]",
      }),
    );
    return;
  }
  next();
}

function validatePatchIssue(req, res, next) {
  const id = req.url.split("/")[4];
  const issues = req.issues;
  const foundIssue = issues.find((issue) => issue?.id === id);
  const newIssue = { ...foundIssue };
  if (!foundIssue) {
    res.writeHead(404, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        error: "Record not found",
        message: "Record with sent id is not found",
      }),
    );
    return;
  }
  if (req.body?.title !== undefined) {
    if (typeof req.body?.title !== "string" || !req.body.title) {
      res.writeHead(400, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          error: "Invalid title",
          message: "title should be a non-empty string value",
        }),
      );
      return;
    } else {
      newIssue.title = req.body.title;
    }
  }
  if (req.body?.description !== undefined) {
    if (
      typeof req.body?.description !== "string" ||
      req.body.description == ""
    ) {
      res.writeHead(400, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          error: "Invalid description",
          message: "description should be a non-empty string value",
        }),
      );
      return;
    } else {
      newIssue.description = req.body.description;
    }
  }
  if (req.body?.status !== undefined) {
    const status = ["open", "in-progress", "done"];
    if (!status.includes(req.body?.status)) {
      res.writeHead(400, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          error: "Invalid status",
          message:
            "status should be an enum of value [open, in-progress, done]",
        }),
      );
      return;
    } else {
      newIssue.status = req.body.status;
    }
  }
  newIssue.updatedAt = Date.now().toString();
  const indexOfSelectedIssue = issues.findIndex((issue) => issue?.id === id);
  issues[indexOfSelectedIssue] = newIssue;
  req.issues = issues;
  req.issue = newIssue;
  next();
}

function readFile(req, res, next) {
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      res.writeHead(500, { "content-type": "text/plain" });
      res.end("Server Error, Cannot read file");
      return;
    }
    const issues = JSON.parse(data);
    req.issues = issues;
    next();
  });
}

function createIssueHandler(req, res) {
  logger(req, res, () => {
    parseBody(req, res, () => {
      validateCreateIssue(req, res, () => {
        readFile(req, res, () => {
          req.issues.push(req.body);
          const stringifiedData = JSON.stringify(req.issues);

          fs.writeFile(filePath, stringifiedData, (err) => {
            if (err) {
              res.writeHead(500, { "content-type": "text/plain" });
              res.end("Server Error, Write file failure");
              return;
            }
            res.writeHead(200, { "content-type": "application/json" });
            res.end(stringifiedData);
          });
        });
      });
    });
  });
}

function getIssueByIdHandler(req, res) {
  const id = req.url.split("/")[4];
  console.log("id...", id);
  if (req.method === "GET") {
    readFile(req, res, () => {
      console.log(req.issues);
      const issues = req.issues;
      const foundIssue = issues.find((issue) => issue?.id === id);
      if (!foundIssue) {
        res.writeHead(404, { "content-type": "application/json" });
        res.end(
          JSON.stringify({
            error: "Record not found",
            message: "Record with sent id is not found",
          }),
        );
        return;
      }
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(foundIssue));
    });
  }
}

function updateIssueHandler(req, res) {
  readFile(req, res, () => {
    parseBody(req, res, () => {
      validatePatchIssue(req, res, () => {
        fs.writeFile(filePath, JSON.stringify(req.issues), (err) => {
          if (err) res.writeHead(500, { "content-type": "text/plain" });
          res.end("Server Error, Write file failure");
          return;
        });
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(req.issue));
      });
    });
  });
}

console.log(PORT);
const server = http.createServer((req, res) => {
  const uuidRegex =
    /^\/api\/v1\/issues\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  switch (true) {
    case uuidRegex.test(req.url):
      if (req.method === "GET") {
        getIssueByIdHandler(req, res);
      } else if (req.method === "PATCH") {
        updateIssueHandler(req, res);
      } else if (req.method === "DELETE") {
        readFile(req, res, () => {
          const id = req.url.split("/")[4];
          const filteredIssues = req.issues.filter((issue) => issue?.id !== id);
          if (!filteredIssues) {
            res.writeHead(404, { "content-type": "application/json" });
            res.end(
              JSON.stringify({
                error: "Record not found",
                message: "Record with sent id is not found",
              }),
            );
            return;
          }
          fs.writeFile(filePath, JSON.stringify(filteredIssues), (err) => {
            if (err) {
              res.writeHead(500, { "content-type": "text/plain" });
              res.end("Server Error, Write file failure");
            }
          });
          res.writeHead(204, { "content-type": "application/json" });
          res.end();
        });
      }
      break;
    case req.url === "/api/v1/issues":
      if (req.method === "GET") {
        getIssuesHandler(req, res);
      } else if (req.method === "POST") {
        createIssueHandler(req, res);
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
