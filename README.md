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

Put in components that draw an `<svg>`. The created component draws the component inside the icon box `<span>`. The props it receives (`className`, `style`, `aria-*`, `ref` and so on) go to the `<span>`, and no props are passed to the component you put in. The component's own attributes such as `fill` and `stroke` are kept as they are (`fill="none"` on line icons is preserved), and the size follows the box.

When you write an SVG by hand, put in a component that draws an `<svg>`, or use `SvgIconFrame` directly.

```tsx
import { SvgIconFrame } from '@fringeworks/react-icon';

<SvgIconFrame aria-label="Logo">
  <path d="M12 2 2 22h20z" />
</SvgIconFrame>;
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

### Size, position and color

Every icon is drawn in a square box. Change the color with `color` (inside text or a button, it matches the surrounding text). By default the size looks the same as the surrounding text, and specifying `font-size` sets that size.

The default size is the size of the surrounding text multiplied by the following two factors (`calc(1em * var(--frg-icon-scale, 1) * var(--frg-icon-glyphScale, 1))`).

| CSS variable            | Default | Description                                                                                                                                                                                                                                                                           |
| ----------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--frg-icon-scale`      | `1`     | The scale for the context (a number): how many times the size that looks the same as the surrounding text. Components that hold icons (buttons and so on) set it for their icons                                                                                                      |
| `--frg-icon-glyphScale` | `1`     | The scale of the set (a number): the factor that makes the set's glyphs look the same size as the surrounding text. Adapters for sets with a lot of space around the glyphs set it (for example, `1.25` in react-icon-material-symbols)                                               |
| `--frg-icon-size`       | —       | The size (a length), for setting the size directly instead of with the factors. When it is set, the factors are not used for the size                                                                                                                                                 |
| `--frg-icon-centerY`    | `0.37`  | The vertical position (a number): how high above the baseline of the text the middle of the icon is placed, as a multiple of the size of the surrounding text. The default is the middle of Japanese text and Latin capitals. Change it to match, for example, text in lowercase only |

Because the scale for the context and the scale of the set are separate, components such as buttons can make icons look about the same size with any set, without knowing which set is built in.

The vertical position is based on the baseline of the text. Where text is drawn in the line box differs between fonts, but the height of the text above the baseline is about the same in any font. The position is the same in text and in components that lay out items in a row. To line up an icon with text in a row (flex), use `align-items: baseline` (with `center`, the icon lines up with the middle of the line box, which shifts depending on the font).

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

| Name                                     | Description                                                             |
| ---------------------------------------- | ----------------------------------------------------------------------- |
| `createFontIcon(definition)`             | Creates an icon component from the definition of an icon font set       |
| `createFontIconProps(definition, props)` | Creates the props to pass to an icon font element                       |
| `createSvgIcon(icons)`                   | Creates an icon component from a map of names to SVG components         |
| `SvgIconFrame`                           | A `<svg>` frame component that holds child elements (`<path>`, etc.)    |
| `createSpriteIcon(definition)`           | Creates an icon component from the definition of an SVG sprite set      |
| `createPrefixedIcon(icons)`              | Creates an icon component that picks from several sets by `prefix:name` |

Every component passes the props it receives to its element (`<span>` or `<svg>`). `className` and `style` are merged, and for the same property the received value wins.

### `createFontIcon`

```ts
createFontIcon<V extends string>(
  definition: FontIconDefinition<V>,
): FontIconComponent<V>
```

Creates an icon component from the definition of an icon font set. The component receives the icon name as `value` and renders it in a `<span>`.

| Definition key | Type                                                             | Description                                                      |
| -------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| `fontFamily?`  | `string`                                                         | The element's `font-family`. `webFonts` is also made from it     |
| `fontWeight?`  | `number \| 'normal' \| 'bold'`                                   | The element's `font-weight`. Also put in `webFonts`              |
| `fontStyle?`   | `'normal' \| 'italic'`                                           | The element's `font-style`. Also put in `webFonts`               |
| `className?`   | `string \| ((name: V) => string)`                                | Classes to add to the element. A function receives the icon name |
| `text?`        | `'name' \| 'none' \| Record<V, string> \| ((name: V) => string)` | The element's text. Defaults to `'name'`. See the table below    |

| `text` value | Element text                                                                |
| ------------ | --------------------------------------------------------------------------- |
| `'name'`     | The icon name itself (ligatures)                                            |
| `'none'`     | Nothing (sets drawn by classes)                                             |
| A map        | The character mapped to the name (code points). Nothing for an unknown name |
| A function   | Its return value                                                            |

Static properties of the component:

| Property      | Type                         | Description                                                                      |
| ------------- | ---------------------------- | -------------------------------------------------------------------------------- |
| `webFonts`    | `readonly FontIconWebFont[]` | The web fonts needed to render it. Empty when the definition has no `fontFamily` |
| `displayName` | `string`                     | `FontIcon(<fontFamily>)`, or `FontIcon` without `fontFamily`                     |

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

