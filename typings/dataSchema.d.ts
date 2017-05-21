// old version, will be deleted:
export interface PilotData {
  pilotNotable?: {
    notablePersonId: number,
    notablePersonName: string,
    notablePersonPictureUrl: string,
    notablePersonLabels: string[],
    notablePersonEvents: {
      eventId: number,
      eventQuote: string,
      eventSource: string,
      eventSourceName: string,
      userComment: string,
      userAvatar: string,
      postedBy: string,
      postedAt: number,
    },
  }
}

// new version based on ./fullDatabaseSchema.json

export interface NotablePerson {
  name: string,
  photoUrl: string,
  labels: string[],
  events: {
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
