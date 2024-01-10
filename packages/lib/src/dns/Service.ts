import EventEmitter from "node:events";
import http from "node:http";
import https from "node:http";

type Protocol = "http" | "https";

export class Service extends EventEmitter {
  private _isAlive: boolean = true;
  private _healtCheckScheduler!: null | (() => void);
  private _healthCheckTimeoutInstance!: NodeJS.Timeout;
  constructor(public readonly address: string) {
    super();
  }

  public getBaseUrl(protocol: "http" | "https", port: number) {
    const { address } = this;
    return `${protocol}://${address}:${port}`;
  }

  public getUrl(suburl: string, protocol: "http" | "https", port: number) {
    if (!suburl.startsWith('/')) suburl = '/' + suburl;
    return this.getBaseUrl(protocol, port) + suburl;
  }

  public get isAlive() {
    return this._isAlive;
  }

  private async ping(
    url: string,
    port: number,
    protocol: Protocol = "http"
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      (protocol === "http" ? http : https)
        .get(this.getBaseUrl(protocol, port) + url, (res) => resolve(true))
        .on("error", (err) => resolve(false));
    }).then((isAlive: unknown) => {
      this._isAlive = isAlive as boolean;
      if (!isAlive) this.emit("dead");
      else this._healtCheckScheduler?.();
      return isAlive as boolean;
    });
  }

  public enableHealthCheck(
    port: number,
    url = "/health",
    interval: number = 5,
    protocol: "http" | "https" = "http"
  ) {
    this._healtCheckScheduler = () => {
      const cb = () => this.ping(url, port, protocol);
      this._healthCheckTimeoutInstance = setTimeout(cb, interval * 1000);
    };
    this._healtCheckScheduler();
  }

  public disableHealthCheck() {
    this._healtCheckScheduler = null;
    clearTimeout(this._healthCheckTimeoutInstance);
  }
}
