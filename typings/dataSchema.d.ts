// based on ./fullDatabaseSchema.json

export interface NotablePersonSchema {
  name?: string,
  photoUrl?: string,
  labels?: string[],
  events?: {
    id: number,
    quote: string,
    sourceName: string,
    sourceUrl: string,
    userId: string,
    userDisplayName: string,
    userComment: string,
    userAvatar: string,
    postedAt: number,
  }[]
}
