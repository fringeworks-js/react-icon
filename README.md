# @fringeworks/react-icon

`@fringeworks/react-icon` is a library some will find handy, for using your own icon fonts and SVGs as typed, swappable React components.

**[日本語のREADMEはこちら](./README.ja.md)**

It contains no icons itself. It is a foundation that lets you use icon fonts (Material Symbols, Font Awesome, and so on), SVG components, and SVG sprites as they are, without converting them, and render all of them the same way: `<Icon value="home" />`. Components tailored to a specific icon set are provided by adapters (such as `@fringeworks/react-icon-material-symbols`).

## Installation

```bash
npm install @fringeworks/react-icon
```

React 18 and 19 are supported.

Load the CSS for the icon box once in your app.

```ts
import '@fringeworks/react-icon/styles.css';
```

## Usage

Create a component once per icon set from its definition, and pass the icon name as `value` where you use it. The name type comes from the set, so a misspelled name is a type error.

### Icon fonts

```tsx
import { createFontIcon } from '@fringeworks/react-icon';

// Ligatures (Material Symbols, etc.): the name itself is the text
const Symbol = createFontIcon<'home' | 'search'>({
  fontFamily: 'Material Symbols Outlined',
});

// Classes (Font Awesome, etc.): build classes from the name, with no text
const FaIcon = createFontIcon<'house' | 'user'>({
  className: (name) => `fa-solid fa-${name}`,
  text: 'none',
});

// Code points (your own font, etc.): the character mapped to the name
const MyIcon = createFontIcon({
  fontFamily: 'MyIcons',
  text: { home: '\ue900', search: '\ue901' },
});

<Symbol value="home" />;
<FaIcon value="user" />;
<MyIcon value="search" />;
```

Load each font's CSS (`@font-face`) as its set is distributed.

### SVG components

Use lucide-react or heroicons components, or SVG components you wrote, through a map from names.

```tsx
import { createSvgIcon } from '@fringeworks/react-icon';
import { House, Search } from 'lucide-react';

const Icon = createSvgIcon({ home: House, search: Search });

<Icon value="home" />; // value is 'home' | 'search'
```

The components you put in must pass the props they receive (`className`, `style`, `aria-*`, `ref`, and so on) to the `<svg>`. Their own attributes such as `fill` and `stroke` are kept as they are (so `fill="none"` on stroke icons stays).

When you write an SVG by hand, you can use `SvgIconFrame` as its container.

```tsx
import { SvgIconFrame, type SvgIconSlotProps } from '@fringeworks/react-icon';

function LogoIcon(props: SvgIconSlotProps) {
  return (
    <SvgIconFrame {...props}>
      <path d="M12 2 2 22h20z" />
    </SvgIconFrame>
  );
}
```

### SVG sprites

Render an SVG of `<symbol>`s with `<use>`. Pass the name type as a type argument.

```tsx
import { createSpriteIcon } from '@fringeworks/react-icon';

const BrandIcon = createSpriteIcon<'logo' | 'cart'>({ href: '/icons.svg' });

<BrandIcon value="cart" />; // <use href="/icons.svg#cart" />
```

Serve a sprite file from the same origin as the page (browsers do not render a file from another origin with `<use>`).

### Choosing by a string from configuration

With values of the form `prefix:name`, you can mix sets of different kinds. Use this when icons are written in configuration (JSON and so on).

```tsx
import { createPrefixedIcon } from '@fringeworks/react-icon';

const AnyIcon = createPrefixedIcon({ ms: Symbol, brand: BrandIcon });

<AnyIcon value="ms:home" />; // value is 'ms:home' | 'ms:search' | 'brand:logo' | 'brand:cart'
```

### Size and color

Every icon is drawn in a `1em` square box. Change the size with `font-size` and the color with `color` (inside text or a button, it matches the surrounding text).

```tsx
<Icon value="home" style={{ fontSize: 24, color: 'tomato' }} />
```

### Accessibility

With `aria-label` or `aria-labelledby`, the icon is announced as an image (`role="img"`). Without them, it gets `aria-hidden` as decoration.

```tsx
<button type="button">
  <Icon value="search" /> Search {/* decoration */}
</button>
<button type="button">
  <Icon value="search" aria-label="Search" /> {/* icon-only button */}
</button>
```

