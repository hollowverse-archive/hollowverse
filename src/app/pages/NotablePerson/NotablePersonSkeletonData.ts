export const NotablePersonQuery = {
  notablePerson: {
    name: 'Joanne Smith',
    // The part of the URL to that notable person's page, e.g. Tom_Hanks
    mainPhoto: {
      url: string,
      sourceUrl: string,
      colorPalette: {
        vibrant: string,
        darkVibrant: string,
        muted: string,
        darkMuted: string,
      },
    },
    summary: string,
    // This is used to load Facebook comments on the client.
    //
    // This should be treated as an opaque value because the protocol and path parts
    // of this URL might be different depending on whether the notable person
    // was imported from the old Hollowverse website or not. The trailing slash may
    // also be included or removed.
    //
    // Example: http://hollowverse.com/tom-hanks/ or https://hollowverse.com/Bill_Gates
    commentsUrl: string,
    relatedPeople: {
      // The part of the URL to that notable person's page, e.g. Tom_Hanks
      slug: string,
      name: string,
      mainPhoto: {
        url: string,
      },
    },
    // The content from the old Hollowverse
    editorialSummary: {
      author: string,
      lastUpdatedOn: string,
      nodes: {
        id: string,
        parentId: string,
        text: string,
        type: EditorialSummaryNodeType,
        sourceUrl: string,
        sourceTitle: string,
      },
    },
  },
};
