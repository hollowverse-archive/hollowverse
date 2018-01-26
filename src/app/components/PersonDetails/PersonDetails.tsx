import * as React from 'react';
import { Label } from 'components/Label/Label';
import { Image } from 'components/Image/Image';
import * as classes from './PersonDetails.module.scss';
import { prettifyUrl } from 'helpers/prettifyUrl';
import { AsyncComponent } from 'hocs/AsyncComponent/AsyncComponent';
import { AsyncResult, isSuccessResult } from 'helpers/asyncResults';
import { mapValues } from 'lodash';
import CustomProperties from 'react-custom-properties';

type Color =
  | 'Vibrant'
  | 'LightVibrant'
  | 'DarkVibrant'
  | 'Muted'
  | 'LightMuted'
  | 'DarkMuted';

type Palette = Partial<Record<Color, string>>;

const getPalette = (
  url: string | undefined,
) => async (): Promise<Palette | null> => {
  if (!url) {
    return null;
  }

  const [Vibrant, { default: workerQuantizer }] = await Promise.all([
    import('node-vibrant'),
    import('node-vibrant/lib/quantizer/worker'),
  ]);

  try {
    const palette = await Vibrant.from(`https://cors.now.sh/${url}`)
      .useQuantizer(workerQuantizer)
      .getPalette();

    return mapValues(palette, color => (color ? color.getHex() : undefined));
  } catch (e) {
    console.error(e);
  }

  return null;
};

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
  <AsyncComponent load={getPalette(photo ? photo.url : undefined)}>
    {({ result }: { result: AsyncResult<Palette | null> }) => (
      <div className={classes.root}>
        {photo && isSuccessResult(result) && result.value !== null ? (
          <CustomProperties
            // @ts-ignore
            properties={{
              '--color-cover-primary-dark': result.value.DarkVibrant,
              '--color-cover-primary': result.value.Vibrant,
              '--color-cover-secondary': result.value.Muted,
              '--color-cover-secondary-light': result.value.LightMuted,
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
    )}
  </AsyncComponent>
);
