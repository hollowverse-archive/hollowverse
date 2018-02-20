// tslint:disable no-http-string max-line-length no-object-literal-type-assertion quotemark
import { NotablePersonQuery } from 'api/types';

export const stubNotablePersonQueryResponse: NotablePersonQuery = {
  notablePerson: {
    commentsUrl: 'http://hollowverse.com/tom-hanks/',
    name: 'Tom Hanks',
    editorialSummary: null,
    mainPhoto: null,
    relatedPeople: [
      {
        mainPhoto: null,
        name: 'Al Pacino',
        slug: 'Al_Pacino',
      },
    ],
    slug: 'Tom_Hanks',
    summary: null,
  },
};

export const notablePersonWithEditorialSummaryQueryResponse: NotablePersonQuery = {
  notablePerson: {
    commentsUrl: 'http://hollowverse.com/tom-hanks/',
    name: 'Tom Hanks',
    editorialSummary: {
      author: 'Tom Kershaw',
      lastUpdatedOn: '2012-04-05',
      nodes: [
        {
          id: '020e9702-42ae-40c4-957d-19da0367d161',
          type: 'text',
          text:
            "Politically, Hanks falls squarely in the Democrat/liberal camp, like the vast majority of his Hollywood counterparts. He's stuck up for quite a few liberal causes like gay marriage and the environment, and has a large collection of electric and hybrid cars.",
          sourceUrl: null,
          sourceTitle: null,
          parentId: '2e5cf554-71bc-42bd-802d-411bfef15068',
        },
        {
          id: '0929c823-1f60-466d-a69f-332508ea6796',
          type: 'text',
          text:
            'He even slandered his old church–The Church of Jesus Christ of Latter Day Saints (Mormons) when they donated money to advance proposition 8 in California, effectively banning gay marriage.',
          sourceUrl:
            'http://mormonmatters.org/2009/03/11/does-tom-hanks-hate-mormons/',
          sourceTitle: 'Does Tom Hanks Hate Mormons?',
          parentId: '8336dd0f-76e7-45df-b2cf-41a4eb617a46',
        },
        {
          id: '25b14ef1-9b83-4442-b463-66c05b7961e3',
          type: 'text',
          text:
            "His religious beliefs are about as diverse as the characters he has played. Hanks' childhood was a hodgepodge of divorce and step-parents, each with their own views. Hanks has identified with everything from Mormonism to his most recent and enduring faith–Greek Orthodox. In his own words:",
          sourceUrl: null,
          sourceTitle: null,
          parentId: '2fa315c4-80d3-403d-8fe6-8551a0577dd4',
        },
        {
          id: '4f2b79e7-fd89-47af-ba59-7e5e5113d21f',
          type: 'text',
          text:
            'The major religion I was exposed to in the first 10 years of my life was Catholicism. My stepmother became a Mormon. My aunt, whom I lived with for a long time, was a Nazarene, which is kind of ultra-super Methodist, and in high school, all my friends were Jews. For years I went to Wednesday-night Bible studies with my church group. So I had this peripatetic overview of various faiths, and the one thing I got from that was the intellectual pursuit involved. There was a lot of great stuff to think about.',
          sourceUrl:
            'http://www.johnsanidopoulos.com/2009/05/orthodoxy-of-tom-hanks.html',
          sourceTitle: 'Mystagogy: The Orthodoxy of Tom Hanks',
          parentId: 'f20b575f-46c2-43f6-a610-919efdce145e',
        },
        {
          id: '767ce7a4-db21-47e1-bb25-e98e011e0ce5',
          type: 'text',
          text:
            'Hanks backed Obama in 2008, posting a video on his Myspace page, explaining his position.',
          sourceUrl: 'http://www.myspace.com/video/vid/33546997',
          sourceTitle: 'Beware: Celebrity Endorsement Video by Tom Hanks',
          parentId: '617f0454-e586-4631-baac-44c2a6889593',
        },
        {
          id: '882b92ff-cc0d-451d-96cd-7d7bc9b1da64',
          type: 'text',
          text:
            'In 2012, Hanks forcefully said he would back Obama once again and, despite widespread opinion to the opposite effect, said Obama had exceeded his expectations, saying:',
          sourceUrl: null,
          sourceTitle: null,
          parentId: '0e2fc2cd-40ca-4e0f-a1ee-c4675fbae77c',
        },
        {
          id: '89740c08-4795-48d9-afb0-eb6722b8003f',
          type: 'paragraph',
          text: null,
          sourceUrl: null,
          sourceTitle: null,
          parentId: null,
        },
        {
          id: '94e61f0d-e0e8-443e-871e-15337ff79c81',
          type: 'paragraph',
          text: null,
          sourceUrl: null,
          sourceTitle: null,
          parentId: '4b37b4f8-95dd-4924-903b-8e0a76824f23',
        },
        {
          id: '95d14bf8-024b-4836-8162-f7bae0cda9d9',
          type: 'text',
          text: 'Tom Hanks was born in Concord, California.',
          sourceUrl: null,
          sourceTitle: null,
          parentId: '89740c08-4795-48d9-afb0-eb6722b8003f',
        },
        {
          id: 'cd31fcb5-49a1-4c7e-8eea-1e4c437b71f5',
          type: 'text',
          text:
            'Hanks is said to be a deeply religious man and goes to church regularly.',
          sourceUrl:
            'http://www.beliefnet.com/Celebrity-Faith-Database/H/Tom-Hanks.aspx',
          sourceTitle: 'Tom Hanks',
          parentId: '32caca6a-2379-4c9c-9c9e-7d00254fe646',
        },
        {
          id: 'db8110f0-5b1e-4895-a6c8-e1a88aafeccc',
          type: 'text',
          text:
            "Hanks' second and current wife, Rita Wilson, was raised a member of the Greek Orthodox Church and Hanks has taken on her religion.",
          sourceUrl: null,
          sourceTitle: null,
          parentId: '6fe7210a-20cd-4994-bb07-18a5c48aafe6',
        },
        {
          id: 'e4f1198a-7cc4-4c1a-ac5b-c3e796f31a35',
          type: 'text',
          text:
            "If you would have told me a few years ago that 'don't ask, don't tell' would be repealed and about a billion jobs at General Motors and Chrysler would have been saved because the president was smart enough and strong enough and bold enough to do so, I would have said, 'Wow. That's a good president, I think I'll vote for him again.'",
          sourceUrl:
            'http://www.politico.com/blogs/click/0611/Tom_Hanks_Im_voting_for_Obama_again.html',
          sourceTitle: "Tom Hanks: I'm Voting for Obama Again",
          parentId: '94e61f0d-e0e8-443e-871e-15337ff79c81',
        },
        {
          id: 'e6a8b0ba-4721-47c0-b3db-56a2eafa0db6',
          type: 'text',
          text: 'Politics is just like a box of chocolates…',
          sourceUrl: null,
          sourceTitle: null,
          parentId: '7bbc711c-174e-48fc-8e42-eac3dbdc71a6',
        },
        {
          id: 'e916d67c-fdb1-42de-8c8e-5a23bcdff1b9',
          type: 'text',
          text:
            "He doesn't seem to acknowledge the billions upon billions of taxpayer dollars that were funneled to some of the country's richest men during that bailout, but hey, that's what the PR machine is all about.",
          sourceUrl: null,
          sourceTitle: null,
          parentId: '2ce08d61-2758-4bca-be15-d4f2cd2079ef',
        },
        {
          id: 'f20b575f-46c2-43f6-a610-919efdce145e',
          type: 'paragraph',
          text: null,
          sourceUrl: null,
          sourceTitle: null,
          parentId: 'c2f0a449-b1c7-4326-9724-9bbc96cbd965',
        },
        {
          id: 'fc03f967-414f-4384-a4ee-287f2e7c9592',
          type: 'text',
          text:
            'However, he quickly rescinded his statement but fought fire with fire, contributing his star power to raising over $44 million to defeat proposition 8–which passed anyway.',
          sourceUrl:
            'http://www.latimes.com/news/local/la-moneymap,0,2198220.htmlstory',
          sourceTitle: 'Proposition 8: Tracking the Money',
          parentId: 'd41ccdfb-4107-4667-a521-321ab282f6ad',
        },
        {
          id: '01d17400-b483-4548-b7db-9f2d3a9db5ab',
          type: 'text',
          text:
            ' Hanks has said that his greatest motivation for being a church-goer is to come in contact with the great unanswered questions mankind has always asked, questions that, for the most part, only religion attempts to answer.',
          sourceUrl:
            'http://www.johnsanidopoulos.com/2009/05/orthodoxy-of-tom-hanks.html',
          sourceTitle: 'Mystagogy: The Orthodoxy of Tom Hanks',
          parentId: '32caca6a-2379-4c9c-9c9e-7d00254fe646',
        },
        {
          id: '2fa315c4-80d3-403d-8fe6-8551a0577dd4',
          type: 'paragraph',
          text: null,
          sourceUrl: null,
          sourceTitle: null,
          parentId: null,
        },
        {
          id: 'c2f0a449-b1c7-4326-9724-9bbc96cbd965',
          type: 'quote',
          text: null,
          sourceUrl: null,
          sourceTitle: null,
          parentId: null,
        },
        {
          id: '6fe7210a-20cd-4994-bb07-18a5c48aafe6',
          type: 'paragraph',
          text: null,
          sourceUrl: null,
          sourceTitle: null,
          parentId: null,
        },
        {
          id: '32caca6a-2379-4c9c-9c9e-7d00254fe646',
          type: 'paragraph',
          text: null,
          sourceUrl: null,
          sourceTitle: null,
          parentId: null,
        },
        {
          id: '7bbc711c-174e-48fc-8e42-eac3dbdc71a6',
          type: 'heading',
          text: null,
          sourceUrl: null,
          sourceTitle: null,
          parentId: null,
        },
        {
          id: '2e5cf554-71bc-42bd-802d-411bfef15068',
          type: 'paragraph',
          text: null,
          sourceUrl: null,
          sourceTitle: null,
          parentId: null,
        },
        {
          id: '8336dd0f-76e7-45df-b2cf-41a4eb617a46',
          type: 'paragraph',
          text: null,
          sourceUrl: null,
          sourceTitle: null,
          parentId: null,
        },
        {
          id: 'd41ccdfb-4107-4667-a521-321ab282f6ad',
          type: 'paragraph',
          text: null,
          sourceUrl: null,
          sourceTitle: null,
          parentId: null,
        },
        {
          id: '617f0454-e586-4631-baac-44c2a6889593',
          type: 'paragraph',
          text: null,
          sourceUrl: null,
          sourceTitle: null,
          parentId: null,
        },
        {
          id: '0e2fc2cd-40ca-4e0f-a1ee-c4675fbae77c',
          type: 'paragraph',
          text: null,
          sourceUrl: null,
          sourceTitle: null,
          parentId: null,
        },
        {
          id: '4b37b4f8-95dd-4924-903b-8e0a76824f23',
          type: 'quote',
          text: null,
          sourceUrl: null,
          sourceTitle: null,
          parentId: null,
        },
        {
          id: '2ce08d61-2758-4bca-be15-d4f2cd2079ef',
          type: 'paragraph',
          text: null,
          sourceUrl: null,
          sourceTitle: null,
          parentId: null,
        },
      ],
    },
    mainPhoto: null,
    relatedPeople: [
      {
        mainPhoto: null,
        name: 'Al Pacino',
        slug: 'Al_Pacino',
      },
    ],
    slug: 'Tom_Hanks',
    summary: null,
  },
} as NotablePersonQuery;
