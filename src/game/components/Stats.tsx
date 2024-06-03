import Text from '@/game/components/Text';
import { DrawCallbackType, EngineProps } from '@/game/components/types';
import { BG_COLOR, STATS_INFO_HEIGHT, SX, SY } from '@/game/globals';
import { Container, Graphics } from '@pixi/react';
import { useCallback } from 'react';

function Stats({ engine }: EngineProps) {
  const drawBg = useCallback<DrawCallbackType>((g) => {
    g.beginFill(BG_COLOR).drawRect(0, 0, SX, STATS_INFO_HEIGHT).endFill();
  }, []);

  return (
    <Container x={0} y={SY} width={SX} height={STATS_INFO_HEIGHT}>
      <Graphics draw={drawBg} />
      <Text text={`Level ${engine.level}`} x={15} y={2} />
      <Text text='JumpingDuke - 25 Anniversary Edition, coded by RC in 1998, 1999, 2024' x={SX / 4} y={2} />
    </Container>
  );
}

export default Stats;
