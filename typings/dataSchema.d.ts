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

type EventSchema = {
  id: number;
  userId: string;
  userComment: string;
  postedAt: number;
  quote: string;
  sourceName: string;
  sourceUrl: string;
};

export interface UserSchema {
  displayName: string;
  userAvatar: string;
}
