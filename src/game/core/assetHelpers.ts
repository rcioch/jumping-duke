import { ISpritesheetData, ISpritesheetFrameData, Texture, utils } from 'pixi.js';

export function createSpriteSheet(tex: Texture, frameCount: number) {
  const frameWidth = tex.width;
  const frameHeight = Math.floor(tex.height / frameCount);

  const frameList = Array(frameCount)
    .fill(null)
    .map((_, i) => `${tex.textureCacheIds[0]}-frame${i}`);

  const frameSheet: ISpritesheetData = {
    meta: {
      image: tex.textureCacheIds[0],
      size: { w: tex.width, h: tex.height },
      scale: 1,
    },
    frames: frameList.reduce<utils.Dict<ISpritesheetFrameData>>((obj, frame, idx) => {
      const item: ISpritesheetFrameData = {
        frame: { x: 0, y: idx * frameHeight, w: frameWidth, h: frameHeight },
        sourceSize: { w: frameWidth, h: frameHeight },
        spriteSourceSize: { x: 0, y: 0, w: frameWidth, h: frameHeight },
      };
      obj[frame] = item;
      return obj;
    }, {}),
    animations: {
      frames: frameList,
    },
  };
  return frameSheet;
}
