import http from "node:http";
import { discover } from "@repo/lib/service-discovery/discover";
import { Service } from "@repo/lib/service-discovery/Service";

let test1ServiceGroup: Awaited<ReturnType<typeof discover>>;

const id = "test_2 id=" + Math.round(Math.random() * 100);
const server = http.createServer(async (req, res) => {
  if (!test1ServiceGroup) {
    test1ServiceGroup = await discover("test_1", 3000);
    test1ServiceGroup.on("created", (service: Service) => {
      service.enableHealthCheck(3000);
    });
  }
  if (req.url === "/lookup") {
    const data = test1ServiceGroup.getAll().map((_) => _.address);
    res.end(JSON.stringify(data));
    return;
  }

  if (req.url === "/query") {
    http.get(`http://${test1ServiceGroup.getNext()}:3000`, (resInternal) => {
      resInternal.pipe(res);
    });
    return;
  }

  res.end(id);
});

server.listen(3000);
console.log("listenening " + id);
