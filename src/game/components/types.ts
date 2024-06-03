import { Graphics } from '@pixi/react';
import { ComponentProps } from 'react';
import Engine from '@/game/core/engine';

export type DrawCallbackType = NonNullable<ComponentProps<typeof Graphics>['draw']>;

export type EngineProps = {
  engine: Engine;
};
