export interface DatabaseSchema {
  notablePersons: NotablePersonSchema,
  users: UserSchema,
}

export interface NotablePersonSchema {
  name: string,
  photoUrl: string,
  labels: string[],
  events: EventSchema[],
}

export interface EventSchema {
  id: number,
  quote: string,
  sourceName: string,
  sourceUrl: string,
  userId: string,
  userComment: string,
  postedAt: number,
}

export interface UserSchema {
  displayName: string,
  userAvatar: string,
}
