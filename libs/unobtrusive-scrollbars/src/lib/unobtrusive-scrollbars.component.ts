import { DOCUMENT } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
  Inject,
  Input,
} from '@angular/core';

export const PARENT_SIZE = 30;

/**
 * Check that browser uses obtrusive scrollbars
 * and set specified class on <body> element,
 * so custom CSS rules can be applied,
 * using "::-webkit-scrollbar {...}" for example.
 *
 * Usage: drop component anywhere in the app
 * (preferably in the AppComponent).
 *
 * Example:
 * ```
 *  <ngm-unobtrusive-scrollbars></ngm-unobtrusive-scrollbars>
 *  <router-outlet></router-outlet>
 * ```
 */
@Component({
  selector: 'ngm-unobtrusive-scrollbars',
  templateUrl: './unobtrusive-scrollbars.component.html',
  styleUrls: ['./unobtrusive-scrollbars.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnobtrusiveScrollbarsComponent implements AfterViewInit {
  public finished = false;

  public testParentStyle = {
    width: `${PARENT_SIZE}px`,
    height: `${PARENT_SIZE}px`,
    overflow: 'auto',
    visibility: 'hidden',
  };

  public testChildStyle = {
    width: '100%',
    height: `${PARENT_SIZE * 2}px`,
  };

  /**
   * CSS class name to apply in case scrollbars are obtrusive
   */
  @Input() public obtrusiveClassName = 'ngm-unobtrusive-scrollbars';

  @ViewChild('parent') public parent!: ElementRef<HTMLDivElement>;
  @ViewChild('child') public child!: ElementRef<HTMLDivElement>;

  constructor(
    private cd: ChangeDetectorRef,
    @Inject(DOCUMENT) private document?: Document
  ) {}

  ngAfterViewInit(): void {
    if (!this.document) {
      return;
    }

    if (PARENT_SIZE - this.child.nativeElement.clientWidth) {
      this.document.body.classList.add(this.obtrusiveClassName);
    }

    this.finished = true;
    this.cd.detectChanges();
    this.cd.detach();
  }
}
