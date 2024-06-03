type Key = 'space' | 'up' | 'left' | 'right';
type KeyState = Record<Key, boolean>;

const keyMap: Record<string, Key> = {
  Space: 'space',
  KeyW: 'up',
  ArrowUp: 'up',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
};

export class Controller {
  readonly #keys: KeyState;

  constructor() {
    this.#keys = {
      space: false,
      up: false,
      left: false,
      right: false,
    };

    window.addEventListener('keydown', (event) => this.keydownHandler(event));
    window.addEventListener('keyup', (event) => this.keyupHandler(event));
  }

  get keys() {
    return this.#keys;
  }

  private keydownHandler(event: KeyboardEvent) {
    const key = keyMap[event.code];
    if (key) {
      this.keys[key] = true;
    }
  }

  private keyupHandler(event: KeyboardEvent) {
    const key = keyMap[event.code];
    if (key) {
      this.keys[key] = false;
    }
  }
}
