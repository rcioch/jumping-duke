import { DrawCallbackType, EngineProps } from '@/game/components/types';
import { Graphics } from '@pixi/react';
import { useCallback } from 'react';

function Floors({ engine }: EngineProps) {
  const drawFloors = useCallback<DrawCallbackType>(
    (g) => {
      engine.drawFloors(g);
    },
    [engine],
  );

  return <Graphics draw={drawFloors} />;
}

export default Floors;
