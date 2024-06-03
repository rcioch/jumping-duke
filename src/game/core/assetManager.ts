import { Sound, sound } from '@pixi/sound';
import { Assets, ISpritesheetData, ISpritesheetFrameData, Spritesheet, Texture, utils } from 'pixi.js';

export type DukeTextures = {
  jumpTextures: Texture[];
  leftTextures: Texture[];
  rightTextures: Texture[];
};

function createSpriteSheet(tex: Texture, frameCount: number) {
  const frameWidth = tex.width;
  const frameHeight = Math.floor(tex.height / frameCount);

  const frameList = Array(frameCount)
    .fill(null)
    .map((_, i) => `frame${i}`);

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

const backgroundImages = ['/assets/back1.png', '/assets/back2.png', '/assets/back3.png', '/assets/back4.png'];
const dukeSprites = ['/assets/jump.png', '/assets/flipleft.png', '/assets/flipright.png'];
const soundNames = [
  '/audio/ajajaj.mp3',
  '/audio/autsh.mp3',
  '/audio/dont.mp3',
  '/audio/falling.mp3',
  '/audio/hi.mp3',
  '/audio/ihop.mp3',
  '/audio/jupi.mp3',
  '/audio/okay.mp3',
];

export class AssetManager {
  #backgroundTextures!: Texture[];
  #dukeTextures!: DukeTextures;
  #sounds!: Record<string, Sound>;

  async loadAssets() {
    const bgTextures = await Assets.load(backgroundImages);
    this.#backgroundTextures = backgroundImages.map((name) => bgTextures[name]);

    const dukeTextures = await Assets.load(dukeSprites);
    const jumpSheet = new Spritesheet(
      dukeTextures[dukeSprites[0]],
      createSpriteSheet(dukeTextures[dukeSprites[0]], 13)
    );
    const leftSheet = new Spritesheet(
      dukeTextures[dukeSprites[1]],
      createSpriteSheet(dukeTextures[dukeSprites[1]], 14)
    );
    const rightSheet = new Spritesheet(
      dukeTextures[dukeSprites[2]],
      createSpriteSheet(dukeTextures[dukeSprites[2]], 14)
    );
    await Promise.all([jumpSheet.parse(), leftSheet.parse(), rightSheet.parse()]);
    this.#dukeTextures = {
      jumpTextures: jumpSheet.animations.frames,
      leftTextures: leftSheet.animations.frames,
      rightTextures: rightSheet.animations.frames,
    };

    this.#sounds = soundNames.reduce<Record<string, Sound>>((obj, name) => {
      const alias = name.replace('.mp3', '').replace('/audio/', '');
      const s = sound.add(alias, name);
      s.preload = true;
      obj[alias] = s;
      return obj;
    }, {});
    const playPromises = Object.values(this.#sounds).map((s) => s.play());
    Object.values(this.#sounds).forEach((s) => s.stop());
    await Promise.all(playPromises);
  }

  get backgroundTextures() {
    return this.#backgroundTextures;
  }
  get dukeTextures() {
    return this.#dukeTextures;
  }
  get sounds() {
    return this.#sounds;
  }
}
