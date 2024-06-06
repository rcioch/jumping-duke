import { EngineContextProvider } from '@/game/components/EngineContext';
import GameContent from '@/game/components/GameContent';
import { BG_COLOR, STATS_INFO_HEIGHT, SX, SY } from '@/game/globals';
import { Stage } from '@pixi/react';

function Game() {
  return (
    <Stage width={SX} height={SY + STATS_INFO_HEIGHT} options={{ background: BG_COLOR }}>
      <EngineContextProvider>
        <GameContent />
      </EngineContextProvider>
    </Stage>
  );
}

export default Game;
