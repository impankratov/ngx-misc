import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator';
import { FileDragAndDropDirective } from './file-drag-and-drop.directive';

const MOCK_FILE = { name: 'DONTREADME.md' };

describe('FileDragAndDropDirective', () => {
  let spectator: SpectatorDirective<FileDragAndDropDirective>;

  const createDirective = createDirectiveFactory<FileDragAndDropDirective>({
    directive: FileDragAndDropDirective,
    imports: [ReactiveFormsModule],
  });

  const fileControl = new FormControl();
  const dragOverClassName = 'ngm-file-drag-and-drop--dragover';

  beforeEach(() => {
    spectator = createDirective(
      `<div
        ngmFileDragAndDrop
        [ngmFileDragAndDropControl]="fileControl"
       >Drag files here...</div>`,
      { hostProps: { fileControl } }
    );

    jest.spyOn(spectator.directive.fileDrop, 'emit');
    jest.spyOn(spectator.directive.dragOver, 'emit');
  });

  it('should get the instance', () => {
    const instance = spectator.directive;
    expect(instance).toBeDefined();
  });

  it('should apply base CSS class', () => {
    expect(spectator.element.classList.contains('ngm-file-drag-and-drop')).toBe(
      true
    );
  });

  it('should handle drag and leave', () => {
    expect(spectator.element.classList.value).not.toContain(dragOverClassName);

    spectator.dispatchMouseEvent(spectator.element, 'dragover');

    expect(spectator.directive.dragOver.emit).toHaveBeenCalledWith(true);
    expect(spectator.element.classList.value).toContain(dragOverClassName);

    spectator.dispatchMouseEvent(spectator.element, 'dragleave');

    expect(spectator.directive.dragOver.emit).toHaveBeenCalledWith(false);
    expect(spectator.element.classList.value).not.toContain(dragOverClassName);

    expect(spectator.directive.fileDrop.emit).not.toHaveBeenCalled();
    expect(spectator.directive.control?.value).toEqual(null);
  });

  it('should handle drag and drop', () => {
    expect(spectator.element.classList.value).not.toContain(dragOverClassName);

    spectator.dispatchMouseEvent(spectator.element, 'dragover');

    expect(spectator.directive.dragOver.emit).toHaveBeenCalledWith(true);
    expect(spectator.element.classList.value).toContain(dragOverClassName);

    spectator.dispatchMouseEvent(
      spectator.element,
      'drop',
      0,
      0,
      new DragEvent('drop', {
        dataTransfer: { files: [MOCK_FILE] } as unknown as DataTransfer,
      })
    );

    expect(spectator.directive.dragOver.emit).toHaveBeenCalledWith(false);
    expect(spectator.element.classList.value).not.toContain(dragOverClassName);

    expect(spectator.directive.fileDrop.emit).toHaveBeenCalledWith(MOCK_FILE);
    expect(spectator.directive.control?.value).toEqual(MOCK_FILE);
  });
});
