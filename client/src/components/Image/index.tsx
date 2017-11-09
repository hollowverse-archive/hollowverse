import * as React from 'react';
import * as cx from 'classnames';
import './styles.scss';

type Props = React.ImgHTMLAttributes<Element>;

export class Image extends React.PureComponent<Props, {}> {
  render() {
    const { className, ...rest } = this.props;

    return <img className={cx(className, 'image')} {...rest} />;
  }
}
