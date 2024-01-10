import http from "node:http";
import { WebApplication } from "@repo/lib/webapp";

(() => {
  const app = new WebApplication({});

  console.log(!!app)
})();
