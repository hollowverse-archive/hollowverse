import * as React from 'react';
import * as classes from './Card.module.scss';

type Props = {
  title: string | JSX.Element;
  subtitle?: string | JSX.Element;
  moreLink?: string;
  children: JSX.Element[] | JSX.Element;
};
export const Card = (props: Props) => (
  <div className={classes.card}>
    <div className={classes.cardSubtitle}>{props.subtitle}</div>
    <div className={classes.cardTitle}>{props.title}</div>
    <div className={classes.cardContent}>{props.children}</div>
  </div>
);
