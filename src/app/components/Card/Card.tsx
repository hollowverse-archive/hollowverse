import * as React from 'react';
import * as classes from './Card.module.scss';

type Props = {
  title: string;
  subtitle?: string;
  moreLink: string;
  children: JSX.Element[] | JSX.Element;
};
export const Card = (props: Props) => (
  <div className={classes.card}>
    <a href={props.moreLink}>
      <div className={classes.cardSubtitle}>{props.subtitle}</div>
      <div className={classes.cardTitle}>{props.title}</div>
    </a>
    {props.children}
  </div>
);
