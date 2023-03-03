# dropzone-overlay

Directive that will listen for drag & drop events on
[`Window`](https://developer.mozilla.org/en-US/docs/Web/API/Window) object,
render custom overlay and provide and set associated
[`FormControl`](https://angular.io/api/forms/FormControl) instance value with
dropped files.

This library was generated with [Nx](https://nx.dev).

## Installation

```sh
npm install @ngx-misc/dropzone-overlay
```

## Usage

Import the module:

```typescript
import { ReactiveFormsModule } from '@angular/forms';
import { DropzoneOverlayModule } from '@ngx-misc/dropzone-overlay';

@NgModule({
  imports: [
    ReactiveFormsModule,
    DropzoneOverlayModule
  ]
})
```

In component template:

```html
<input
  [ngmDropzoneOverlay]="customDropzoneComponent"
  [formControl]="fileControl"
  [accept]="accept"
  [multiple]="true"
  type="file"
/>
```

Where:
- `customDropzoneComponent` is a component class that will be rendered in full
  screen overlay while files are dragged over the window,
- `fileControl` is a `FormControl` in host component,
- `accept` is a `string` of [acceptable file
  types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept),
- `multiple` is a `boolean` for [multiple file
  selection](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#multiple).

Because `<input[type=file]>` can be cumbersome to style, you can hide it and
use `<button>` element for interaction, like so:

```html
<button (click)="fileInput.click()">Upload</button>

<input
  #fileInput
  [ngmDropzoneOverlay]="customDropzoneComponent"
  [formControl]="fileControl"
  [accept]="accept"
  [multiple]="true"
  type="file"
  [hidden]="true"
/>
```

## Running unit tests

Run `nx test dropzone-overlay` to execute the unit tests.
