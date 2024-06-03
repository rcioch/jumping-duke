import { AssetManager, DukeTextures } from '@/game/core/assetManager';
import { Controller } from '@/game/core/controller';
import { Floors } from '@/game/core/floors';
import { GRID_HEIGHT, SX } from '@/game/globals';
import { Graphics, Texture } from 'pixi.js';

type MoveType = 'nomove' | 'jump' | 'left' | 'right' | 'falldown' | 'headhit';

export type TextureInfo = {
  texture: Texture;
  x: number;
  y: number;
};

export default class Engine {
  readonly #assetManager: AssetManager;
  readonly #controller = new Controller();
  readonly #floors: Floors = new Floors();
  readonly #textures: DukeTextures;
  #dukeTexture!: TextureInfo;
  #dukeTexture2?: TextureInfo;

  #level = 1;
  #nextLevel = 0;
  #moveType: MoveType = 'nomove';
  #movePhase = 0;
  #xduke = SX / 2;
  #yduke = 7;

  constructor(assetManager: AssetManager) {
    this.#assetManager = assetManager;
    this.#textures = assetManager.dukeTextures;
    this.#floors.initLevel(this.#level);
    this.updateDuke();
    this.#assetManager.sounds.hi.play();
  }

  get assetManager() {
    return this.#assetManager;
  }

  update() {
    this.#floors.update();
    this.updateDuke();
  }

  drawFloors(gr: Graphics) {
    this.#floors.draw(gr);
  }

  get level() {
    return this.#level;
  }

  get dukeTextureInfo() {
    return this.#dukeTexture;
  }
  get dukeTexture2Info() {
    return this.#dukeTexture2;
  }

  private canDrop(yduke: number = this.#yduke) {
    return this.#floors.canDrop(this.#xduke, yduke);
  }

