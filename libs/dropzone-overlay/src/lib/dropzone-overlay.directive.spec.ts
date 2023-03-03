import { OverlayModule } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator';
import { DropzoneOverlayDirective } from './dropzone-overlay.directive';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'test-dropzone',
  template: `drop file(s) here`,
})
class TestDropzoneComponent {}

const MOCK_FILE = { name: 'DONTREADME.md' };

describe('DropzoneOverlayDirective', () => {
  let spectator: SpectatorDirective<
    DropzoneOverlayDirective<TestDropzoneComponent>
  >;
  const createDirective = createDirectiveFactory<
    DropzoneOverlayDirective<TestDropzoneComponent>
  >({
    directive: DropzoneOverlayDirective,
    imports: [OverlayModule, ReactiveFormsModule],
  });

  const fileControl = new FormControl();

  beforeEach(() => {
    spectator = createDirective(
      `<button (click)="fileInput.click()">
        Upload
      </button>

      <input
        #fileInput
        [ngmDropzoneOverlay]="testDropzoneComponent"
        [formControl]="fileControl"
        [accept]="accept"
        [multiple]="multiple"
        type="file"
      >`,
      {
        hostProps: {
          fileControl,
          testDropzoneComponent: TestDropzoneComponent,
        },
      }
    );
  });

  it('should get the instance', () => {
    const instance = spectator.directive;
    expect(instance).toBeDefined();
  });

  it('should hide the input', () => {
    expect(spectator.query('input')?.hasAttribute('hidden')).toBe(true);
  });

  it('should handle drag and leave', () => {
    expect(document.body.querySelector('test-dropzone')).toBeFalsy();

    document.body.dispatchEvent(
      new DragEvent('dragover', { relatedTarget: document.body })
    );

    expect(document.body.querySelector('test-dropzone')).toBeTruthy();

    const dragLeave = new DragEvent('dragleave', { relatedTarget: null });
    document.body.dispatchEvent(dragLeave);
    spectator.detectChanges();

    expect(document.body.querySelector('test-dropzone')).toBeFalsy();
  });

  it('should handle drag and drop', () => {
    expect(document.body.querySelector('test-dropzone')).toBeFalsy();

    document.body.dispatchEvent(
      new DragEvent('dragover', { relatedTarget: document.body })
    );

    expect(document.body.querySelector('test-dropzone')).toBeTruthy();

    const drop = new DragEvent('drop', {
      dataTransfer: { files: [MOCK_FILE] } as unknown as DataTransfer,
    });
    document.body.dispatchEvent(drop);

    spectator.detectChanges();

    expect(document.body.querySelector('test-dropzone')).toBeFalsy();

    expect(spectator.directive.ngControl?.value).toEqual(MOCK_FILE);
  });
});
