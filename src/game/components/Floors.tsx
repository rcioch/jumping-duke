import { DrawCallbackType, EngineProps } from '@/game/components/types';
import { COLOR_DARK_GRAY, COLOR_GRAY, GRID_HEIGHT, SX } from '@/game/globals';
import { Graphics } from '@pixi/react';

function Floors({ engine }: EngineProps) {
  const floors = engine.floors;

  const drawFloors: DrawCallbackType = (gr) => {
    gr.clear();

    floors.reduce((gr, line, idx) => {
      const y = idx * GRID_HEIGHT;
      let x1 = 0,
        x2 = SX;
      for (const gap of line.gaps) {
        x2 = gap.left;
        gr.lineStyle(1, COLOR_GRAY)
          .moveTo(x1, y)
          .lineTo(x2, y)
          .moveTo(x1, y + 2)
          .lineTo(x2, y + 2)
          .lineStyle(1, COLOR_DARK_GRAY)
          .moveTo(x1, y + 1)
          .lineTo(x2, y + 1);
        x1 = gap.right;
        x2 = SX;
      }
      gr.lineStyle(1, COLOR_GRAY)
        .moveTo(x1, y)
        .lineTo(x2, y)
        .moveTo(x1, y + 2)
        .lineTo(x2, y + 2)
        .lineStyle(1, COLOR_DARK_GRAY)
        .moveTo(x1, y + 1)
        .lineTo(x2, y + 1);

      return gr;
    }, gr);
  };

  return <Graphics draw={drawFloors} />;
}

export default Floors;
