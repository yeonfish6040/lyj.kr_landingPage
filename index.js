require('dotenv').config();

const fs = require("fs");
const http = require("http");
const mock_test = require("./functions/mock_test");

function log(req, res) {
    const startTime = Date.now();
    const ip = req.connection.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const method = req.method;
    const url = req.url;
    const httpVersion = `HTTP/${req.httpVersion}`;

    res.on("finish", () => {
        const statusCode = res.statusCode;
        const timeElapsed = Date.now() - startTime;
        console.log(`${ip} (${userAgent}) - "${method} ${url} ${httpVersion}" ${statusCode} +${timeElapsed}ms `)
    });
}

function readFile(path) {
    return new Promise((accept, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) reject(error);
            accept(data);
        });
    });
}

const server = http.createServer((req, res) => {
    (new Promise(async (accept, reject) => {
        try {
            log(req, res);

            switch (req.url) {
                case "":
                case "/":
                    readFile("./pages/index.html").then((data) => {
                        res.writeHead(200);
                        res.write(data);
                        accept()
                    }).catch((e) => reject([e, 500, "Internal error occurred"]));
                    break;
                case "/dontsee":
                    readFile("./pages/dontsee.html").then((data) => {
                        res.writeHead(200);
                        res.write(data);
                        accept()
                    }).catch((e) => reject([e, 500, "Internal error occurred"]));
                    break;
                case "/ctf":
                    readFile("./pages/ex.html").then((data) => {
                        res.writeHead(200);
                        res.write(data);
                        accept()
                    }).catch((e) => reject([e, 500, "Internal error occurred"]));
                    break;
                case "/mock_test":
                    if (req.method === "GET") {
                        readFile("./pages/mock_test.html").then((data) => {
                            res.writeHead(200);
                            res.write(data);
                            accept()
                        }).catch((e) => reject([e, 500, "Internal error occurred"]));
                    }
                    if (req.method === "POST") {
                        const result = await mock_test();
                        res.writeHead(200);
                        res.write(`{"ebs": ${result[0]}, "etoos": ${result[1]}, "megastudy": ${result[2]}, "mimac": ${result[3]}}`);
                        accept();
                    }
                    break;
                case "/js/index.js":
                    readFile("./static/js/index.js").then((data) => {
                        res.writeHead(200);
                        res.write(data);
                        accept()
                    }).catch((e) => reject([e, 500, "Internal error occurred"]));
                    break;
                case "/css/index.css":
                    readFile("./static/css/index.css").then((data) => {
                        res.writeHead(200);
                        res.write(data);
                        accept()
                    }).catch((e) => reject([e, 500, "Internal error occurred"]));
                    break;
                default:
                    reject([null, 200, "Not Found"])
            }
        } catch (e) {
        }
    }))
        .then(() => res.end())
        .catch((e) => {
            res.writeHead(e[1]);
            res.write(e[2]);
            res.end();
    });
});

const port = process.env.PORT | 3000;
server.listen(port, () => {
    console.log(`Node http server is listening on port ${3000}`);
});