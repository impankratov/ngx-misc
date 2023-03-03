import 'jest-preset-angular/setup-jest';

Object.defineProperty(window, 'DragEvent', {
  value: class DragEvent extends Event {
    constructor(type: string, eventInitDict?: EventInit) {
      super(type, eventInitDict);
      Object.assign(this, eventInitDict)
    }
  },
});
