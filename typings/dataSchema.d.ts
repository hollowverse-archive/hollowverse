// based on ./fullDatabaseSchema.json

export interface NotablePersonSchema {
  name: string,
  photoUrl: string,
  labels: string[],
  events: Event[]
}

export interface Event {
  id: number,
  quote: string,
  sourceName: string,
  sourceUrl: string,
  userId: string,
  userDisplayName: string, // to be removed => Add to a fake user.
  userComment: string, // to be removed
  userAvatar: string,
  postedAt: number,
}
