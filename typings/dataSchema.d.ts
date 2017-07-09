export interface DatabaseSchema {
  notablePersons: NotablePersonSchema;
  users: UserSchema;
}

export interface NotablePersonSchema {
  name: string;
  photoUrl: string;
  labels: string[];
  events: EventSchema[];
}

type BaseEventSchema = {
  id: number;
  userId: string;
  userComment: string;
  postedAt: number;
};

type QuoteSchema = {
  quote: string;
  sourceName: string;
  sourceUrl: string;
};

export type EventWithQuoteSchema = BaseEventSchema & QuoteSchema;

export type EventSchema = BaseEventSchema | EventWithQuoteSchema;

export interface UserSchema {
  displayName: string;
  userAvatar: string;
}
