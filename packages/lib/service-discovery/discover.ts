import dns from "node:dns/promises";
import { Service } from "./Service";
import EventEmitter from "node:events";

type ServiceGroupEvents = 'created' | 'dead'

const lookup = async (hostname: string) => {
  const result = await dns.lookup(hostname, { all: true });
  return result.map((_) => _.address);
};

const discover = async (hostname: string, port: number) => {
  const emitter = new EventEmitter();
  let rrIndex = 0;
  let services: Service[] = [];

  const update = async () => {
    services.forEach((_) => _.removeAllListeners()); // dereference
    const ips = await lookup(hostname);
    services = ips.map((_) => new Service(_));
    for (const service of services) {
      emitter.emit("created", service);

      service.on("dead", () => {
        emitter.emit("dead", service);
        const ii = services.indexOf(service);
        services.splice(ii, 1);
        if (services.length === 0) update();
      });
    }
    rrIndex = 0;
  };

  try {
    await update();
  } catch (err) {
    throw new Error(`Error when discovering ${hostname} services`);
  }

  return {
    getNextAlive() {
      if (services.length === 0)
        throw new Error(`No service address: ${hostname}`);
      rrIndex = (rrIndex + 1) % services.length;
      return services[rrIndex];
    },

    getAll() {
      return services;
    },

    get aliveCount() {
      return services.length;
    },

    on(evt: ServiceGroupEvents, listener: (...args: any[]) => void) {
      return emitter.on(evt, listener);
    },

    off(evt: ServiceGroupEvents, listener: (...args: any[]) => void) {
      return emitter.off(evt, listener);
    },
  };
};

export { discover };
