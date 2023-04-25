# file-drag-and-drop

Directive that will listen for drag & drop events on host element, apply CSS
classes and update [`FormControl`](https://angular.io/api/forms/FormControl)
instance value with dropped files.

This library was generated with [Nx](https://nx.dev).

## Installation

```sh
npm install @ngx-misc/file-drag-and-drop
```

## Usage

Import the module:

```typescript
import { ReactiveFormsModule } from '@angular/forms';
import { FileDragAndDropModule } from '@ngx-misc/file-drag-and-drop';

@NgModule({
  imports: [
    ReactiveFormsModule,
    FileDragAndDropModule
  ]
})
```

In component template:

```html
<div
  ngmFileDragAndDrop
  [ngmFileDragAndDropControl]="fileControl"
  (dragOver)="handleDragOver($event)"
  (fileDrop)="handleFileDrop($event)"
>
  Drag files here...
</div>
```

Where:

- `fileControl` is a `FormControl` in host component that will receive dropped files (optional),
- `handleDragOver` is a custom handler for drag over state updates (optional).
- `handleFileDrop` is a custom handler for dropped files (optional).

## Running unit tests

Run `nx test file-drag-and-drop` to execute the unit tests.
