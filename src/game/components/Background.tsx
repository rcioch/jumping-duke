import { EngineProps } from '@/game/components/types';
import { SX, SY } from '@/game/globals';
import { TilingSprite } from '@pixi/react';

function Background({ engine }: EngineProps) {
  const bgTextures = engine.assetManager.backgroundTextures;
  const level = engine.level;

  return (
    <TilingSprite
      texture={bgTextures[level % bgTextures.length]}
      width={SX}
      height={SY}
      tilePosition={{ x: 0, y: 0 }}
    />
  );
}

export default Background;
