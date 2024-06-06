import { AssetManager } from '@/game/core/assetManager';
import Engine from '@/game/core/engine';
import { useApp, useTick } from '@pixi/react';
import { createContext, useContext, useEffect, useState } from 'react';

type EngineContextValue = {
  engine?: Engine;
  error?: string;
};

const EngineContext = createContext<EngineContextValue>({});

export function EngineContextProvider({ children }: { children: React.ReactNode }) {
  const [engine, setEngine] = useState<Engine>();
  const [error, setError] = useState<string>();

  const pixiApp = useApp();
  useEffect(() => {
    pixiApp.ticker.maxFPS = 30;
  }, [pixiApp.ticker]);

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

  const [, setFrame] = useState(0);
  useTick(() => {
    engine?.update();
    setFrame((frame) => frame + 1);
  });

  return <EngineContext.Provider value={{ engine, error }}>{children}</EngineContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useEngine = () => useContext(EngineContext);
