export interface IDatabaseSchema {
  notablePersons: INotablePersonSchema,
  users: IUserSchema,
}

export interface INotablePersonSchema {
  name: string,
  photoUrl: string,
  labels: string[],
  events: IEventSchema[],
}

export interface IEventSchema {
  id: number,
  quote: string,
  sourceName: string,
  sourceUrl: string,
  userId: string,
  userComment: string,
  postedAt: number,
}

export interface IUserSchema {
  displayName: string,
  userAvatar: string,
}
