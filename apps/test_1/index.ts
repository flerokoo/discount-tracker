import http from "http";

const id = "test_1 id=" + Math.round(Math.random() * 100);
const server = http.createServer((req, res) => {
  if (req.url === "/internal") {
    res.end(id + " answering internal > >> >  >");
    return;
  }

  res.end(id);
});
 
server.listen(3000);

console.log("THIS  " + id);
