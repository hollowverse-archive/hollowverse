type PayloadsByType = {
  PAGE_REQUESTED: {
    url: string;
  };
  PAGE_RENDERED: {
    url: string;
  };
};

export type LogType = keyof PayloadsByType;

export type LogPayload<T extends LogType> = PayloadsByType[T];

export type LogEvent<T extends LogType> = {
  event: T;
  payload: LogPayload<T>;
};

export type LogRequestBody<T extends LogType> = LogEvent<T>;
