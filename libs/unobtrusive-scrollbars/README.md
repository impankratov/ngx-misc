# unobtrusive-scrollbars

Library provides an easy way to check if browser's scrollbars are obtrusive and
apply custom CSS class (`ngm-unobtrusive-scrollbars` by default) to `<body>`
element to allow easy customization.

Based on [Two Browsers Walked Into a
Scrollbar](https://www.filamentgroup.com/lab/scrollbars/) solution.

This library was generated with [Nx](https://nx.dev).

## Installation

```sh
npm install @ngx-misc/unobtrusive-scrollbars
```

## Usage

Import the module:

```typescript
import { UnobtrusiveScrollbarsModule } from '@ngx-misc/unobtrusive-scrollbars';

@NgModule({
  imports: [
    UnobtrusiveScrollbarsModule
  ]
})
```

Use in component template (preferably in app component):

```html
<ngm-unobtrusive-scrollbars></ngm-unobtrusive-scrollbars>

... other code
```

Add necessary CSS styles in app's root styles.scss file:

```scss
.ngm-unobtrusive-scrollbars {
  ::-webkit-scrollbar {
    width: 0.5rem;
  }

  ::-webkit-scrollbar-thumb {
    background-color: gray;
    border-radius: 50%;
  }
}
```

## Running unit tests

Run `nx test unobtrusive-scrollbars` to execute the unit tests.
