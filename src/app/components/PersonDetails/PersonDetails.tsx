import * as React from 'react';
import { Label } from 'components/Label/Label';
import { Image } from 'components/Image/Image';
import * as classes from './PersonDetails.module.scss';
import { prettifyUrl } from 'helpers/prettifyUrl';
import { AsyncComponent } from 'hocs/AsyncComponent/AsyncComponent';
import { AsyncResult, isSuccessResult } from 'helpers/asyncResults';
import CustomProperties from 'react-custom-properties';

type PersonDetailsProps = {
  summary: string | null;
  name: string;
  photo: {
    url: string;
    sourceUrl: string;
  } | null;
  labels?: Array<{ text: string; id: string }>;
};

export const PersonDetails = ({
  summary,
  name,
  photo,
  labels,
}: PersonDetailsProps) => (
  <div className={classes.root}>
    {photo && photo.colorPalette.vibrant !== null ? (
      <CustomProperties
        // @ts-ignore
        properties={{
          '--color-cover-primary-dark': photo.colorPalette.darkVibrant,
          '--color-cover-primary': photo.colorPalette.vibrant,
          '--color-cover-secondary': photo.colorPalette.muted,
          '--color-cover-secondary-light': photo.colorPalette.lightMuted,
        }}
      >
        <div className={classes.coverPhotoWrapper} aria-hidden>
          <div className={classes.coverPhoto} />
        </div>
      </CustomProperties>
    ) : null}
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
        {summary
          .split('\n')
          .map((paragraph, i) => <p key={i}>{paragraph}</p>)}
      </div>
    )}
  </div>
);
