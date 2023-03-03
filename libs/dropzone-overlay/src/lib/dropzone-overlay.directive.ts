import {
  GlobalPositionStrategy,
  Overlay,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Self,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { fromEvent, merge, Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

function normalizeFileList(
  multiple: boolean,
  fileList: FileList
): File | File[] | null {
  return multiple ? Array.from(fileList) : fileList.length ? fileList[0] : null;
}

@UntilDestroy()
@Directive({
  selector: 'input[ngmDropzoneOverlay]',
})
export class DropzoneOverlayDirective<T> implements OnInit, OnDestroy {
  private isDragOver = false;
  private modalOverlay?: OverlayRef;
  private componentPortal?: ComponentPortal<T>;

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('ngmDropzoneOverlay') public overlayComponent!: ComponentType<T>;

  @HostBinding('attr.hidden') public hidden = true;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private elementRef: ElementRef<HTMLInputElement>,
    private cd: ChangeDetectorRef,
    private overlay: Overlay,
    @Self() @Optional() public ngControl?: NgControl
  ) {}

  ngOnInit(): void {
    if (!this.document) {
      return;
    }

    const body = this.document.querySelector('body');

    if (!body) {
      return;
    }

    if (!this.overlayComponent) {
      return;
    }

    this.getDragAndDropStream(body).pipe(untilDestroyed(this)).subscribe();
  }

  ngOnDestroy() {
    if (this.modalOverlay) {
      this.modalOverlay.dispose();
    }
  }

  private getDragAndDropStream(body: HTMLBodyElement): Observable<DragEvent> {
    const dragOvers$ = fromEvent<DragEvent>(body, 'dragover').pipe(
      tap((e) => {
        this.preventAndStopPropagation(e);
        this.toggleDragOverClassName(true);
      })
    );

    const dragLeaves$ = fromEvent<DragEvent>(body, 'dragleave').pipe(
      // Care only when drag leaves body
      filter((e) => e.relatedTarget === null),
      tap((e) => {
        this.preventAndStopPropagation(e);
        this.toggleDragOverClassName(false);
      })
    );

    const drops$ = fromEvent<DragEvent>(body, 'drop').pipe(
      filter((e) => !!e.dataTransfer?.files.length),
      tap((e) => {
        this.preventAndStopPropagation(e);
        this.toggleDragOverClassName(false);
        this.handleFileDrop((e.dataTransfer as DataTransfer).files);
      })
    );

    return merge(dragOvers$, dragLeaves$, drops$);
  }

  private preventAndStopPropagation(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
  }

  private handleFileDrop(fileList: FileList) {
    if (this.ngControl?.control) {
      this.ngControl.control.setValue(
        normalizeFileList(this.elementRef.nativeElement.multiple, fileList)
      );
      this.ngControl.control.markAsDirty();
    }
    this.cd.markForCheck();
  }

  private toggleDragOverClassName(enabled: boolean): void {
    if (this.isDragOver === enabled) {
      return;
    }

    this.isDragOver = enabled;

    if (enabled) {
      if (!this.modalOverlay) {
        this.modalOverlay = this.initDropzoneOverlay();
      }

      this.modalOverlay.attach(this.componentPortal);

      return;
    }

    this.modalOverlay?.detach();
  }

  private initDropzoneOverlay(): OverlayRef {
    this.componentPortal = new ComponentPortal<T>(this.overlayComponent);

    const modalPosition = new GlobalPositionStrategy();
    modalPosition.top('0');
    modalPosition.left('0');

    return this.overlay.create({
      height: '100vh',
      width: '100vw',
      positionStrategy: modalPosition,
    });
  }
}
