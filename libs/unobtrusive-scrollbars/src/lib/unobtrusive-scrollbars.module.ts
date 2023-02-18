import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnobtrusiveScrollbarsComponent } from './unobtrusive-scrollbars.component';

@NgModule({
  imports: [CommonModule],
  declarations: [UnobtrusiveScrollbarsComponent],
  exports: [UnobtrusiveScrollbarsComponent],
})
export class UnobtrusiveScrollbarsModule {}
