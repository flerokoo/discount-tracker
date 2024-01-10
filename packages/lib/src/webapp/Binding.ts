import { InjectionToken } from "tsyringe";
import { Ctor } from "./types";

export class Binding<T> {
  constructor(
    public token: InjectionToken,
    public value: Ctor<T>,
  ) {}

  as(token: InjectionToken) {
    this.token = token;
    return this;
  }
}

export const bind = <T>(type: Ctor<T>) => new Binding(type.name, type);
