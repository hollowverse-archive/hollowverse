import * as React from 'react';
import { Label } from 'components/Label/Label';
import { Image } from 'components/Image/Image';
import * as classes from './PersonDetails.module.scss';
import { prettifyUrl } from 'helpers/prettifyUrl';
import Helmet from 'react-helmet-async';

type PersonDetailsProps = {
  summary: string | null;
  name: string;
  photo: {
    url: string;
    sourceUrl: string;
    colorPalette: {
      vibrant: string | null;
      lightVibrant: string | null;
      darkVibrant: string | null;
      muted: string | null;
      lightMuted: string | null;
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
    colors = [
      photo.colorPalette.darkVibrant,
      photo.colorPalette.vibrant,
      photo.colorPalette.darkVibrant,
      photo.colorPalette.lightVibrant,
      photo.colorPalette.darkMuted,
      photo.colorPalette.muted,
      photo.colorPalette.lightMuted,
    ].filter(color => color !== null) as string[];
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
      <div className={classes.coverPhotoWrapper} aria-hidden>
        <div
          className={classes.coverPhoto}
          style={
            colors.length >= 4
              ? {
                  background: `linear-gradient(
                    130deg,
                    ${colors[0]} -20%,
                    ${colors[1]} 30%,
                    ${colors[2]} 60%,
                    ${colors[3]} 120%
                  )`,
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
      <h1 className={classes.name}>
        <div className={classes.caption}>Religion, politics, and ideas of</div>
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
          {summary
            .split('\n')
            .map((paragraph, i) => <p key={i}>{paragraph}</p>)}
        </div>
      )}
    </div>
  );
};