### Showing a skeleton while the font loads

A component made by `createFontIcon` holds the web fonts it needs in `webFonts`. You can pass it directly to `useDeferUntilWebFontReady` from [`@fringeworks/react-defer-rendering`](https://www.npmjs.com/package/@fringeworks/react-defer-rendering).

```tsx
import { useDeferUntilWebFontReady } from '@fringeworks/react-defer-rendering';

function Toolbar() {
  const { node } = useDeferUntilWebFontReady(
    <Symbol value="home" />,
    Symbol.webFonts,
    { pending: <Skeleton /> },
  );
  return node;
}
```

### Unknown names

Components made by `createSvgIcon` and `createPrefixedIcon` draw an empty box instead of throwing when they receive a name that is not in the map. Values that arrive from configuration at runtime do not break the layout.

## API

| Name                                     | Description                                                          |
| ---------------------------------------- | -------------------------------------------------------------------- |
| `createFontIcon(definition)`             | Creates an icon component from the definition of an icon font set    |
| `createFontIconProps(definition, props)` | Creates the props to pass to an icon font element                    |
| `createSvgIcon(icons)`                   | Creates an icon component from a map of names to SVG components      |
| `SvgIconFrame`                           | A `<svg>` frame component that holds child elements (`<path>`, etc.) |
| `createSpriteIcon(definition)`           | Creates an icon component from the definition of an SVG sprite set   |
| `createPrefixedIcon(icons)`              | Creates an icon component that picks from several sets by `prefix:name` |

Every component passes the props it receives to its element (`<span>` or `<svg>`). `className` and `style` are merged, and for the same property the received value wins.

### `createFontIcon`

```ts
createFontIcon<V extends string>(
  definition: FontIconDefinition<V>,
): FontIconComponent<V>
```

Creates an icon component from the definition of an icon font set. The component receives the icon name as `value` and renders it in a `<span>`.

| Definition key | Type                                                             | Description                                                              |
| -------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `fontFamily?`  | `string`                                                         | The element's `font-family`. `webFonts` is also made from it             |
| `fontWeight?`  | `number \| 'normal' \| 'bold'`                                   | The element's `font-weight`. Also put in `webFonts`                      |
| `fontStyle?`   | `'normal' \| 'italic'`                                           | The element's `font-style`. Also put in `webFonts`                       |
| `className?`   | `string \| ((name: V) => string)`                                | Classes to add to the element. A function receives the icon name         |
| `text?`        | `'name' \| 'none' \| Record<V, string> \| ((name: V) => string)` | The element's text. Defaults to `'name'`. See the table below            |

| `text` value | Element text                                                                   |
| ------------ | ------------------------------------------------------------------------------ |
| `'name'`     | The icon name itself (ligatures)                                               |
| `'none'`     | Nothing (sets drawn by classes)                                                |
| A map        | The character mapped to the name (code points). Nothing for an unknown name    |
| A function   | Its return value                                                               |

Static properties of the component:

| Property      | Type                         | Description                                                                 |
| ------------- | ---------------------------- | --------------------------------------------------------------------------- |
| `webFonts`    | `readonly FontIconWebFont[]` | The web fonts needed to render it. Empty when the definition has no `fontFamily` |
| `displayName` | `string`                     | `FontIcon(<fontFamily>)`, or `FontIcon` without `fontFamily`                |

### `createFontIconProps`

```ts
createFontIconProps<V extends string>(
  definition: FontIconDefinition<V>,
  props: FontIconProps<V>,
): ComponentPropsWithRef<'span'>
```

Creates the props for an icon font element (classes, style, text, and accessibility props). `createFontIcon` uses it internally; use it to draw an icon on an element other than `<span>` or on a component from another library.

```tsx
<i {...createFontIconProps({ fontFamily: 'MyIcons' }, { value: 'home' })} />
```

### `createSvgIcon`

```ts
createSvgIcon<V extends string>(icons: SvgIconSet<V>): SvgIconComponent<V>
```

Creates an icon component from a map of icon names to SVG components. The name type comes from the map's keys. For a name that is not in the map, it draws an empty box (`SvgIconFrame`).

### `SvgIconFrame`

```ts
SvgIconFrame(props: SvgIconFrameProps): ReactElement
```

A `<svg>` frame component that holds child elements (`<path>`, etc.). `viewBox` defaults to `'0 0 24 24'` and `fill` to `'currentColor'`; both can be changed through props. `ref` points to the `<svg>`.

### `createSpriteIcon`

```ts
createSpriteIcon<V extends string>(
  definition: SpriteIconDefinition<V>,
): SpriteIconComponent<V>
```

Creates an icon component from the definition of an SVG sprite set. The component draws a `<use>` inside an `SvgIconFrame`. When no `<symbol>` matches the name, the box is empty.

| Definition key | Type                              | Description                                                                                                                                                                                       |
| -------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `href`         | `string \| ((name: V) => string)` | The `href` of `<use>`. A string is the sprite file's URL, followed by `#` and the name (`''` refers to a `<symbol>` in the page). A function receives the icon name and returns the `href` (for example, when the `<symbol>` ids have a prefix) |

### `createPrefixedIcon`

```ts
createPrefixedIcon<S extends PrefixedIconSet>(
  icons: S,
): PrefixedIconComponent<S>
```

Creates a component that picks an icon by a `prefix:name` value from a map of prefixes to icon components. It splits `value` at the first `:` and passes the name and props to the prefix's component.

- Besides `value`, it only receives `PrefixedIconSlotProps`, which can be passed to components of any kind (`className`, `style`, `id`, `title`, `role`, `aria-hidden`, `aria-label`, `aria-labelledby`, `aria-describedby`). `ref` and event handlers cannot be passed.
- For a prefix that is not in the map, or a value without `:`, it draws an empty box (`<span class="frg-icon">`).
- When the prefix exists but the name is not in that set, that set's component decides what to draw.

### CSS classes

| Class          | Elements                                          | Description                                                                                          |
| -------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `frg-icon`     | Every icon                                        | A `1em` square box                                                                                   |
| `frg-fonticon` | Icon font icons                                   | Enables ligatures and keeps letter spacing, wrapping, and so on from being inherited from the surroundings |
| `frg-svgicon`  | SVG components, `SvgIconFrame`, and sprite icons  | Has no CSS rules. A class for selecting SVG icons together                                           |

The rules have zero specificity (`:where()`), so your own CSS overrides them as is.

### Types

| Type                       | Description                                                                                         |
| -------------------------- | --------------------------------------------------------------------------------------------------- |
| `FontIconDefinition<V>`    | The definition for `createFontIcon` and `createFontIconProps`                                       |
| `FontIconText<V>`          | The definition's `text`                                                                             |
| `FontIconProps<V>`         | Props of a component made by `createFontIcon` (`value` and `<span>` props)                          |
| `FontIconComponent<V>`     | A component made by `createFontIcon`                                                                |
| `FontIconWebFont`          | An element of `webFonts` (`family`, `weight?`, `style?`)                                            |
| `SvgIconSlotProps`         | Props `createSvgIcon` passes to the components you put in (`<svg>` props)                           |
| `SvgIconSet<V>`            | The map of names to SVG components passed to `createSvgIcon`                                        |
| `SvgIconProps<V>`          | Props of a component made by `createSvgIcon`                                                        |
| `SvgIconComponent<V>`      | A component made by `createSvgIcon`                                                                 |
| `SvgIconFrameProps`        | Props of `SvgIconFrame` (`<svg>` props)                                                             |
| `SpriteIconDefinition<V>`  | The definition for `createSpriteIcon`                                                               |
| `SpriteIconProps<V>`       | Props of a component made by `createSpriteIcon`                                                     |
| `SpriteIconComponent<V>`   | A component made by `createSpriteIcon`                                                              |
| `PrefixedIconSlotProps`    | Props a component made by `createPrefixedIcon` receives and passes to the map's components (excluding `value`) |
| `PrefixedIconSet`          | The map of prefixes to icon components passed to `createPrefixedIcon`                               |
| `PrefixedIconValue<S>`     | The `value` type of a component made by `createPrefixedIcon` (`prefix:name`)                        |
| `PrefixedIconProps<S>`     | Props of a component made by `createPrefixedIcon`                                                   |
| `PrefixedIconComponent<S>` | A component made by `createPrefixedIcon`                                                            |

## License

MIT
