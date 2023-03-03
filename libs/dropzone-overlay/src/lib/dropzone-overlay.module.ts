import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropzoneOverlayDirective } from './dropzone-overlay.directive';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  imports: [CommonModule, OverlayModule],
  declarations: [DropzoneOverlayDirective],
  exports: [DropzoneOverlayDirective],
})
export class DropzoneOverlayModule {}
