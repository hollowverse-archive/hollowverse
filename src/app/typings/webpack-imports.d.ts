type SpriteSymbol = {
  id: string;
  viewBox: string;
  content: string;
  url: string;
};

declare module '*.module.scss' {
  const classes: Record<string, string>;
  export = classes;
}

declare module 'icons/*.svg' {
  const url: string;
  export default url;
}

declare module 'svg-sprite-loader!*.svg' {
  const symbol: SpriteSymbol;
  export default symbol;
}

declare module '!!file-loader!*' {
  const url: string;
  export default url;
}

declare module 'file-loader!*' {
  const url: string;
  export default url;
}

declare module '*.html' {
  const str: string;
  export default str;
}

declare module '!!svg-react-loader*' {
  import * as React from 'react';
  type Props = React.SVGAttributes<SVGSVGElement>;
  const SVGComponent: React.ComponentClass<Props>;
  export default SVGComponent;
}

declare module '!!json-loader!*' {
  const json: object;
  export default json;
}

declare module 'json-loader!*' {
  const json: object;
  export default json;
}
