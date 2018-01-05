type LogTypeToPayload = {
  PAGE_REQUESTED: {
    url: string;
  };
  PAGE_LOADED: {
    url: string;
  };
};

export type LogType = keyof LogTypeToPayload;

export type LogPayload<T extends LogType> = LogTypeToPayload[T];

export type LogEvent<T extends LogType> = {
  type: T;
  payload: LogPayload<T> & {
    timestamp: Date;
    isServer: boolean;
  };
};

export type LogRequestBody<T extends LogType> = LogEvent<T>;
