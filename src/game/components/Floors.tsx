import { EngineProps } from '@/game/components/types';
import { Graphics } from '@pixi/react';

function Floors({ engine }: EngineProps) {
  return <Graphics draw={(g) => engine.drawFloors(g)} />;
}

export default Floors;
