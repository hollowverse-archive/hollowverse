import { css } from 'aphrodite/no-important';
import * as React from 'react';
import { common } from '../../common.styles';
import { styles as eventStyles } from './../notablePerson/events.styles';
import { styles as npStyles } from './../notablePerson/notablePerson.styles';
import { styles } from './shadowComponent.styles';

class ShadowComponentClass extends React.Component<{}, undefined> {
  render() {
    return (
      <div className={css(common.page)}>
        <div
          className={css(
            npStyles.notablePersonTitleContainer,
            styles.shadowTopContainer,
          )}
        >
          <span className={css(styles.shadowPhoto)} />
          <div className={css(npStyles.notablePersonText)}>
            <h1 className={css(npStyles.notablePersonTitle)}>
              Religion, politics, and ideas of...
            </h1>
            <h1
              className={css(
                common.titleTypography,
                npStyles.notablePersonName,
                styles.shadowName,
              )}
            />
            <span
              className={css(npStyles.notablePersonLabel, styles.shadowLabels)}
            />
            <span
              className={css(npStyles.notablePersonLabel, styles.shadowLabels)}
            />
            <span
              className={css(npStyles.notablePersonLabel, styles.shadowLabels)}
            />
          </div>
        </div>
        {this.renderShadowNotablePersonEvents([1, 2, 3])}
      </div>
    );
  }
  renderShadowNotablePersonEvents(n: number[]) {
    return n.map((f, i) =>
      <div
        key={i}
        className={css(eventStyles.eventContent, styles.shadowContainer)}
      >
        <span
          className={css(npStyles.notablePersonLabel, styles.shadowContent)}
        />
        <span
          className={css(
            npStyles.notablePersonLabel,
            styles.shadowContent,
            styles.shadowContentIndented,
          )}
        />
        <span
          className={css(
            npStyles.notablePersonLabel,
            styles.shadowContent,
            styles.shadowContentIndented,
          )}
        />
        <span
          className={css(
            npStyles.notablePersonLabel,
            styles.shadowContent,
            styles.shadowContentIndented,
          )}
        />
        <div className={css(eventStyles.userContainer)}>
          <span
            className={css(
              npStyles.notablePersonLabel,
              styles.shadowContent,
              styles.shadowUserComment,
            )}
          />
          <span
            className={css(
              npStyles.notablePersonLabel,
              styles.shadowContent,
              styles.shadowUsername,
            )}
          />
        </div>
      </div>,
    );
  }
}

export const ShadowComponent = ShadowComponentClass;
