import Background from '@/game/components/Background';
import Duke from '@/game/components/Duke';
import { useEngine } from '@/game/components/EngineContext';
import Floors from '@/game/components/Floors';
import Stats from '@/game/components/Stats';
import Text from '@/game/components/Text';
import { SX, SY } from '@/game/globals';

function GameContent() {
  const { engine, error } = useEngine();

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
