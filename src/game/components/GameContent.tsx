import Background from '@/game/components/Background';
import Duke from '@/game/components/Duke';
import Floors from '@/game/components/Floors';
import Stats from '@/game/components/Stats';
import Text from '@/game/components/Text';
import { AssetManager } from '@/game/core/assetManager';
import Engine from '@/game/core/engine';
import { SX, SY } from '@/game/globals';
import { useApp, useTick } from '@pixi/react';
import { useEffect, useState } from 'react';

function GameContent() {
  const [engine, setEngine] = useState<Engine>();
  const [error, setError] = useState('');

  const pixiApp = useApp();
  useEffect(() => {
    pixiApp.ticker.maxFPS = 30;
  });

  const [, setCounter] = useState(0);
  useTick(() => {
    if (engine) {
      engine.update();
    }
    setCounter((count) => count + 1);
  });

  useEffect(() => {
    async function loadAssets() {
      try {
        const assetManager = new AssetManager();
        await assetManager.loadAssets();
        const engine = new Engine(assetManager);
        setEngine(engine);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unable to run game.');
        }
      }
    }
    loadAssets();
  }, []);

  if (engine) {
    return (
      <>
        <Background engine={engine} />
        <Floors engine={engine} />
        <Duke engine={engine} />
        <Stats engine={engine} />
      </>
    );
  }

  if (error) {
    return <Text text={error} x={SX / 2} y={SY / 2} center />;
  }

  return null;
}

export default GameContent;
