import { Text as PixiText } from '@pixi/react';
import { TextStyle } from 'pixi.js';
import { useMemo } from 'react';

type Props = {
  text: string;
  x: number;
  y: number;
  center?: boolean;
};

function Text({ text, x, y, center = false }: Props) {
  const textStyle = useMemo(
    () =>
      new TextStyle({
        fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
        fontSize: 14,
        fill: '#ffffff',
        stroke: '#222222',
        strokeThickness: 2,
        dropShadow: true,
        dropShadowColor: '222222',
        dropShadowBlur: 2,
        dropShadowDistance: 1,
      }),
    [],
  );

  return <PixiText text={text} anchor={center ? 0.5 : 0} x={x} y={y} style={textStyle} />;
}

export default Text;
