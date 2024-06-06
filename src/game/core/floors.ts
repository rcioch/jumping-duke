import { LINE_COUNT, SPEED, SX } from '@/game/globals';

const MAX_SPANS = 10;

type Gap = {
  left: number;
  right: number;
};

type LineStat = {
  timeToNewGap: number;
  probability: number;
  maxGap: number;
  gaps: Gap[];
};

export class Floors {
  #stats!: LineStat[];
  #level = 1;

  constructor() {
    this.initLevel(0);
  }

  initLevel(level: number) {
    this.#level = level;

    let m = 300 - level * 20;
    if (level >= 10) {
      m = 200 - level * 10;
    }

    this.#stats = Array(LINE_COUNT)
      .fill(null)
      .map<LineStat>((_, i) => ({
        timeToNewGap: 0,
        probability: 99 - i - level * 4,
        maxGap: m - 10 * i,
        gaps: [],
      }))
      .reverse();

    if (level === 1) {
      this.#stats[this.#stats.length - 1].probability = 100;
    }
  }

  update() {
    this.#stats = this.#stats.map<LineStat>((stat, idx) =>
      idx % 2 === 0 ? this.#scrollLeft(stat) : this.#scrollRight(stat),
    );
  }

  #scrollLeft(stat: LineStat) {
    const newGaps = stat.gaps
      .map((gap) => ({
        left: gap.left - SPEED,
        right: gap.right - SPEED,
      }))
      .filter((gap) => gap.right > 0);

    const newStat: LineStat = {
      ...stat,
      gaps: newGaps,
    };

    if (stat.timeToNewGap >= 0) {
      newStat.timeToNewGap--;
    } else if (Math.floor(Math.random() * 100) > stat.probability && stat.gaps.length < MAX_SPANS) {
      newStat.gaps.push({
        left: SX,
        right: SX + 50 + this.#level * 10,
      });
      newStat.timeToNewGap = 75 + this.#level * 5 + Math.floor(Math.random() * stat.maxGap);
    }
    return newStat;
  }

  #scrollRight(stat: LineStat) {
    const newGaps = stat.gaps
      .map((gap) => ({
        left: gap.left + SPEED,
        right: gap.right + SPEED,
      }))
      .filter((gap) => gap.left < SX);

    const newStat: LineStat = {
      ...stat,
      gaps: newGaps,
    };

    if (stat.timeToNewGap >= 0) {
      newStat.timeToNewGap--;
    } else if (Math.floor(Math.random() * 100) > stat.probability && stat.gaps.length < MAX_SPANS) {
      newStat.gaps.unshift({
        left: -(50 + this.#level * 10),
        right: 0,
      });
      newStat.timeToNewGap = 75 + this.#level * 5 + Math.floor(Math.random() * stat.maxGap);
    }
    return newStat;
  }

  get floors() {
    return this.#stats;
  }

  canDrop(x: number, y: number) {
    if (y >= 0 && y < this.#stats.length) {
      return this.#stats[y].gaps.some((gap) => x - 12 > gap.left && x + 12 < gap.right);
    }
    return false;
  }
}
