import { Spectator, createComponentFactory } from '@ngneat/spectator';
import {
  PARENT_SIZE,
  UnobtrusiveScrollbarsComponent,
} from './unobtrusive-scrollbars.component';

const MOCK_OBTRUSIVE_SCROLLBAR_WIDTH = 16;
const RANDOM_CLASS_NAMES =
  'very-important-class another-class-that-breaks-styles-if-removed';

describe('UnobtrusiveScrollbarsComponent', () => {
  let clientWidthValue = 0;

  let spectator: Spectator<UnobtrusiveScrollbarsComponent>;

  const createComponent = createComponentFactory(
    UnobtrusiveScrollbarsComponent
  );

  beforeAll(() => {
    // Easy access for mocking div element's width
    Object.defineProperty(HTMLDivElement.prototype, 'clientWidth', {
      get: () => clientWidthValue,
    });
  });

  afterEach(() => {
    // Reset body class names
    document.body.className = '';
  });

  describe('Obtrusive', () => {
    beforeEach(() => {
      // Mock obtrusive scrollbars case
      // when scrollbar affects child element's width
      clientWidthValue = PARENT_SIZE - MOCK_OBTRUSIVE_SCROLLBAR_WIDTH;
    });

    it('should assign default class', () => {
      spectator = createComponent();

      expect(document.body.className).toEqual(
        spectator.component.obtrusiveClassName
      );
    });

    it('should assign custom class', () => {
      const customClassName = 'enable-css-hacks-for-obtrusive-scrollbars';

      spectator = createComponent({
        props: { obtrusiveClassName: customClassName },
      });

      expect(document.body.className).toEqual(customClassName);
    });

    it('should NOT remove existing class names from body', () => {
      document.body.className = RANDOM_CLASS_NAMES;

      spectator = createComponent();

      expect(document.body.className).toEqual(
        `${RANDOM_CLASS_NAMES} ${spectator.component.obtrusiveClassName}`
      );
    });
  });

  describe('Unobtrusive', () => {
    beforeEach(() => {
      // Mock unobtrusive scrollbars case
      // when scrollbar doesn't affect child element's width
      clientWidthValue = PARENT_SIZE;
    });

    it('should NOT assign class', () => {
      spectator = createComponent();

      expect(document.body.className).toEqual('');
    });

    it('should NOT remove existing class names from body', () => {
      document.body.className = RANDOM_CLASS_NAMES;

      spectator = createComponent();

      expect(document.body.className).toEqual(RANDOM_CLASS_NAMES);
    });
  });

  it("should clear template after it's finished", () => {
    spectator = createComponent();

    expect(spectator.element.children.length).toBe(0);
  });
});
