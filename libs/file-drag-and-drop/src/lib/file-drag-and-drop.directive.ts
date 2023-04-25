import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { fromEvent, merge, Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

function normalizeFileList(
  multiple: boolean,
  fileList: FileList
): File | File[] | null {
  return multiple ? Array.from(fileList) : fileList.length ? fileList[0] : null;
}

export type DroppedFile = ReturnType<typeof normalizeFileList>;

/**
 * Handle drag & drop event on an element
 * - apply 'ngm-file-drag-and-drop--dragover' CSS class
 * - update FormControl value on file drop
 * - emit fileDrop output on file drop
 */
@UntilDestroy()
@Directive({
  selector: '[ngmFileDragAndDrop]',
})
export class FileDragAndDropDirective implements OnInit {
  private classList: DOMTokenList = this.elementRef.nativeElement.classList;
  private _dragOverClassName = 'ngm-file-drag-and-drop';
  private isDragOver = false;

  @HostBinding('class')
  public className = 'ngm-file-drag-and-drop';

  @Input('ngmFileDragAndDrop')
  set dragOverClassName(v: string) {
    this._dragOverClassName = `${v || this._dragOverClassName}--dragover`;
  }

  @Input('ngmFileDragAndDropMultiple') public multiple = false;

  @Input('ngmFileDragAndDropControl') public control?: FormControl;

  @Output() public fileDrop: EventEmitter<DroppedFile> =
    new EventEmitter<DroppedFile>();

  @Output() public dragOver: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  constructor(
    private elementRef: ElementRef<HTMLInputElement>,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getDragAndDropStream(this.elementRef.nativeElement)
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  private getDragAndDropStream(element: HTMLElement): Observable<DragEvent> {
    const dragOvers$ = fromEvent<DragEvent>(element, 'dragover').pipe(
      // Skip events while control is disabled
      filter(() => (this.control ? this.control.enabled : true)),
      tap((e) => {
        this.preventAndStopPropagation(e);
        this.toggleDragOverClassState(true);
      })
    );

    const dragLeaves$ = fromEvent<DragEvent>(element, 'dragleave').pipe(
      tap((e) => {
        this.preventAndStopPropagation(e);
        this.toggleDragOverClassState(false);
      })
    );

    const drops$ = fromEvent<DragEvent>(element, 'drop').pipe(
      filter((e) => !!e.dataTransfer?.files.length),
      tap((e) => {
        this.preventAndStopPropagation(e);
        this.toggleDragOverClassState(false);
        this.handleFileDrop((e.dataTransfer as DataTransfer).files);
      })
    );

    return merge(dragOvers$, dragLeaves$, drops$);
  }

  private preventAndStopPropagation(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
  }

  private handleFileDrop(fileList: FileList): void {
    const files = normalizeFileList(this.multiple, fileList);

    if (this.control) {
      this.control.setValue(files);
      this.control.markAsDirty();
    }

    this.fileDrop.emit(files);
    this.cd.markForCheck();
  }

  private toggleDragOverClassState(enabled: boolean): void {
    if (this.isDragOver === enabled) {
      return;
    }

    this.isDragOver = enabled;
    this.toggleDragOverClassName(this.isDragOver);
    this.dragOver.emit(this.isDragOver);
    this.isDragOver = enabled;
  }

  private toggleDragOverClassName(dragOver: boolean): void {
    dragOver
      ? this.classList.add(this._dragOverClassName)
      : this.classList.remove(this._dragOverClassName);
  }
}
