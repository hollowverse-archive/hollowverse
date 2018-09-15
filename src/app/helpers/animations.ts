import { Theme } from '@material-ui/core/styles';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { UserSelectProperty } from 'csstype';

export const createPulseAnimation = (theme: Theme) => {
  const definition = {
    '@keyframes pulse-animation': {
      '0%, 100%': {
        opacity: 0.2,
      },

      '50%': {
        opacity: 1,
      },
    },
  };

  const usage: CSSProperties = {
    animation: `pulse-animation ${theme.transitions.duration.standard * 3}ms ${
      theme.transitions.easing.easeInOut
    } infinite`,
    animationFillMode: 'both',
  };

  const photoProps: CSSProperties = {
    color: 'transparent',
    background: theme.palette.divider,
    userSelect: 'none' as UserSelectProperty,
  };

  const textProps: CSSProperties = {
    ...photoProps,
    borderRadius: theme.shape.borderRadius,
  };

  return { definition, usage, textProps, photoProps };
};
