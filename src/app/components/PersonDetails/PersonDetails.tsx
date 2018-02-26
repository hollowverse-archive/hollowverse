import React from 'react';
import { Label } from 'components/Label/Label';
import { Image } from 'components/Image/Image';
import classes from './PersonDetails.module.scss';
import { prettifyUrl } from 'helpers/prettifyUrl';
import Helmet from 'react-helmet-async';
import { oneLineTrim } from 'common-tags';

type PersonDetailsProps = {
  summary: string | null;
  name: string;
  photo: {
    url: string;
    sourceUrl: string;
    colorPalette: {
      vibrant: string | null;
      darkVibrant: string | null;
      muted: string | null;
      darkMuted: string | null;
    } | null;
  } | null;
  labels?: Array<{ text: string; id: string }>;
};

export const PersonDetails = ({
  summary,
  name,
  photo,
  labels,
}: PersonDetailsProps) => {
  let colors: string[] = [];
  if (photo && photo.colorPalette) {
    const { vibrant, muted, darkVibrant, darkMuted } = photo.colorPalette;
    colors = [darkVibrant || darkMuted, vibrant || muted].filter(
      color => color !== null,
    ) as string[];
  }

  return (
    <div className={classes.root}>
      {photo &&
      photo.colorPalette &&
      photo.colorPalette.darkVibrant !== null ? (
        <Helmet>
          <meta name="theme-color" content={photo.colorPalette.darkVibrant} />
        </Helmet>
      ) : null}
      <div className={classes.coverBackgroundWrapper} aria-hidden>
        <div
          className={classes.coverBackground}
          style={
            colors.length === 2
              ? {
                  background: oneLineTrim`linear-gradient(
                    130deg,
                    #4cfde9 -20%,
                    transparent 30%,
                    transparent 60%,
                    rgb(253, 188, 9) 85%
                  ) no-repeat,
                  linear-gradient(
                    130deg,
                    transparent -20%,
                    ${colors[0]} 30%,
                    ${colors[1]} 60%,
                    transparent 85%
                  ) no-repeat`,
                }
              : undefined
          }
        />
      </div>
      {photo ? (
        <a
          className={classes.photoLink}
          href={photo.sourceUrl}
          title={`Image source: ${prettifyUrl(photo.sourceUrl)}`}
        >
          <Image className={classes.photo} src={photo.url} alt={name} />
          <span className="sr-only">
            Image source: {prettifyUrl(photo.sourceUrl)}
          </span>
        </a>
      ) : null}
      <div className={classes.content}>
        <h1 className={classes.name}>
          <div className={classes.caption}>
            Religion, politics, and ideas of
          </div>
          {name}
        </h1>
        {labels && labels.length > 0 ? (
          <ul aria-label="Labels" className={classes.labels}>
            {labels.map(({ id, text }) => (
              <li className={classes.listItem} key={id}>
                <Label text={text} />
              </li>
            ))}
          </ul>
        ) : null}
        {summary && (
          <div className={classes.summary}>
            {summary.split('\n').map(paragraph => <p>{paragraph}</p>)}
          </div>
        )}
      </div>
    </div>
  );
};
