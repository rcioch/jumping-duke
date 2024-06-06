import Engine from '@/game/core/engine';
import { Graphics } from '@pixi/react';
import { ComponentProps } from 'react';

export type DrawCallbackType = NonNullable<ComponentProps<typeof Graphics>['draw']>;

export type EngineProps = {
  engine: Engine;
};