  private updateDuke() {
    if (this.#nextLevel !== 0) {
      if (this.#nextLevel === 1) {
        this.#assetManager.sounds.jupi.play();
      } else {
        this.#assetManager.sounds.ajajaj.play();
      }

      this.#level += this.#nextLevel;
      this.#floors.initLevel(this.level);
      this.#yduke = 7;
      if (this.#nextLevel === -1) this.#yduke = 1;

      this.#nextLevel = 0;
    }

    if (this.#moveType === 'nomove') {
      if (this.#controller.keys.left) {
        this.#moveType = 'left';
        this.#assetManager.sounds.okay.play();
      }

      if (this.#controller.keys.right) {
        this.#moveType = 'right';
        this.#assetManager.sounds.okay.play();
      }

      if (this.#controller.keys.up || this.#controller.keys.space)
        if (this.canDrop(this.#yduke - 1)) {
          this.#moveType = 'jump';
          this.#assetManager.sounds.ihop.play();
        } else {
          this.#moveType = 'headhit';
          this.#assetManager.sounds.autsh.play();
        }

      if (this.canDrop()) {
        this.#moveType = 'falldown';
        this.#assetManager.sounds.falling.play();
      }
    }

    // carefully hand-crafted animations ;)
    // hopefully all is exactly as in original
    this.#dukeTexture2 = undefined;
    switch (this.#moveType) {
      case 'nomove': {
        this.#dukeTexture = {
          texture: this.#textures.jumpTextures[0],
          x: this.#xduke - 35,
          y: this.#yduke * GRID_HEIGHT + 3 - GRID_HEIGHT,
        };
        break;
      }
      case 'jump': {
        const yy =
          [-10, -30, -60, -80, -85, -70, -60, -GRID_HEIGHT, -GRID_HEIGHT, -GRID_HEIGHT, -GRID_HEIGHT][
            this.#movePhase
          ] ?? 0;

        this.#dukeTexture = {
          texture: this.#textures.jumpTextures[this.#movePhase + 1],
          x: this.#xduke - 35,
          y: this.#yduke * GRID_HEIGHT + 3 - GRID_HEIGHT + yy,
        };

        if (++this.#movePhase === 11) {
          this.#movePhase = 0;
          this.#moveType = 'nomove';
          if (--this.#yduke === 0) this.#nextLevel = 1;
        }
        break;
      }
      case 'left': {
        this.#dukeTexture = {
          texture: this.#textures.leftTextures[this.#movePhase],
          x: this.#xduke - 96 + this.#movePhase * 4,
          y: this.#yduke * GRID_HEIGHT - 12 - GRID_HEIGHT,
        };

        if (this.#xduke < 12) {
          // wraparound
          this.#dukeTexture2 = {
            texture: this.#textures.leftTextures[this.#movePhase],
            x: this.#xduke - 96 + this.#movePhase * 4 + SX,
            y: this.#yduke * GRID_HEIGHT - 12 - GRID_HEIGHT,
          };
        }

        this.#xduke -= 4;
        if (++this.#movePhase === 14) {
          this.#movePhase = 0;
          this.#moveType = 'nomove';
          this.#xduke -= 4;
          if (this.#xduke < 0) this.#xduke += SX;
        }

        if (this.canDrop()) {
          this.#movePhase = 1;
          this.#moveType = 'falldown';
          this.#assetManager.sounds.falling.play();
        }
        break;
      }
      case 'right': {
        this.#dukeTexture = {
          texture: this.#textures.rightTextures[this.#movePhase],
          x: this.#xduke - 32 - this.#movePhase * 4,
          y: this.#yduke * GRID_HEIGHT - 12 - GRID_HEIGHT,
        };

        if (this.#xduke > SX - 12) {
          // wraparound
          this.#dukeTexture2 = {
            texture: this.#textures.rightTextures[this.#movePhase],
            x: this.#xduke - 32 - this.#movePhase * 4 - SX,
            y: this.#yduke * GRID_HEIGHT - 12 - GRID_HEIGHT,
          };
        }

        this.#xduke += 4;
        if (++this.#movePhase === 14) {
          this.#movePhase = 0;
          this.#moveType = 'nomove';
          this.#xduke += 4;
          if (this.#xduke > SX) this.#xduke -= SX;
        }

        if (this.canDrop()) {
          this.#movePhase = 1;
          this.#moveType = 'falldown';
          this.#assetManager.sounds.falling.play();
        }
        break;
      }
      case 'falldown': {
        const yy = [1, 2, 6, 10, 20, 35, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 30, 45, 0][this.#movePhase] ?? 0;
        const frame = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 6, 5, 6, 7][this.#movePhase] ?? 0;

        if (this.#movePhase === 6) {
          if (++this.#yduke === 8) this.#nextLevel = -1;
          if (this.canDrop()) this.#movePhase = 19;
        } else if (this.#movePhase === 23) {
          if (++this.#yduke === 8) this.#nextLevel = -1;
          if (this.canDrop()) {
            this.#movePhase = 19;
          } else {
            this.#movePhase = 6;
          }
        }

        this.#dukeTexture = {
          texture: this.#textures.jumpTextures[frame],
          x: this.#xduke - 35,
          y: this.#yduke * GRID_HEIGHT + 3 - GRID_HEIGHT + yy,
        };

        if (++this.#movePhase === 11) {
          this.#movePhase = 0;
          this.#moveType = 'nomove';
        }
        break;
      }
      case 'headhit': {
        const yy = [0, -1, -2, 0, 0, 0, 0][this.#movePhase] ?? 0;
        const frame = [1, 2, 3, 12, 8, 9, 10, 11][this.#movePhase] ?? 0;

        this.#dukeTexture = {
          texture: this.#textures.jumpTextures[frame],
          x: this.#xduke - 35,
          y: this.#yduke * GRID_HEIGHT + 3 - GRID_HEIGHT + yy,
        };

        if (++this.#movePhase === 8) {
          this.#movePhase = 0;
          this.#moveType = 'nomove';
        }
        break;
      }
      default:
        this.#moveType satisfies never;
        throw new Error(`Missed a case: ${this.#moveType}`);
    }
  }
}
