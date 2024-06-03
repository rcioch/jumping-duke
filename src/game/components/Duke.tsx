import { Sprite } from '@pixi/react';
import { EngineProps } from './types';

export function Duke({ engine }: EngineProps) {
  const dukeTexture = engine.dukeTextureInfo;
  const dukeTexture2 = engine.dukeTexture2Info;

  return (
    <>
      <Sprite texture={dukeTexture.texture} x={dukeTexture.x} y={dukeTexture.y} />
      {dukeTexture2 ? <Sprite texture={dukeTexture2.texture} x={dukeTexture2.x} y={dukeTexture2.y} /> : null}
    </>
  );
}

export default Duke;
