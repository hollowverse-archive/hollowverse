import * as React from 'react';
import { Label } from 'components/Label/Label';
import { Image } from 'components/Image/Image';
import * as classes from './PersonDetails.module.scss';
import { prettifyUrl } from 'helpers/prettifyUrl';
import { AsyncComponent } from 'hocs/AsyncComponent/AsyncComponent';
import { AsyncResult, isSuccessResult } from 'helpers/asyncResults';
import Vibrant from 'node-vibrant';
import workerQuantizer from 'node-vibrant/lib/quantizer/worker';
import { mapValues } from 'lodash';

const defaultMuted = 'rgba(251, 201, 84, 0)';
const defaultVibrant = '#4435f7';

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

  try {
    const v = new Vibrant(`https://cors.now.sh/${url}`, {
      quantizer: workerQuantizer,
    });
    const palette = await v.getPalette();
    console.log(palette);

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
          <div
            style={{
              background: `linear-gradient(132deg, ${result.value
                .LightVibrant || '#4cfde9'} -20%, ${result.value.DarkVibrant ||
                'rgba(251, 201, 84, 0)'} 30%, ${result.value.Vibrant ||
                defaultVibrant} 60%, ${result.value.Muted ||
                defaultMuted} 120%)`,
            }}
            aria-hidden
            className={classes.coverPhoto}
          />
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
