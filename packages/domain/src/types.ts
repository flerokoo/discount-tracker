export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type DummyType<T> = {
  [P in keyof T]: T[P] extends (...args: any[]) => any
    ? (...args: Parameters<T[P]>) => ReturnType<T[P]>
    : T[P];
};
