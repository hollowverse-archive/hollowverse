// will be updated
export interface PilotData {
  pilotNotable: PilotNotable
}

export interface PilotNotable {
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