Creates an icon component from a map of icon names to SVG components. The name type comes from the map's keys. The component draws the matching component inside the icon box `<span>`. Props other than `value` go to the `<span>`, and `ref` points to the `<span>`. For a name that is not in the map, it draws an empty box (`SvgIconFrame`).

### `SvgIconFrame`

```ts
SvgIconFrame(props: SvgIconFrameProps): ReactElement
```

A component that draws an `<svg>` inside the icon box `<span>` and holds child elements (`<path>`, etc.). `viewBox` (`'0 0 24 24'` by default), `fill` (`'currentColor'` by default) and `children` go to the `<svg>`, and the other props go to the `<span>`. `ref` points to the `<span>`.

### `createSpriteIcon`

```ts
createSpriteIcon<V extends string>(
  definition: SpriteIconDefinition<V>,
): SpriteIconComponent<V>
```

Creates an icon component from the definition of an SVG sprite set. The component draws a `<use>` inside an `SvgIconFrame` (props other than `value` go to the icon box `<span>`). When no `<symbol>` matches the name, the box is empty.

| Definition key | Type                              | Description                                                                                                                                                                                                                                     |
| -------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `href`         | `string \| ((name: V) => string)` | The `href` of `<use>`. A string is the sprite file's URL, followed by `#` and the name (`''` refers to a `<symbol>` in the page). A function receives the icon name and returns the `href` (for example, when the `<symbol>` ids have a prefix) |

### `createPrefixedIcon`

```ts
createPrefixedIcon<S extends PrefixedIconSet>(
  icons: S,
): PrefixedIconComponent<S>
```

Creates a component that picks an icon by a `prefix:name` value from a map of prefixes to icon components. It splits `value` at the first `:` and passes the name and props to the prefix's component.

- Besides `value`, it only receives the props that can be passed to components of any kind (react-contract's `IconSlotProps`: `className`, `style`, `id`, `title`, `role`, `aria-hidden`, `aria-label`, `aria-labelledby`, `aria-describedby`). `ref` and event handlers cannot be passed.
- For a prefix that is not in the map, or a value without `:`, it draws an empty box (`<span class="frg-icon">`).
- When the prefix exists but the name is not in that set, that set's component decides what to draw.

### CSS classes

| Class          | Elements                                         | Description                                                                                                |
| -------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `frg-icon`     | Every icon                                       | A square box (see "Size, position and color" above for the size and position)                              |
| `frg-fonticon` | Icon font icons                                  | Enables ligatures and keeps letter spacing, wrapping, and so on from being inherited from the surroundings |
| `frg-svgicon`  | SVG components, `SvgIconFrame`, and sprite icons | Draws the `<svg>` inside to fill the box (colors such as `fill` are not set)                               |

The rules have zero specificity (`:where()`), so your own CSS overrides them as is.

### Types

| Type                       | Description                                                                                                                                                  |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `FontIconDefinition<V>`    | The definition for `createFontIcon` and `createFontIconProps`                                                                                                |
| `FontIconText<V>`          | The definition's `text`                                                                                                                                      |
| `FontIconProps<V>`         | Props of a component made by `createFontIcon` (`value` and `<span>` props)                                                                                   |
| `FontIconComponent<V>`     | A component made by `createFontIcon`                                                                                                                         |
| `FontIconWebFont`          | An element of `webFonts` (`family`, `weight?`, `style?`)                                                                                                     |
| `SvgIconSet<V>`            | The map of names to SVG components passed to `createSvgIcon`                                                                                                 |
| `SvgIconProps<V>`          | Props of a component made by `createSvgIcon` (`value` and `<span>` props)                                                                                    |
| `SvgIconComponent<V>`      | A component made by `createSvgIcon`                                                                                                                          |
| `SvgIconFrameProps`        | Props of `SvgIconFrame` (`<span>` props, and `viewBox`, `fill` and `children` for the `<svg>`)                                                               |
| `SpriteIconDefinition<V>`  | The definition for `createSpriteIcon`                                                                                                                        |
| `SpriteIconProps<V>`       | Props of a component made by `createSpriteIcon` (`value` and `<span>` props)                                                                                 |
| `SpriteIconComponent<V>`   | A component made by `createSpriteIcon`                                                                                                                       |
| `IconSlotProps<V>`         | Props a component built into an icon slot receives (a type from `@fringeworks/react-contract`). Components made by `createPrefixedIcon` take these props too |
| `IconComponent<V>`         | A component that can be built into an icon slot (a type from `@fringeworks/react-contract`). The type of the components in the `createPrefixedIcon` map      |
| `PrefixedIconSet`          | The map of prefixes to icon components passed to `createPrefixedIcon`                                                                                        |
| `PrefixedIconValue<S>`     | The `value` type of a component made by `createPrefixedIcon` (`prefix:name`)                                                                                 |
| `PrefixedIconProps<S>`     | Props of a component made by `createPrefixedIcon`                                                                                                            |
| `PrefixedIconComponent<S>` | A component made by `createPrefixedIcon`                                                                                                                     |

## License

MIT
