// based on ./fullDatabaseSchema.json

export interface NotablePersonSchema {
  name: string,
  photoUrl: string,
  labels: string[],
  events: Event[],
  users: User[],
}

export interface Event {
  id: number,
  quote: string,
  sourceName: string,
  sourceUrl: string,
  userId: string,
  userDisplayName: string, // to be moved to User
  userComment: string, // to be moved to User
  userAvatar: string,
  postedAt: number,
}

export interface User {
  displayName: string,
  userAvatar: string,
}
