# @fringeworks/react-icon

`@fringeworks/react-icon` は、手元のアイコンフォントや SVG を、型付きで差し替えられる React の部品として使うための、誰かにとっては便利なライブラリです。

**[English README is available here](./README.md)**

アイコンそのものは含みません。アイコンフォント（Material Symbols・Font Awesome など）・SVG の部品・SVG のスプライトを、変換せずにそのまま使い、どれも `<Icon value="home" />` の同じ形で描けるようにする基盤です。特定のアイコンのセットに合わせた部品は、アダプター（`@fringeworks/react-icon-material-symbols` など）で提供します。

## インストール

```bash
npm install @fringeworks/react-icon
```

React 18 と 19 に対応しています。

アイコンの箱の CSS を、アプリで1回読み込みます。

```ts
import '@fringeworks/react-icon/styles.css';
```

## 使い方

アイコンのセットごとに、定義から部品を1回作り、使う場所では `value` でアイコンの名前を渡します。名前の型はセットから決まるので、書き間違いは型エラーになります。

### アイコンフォント

```tsx
import { createFontIcon } from '@fringeworks/react-icon';

// 合字（Material Symbols など）: 名前をそのまま文字として入れる
const Symbol = createFontIcon<'home' | 'search'>({
  fontFamily: 'Material Symbols Outlined',
});

// クラス（Font Awesome など）: 名前からクラスを作り、文字は入れない
const FaIcon = createFontIcon<'house' | 'user'>({
  className: (name) => `fa-solid fa-${name}`,
  text: 'none',
});

// コードポイント（独自のフォントなど）: 名前に対応する文字を入れる
const MyIcon = createFontIcon({
  fontFamily: 'MyIcons',
  text: { home: '\ue900', search: '\ue901' },
});

<Symbol value="home" />;
<FaIcon value="user" />;
<MyIcon value="search" />;
```

フォントの CSS（`@font-face`）は、それぞれのセットの配り方に従って読み込みます。

### SVG の部品

lucide-react・heroicons の部品や、自分で書いた SVG の部品を、名前との対応表から使います。

```tsx
import { createSvgIcon } from '@fringeworks/react-icon';
import { House, Search } from 'lucide-react';

const Icon = createSvgIcon({ home: House, search: Search });

<Icon value="home" />; // value の型は 'home' | 'search'
```

組み込む部品は、受け取った props（`className`・`style`・`aria-*`・`ref` など）を `<svg>` に渡すものにします。部品の `fill`・`stroke` などの属性は、部品のものをそのまま使います（線で描くアイコンの `fill="none"` も保たれます）。

SVG を手で書くときは、`SvgIconFrame` を入れ物に使えます。

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

### SVG のスプライト

`<symbol>` をまとめた SVG を、`<use>` で描きます。名前の型は型引数で渡します。

```tsx
import { createSpriteIcon } from '@fringeworks/react-icon';

const BrandIcon = createSpriteIcon<'logo' | 'cart'>({ href: '/icons.svg' });

<BrandIcon value="cart" />; // <use href="/icons.svg#cart" />
```

別のファイルのスプライトは、ページと同じオリジンに置きます（ブラウザーは、別のオリジンのファイルを `<use>` で描きません）。

### 設定の文字列から選ぶ

`接頭辞:名前` の値で、種類の違うセットを混ぜて選べます。設定（JSON など）にアイコンを書くときに使います。

```tsx
import { createPrefixedIcon } from '@fringeworks/react-icon';

const AnyIcon = createPrefixedIcon({ ms: Symbol, brand: BrandIcon });

<AnyIcon value="ms:home" />; // value の型は 'ms:home' | 'ms:search' | 'brand:logo' | 'brand:cart'
```

### 大きさと色

どのアイコンも、`1em` の正方形の箱に描きます。大きさは `font-size`、色は `color` で変えます（文やボタンの中では、周りの文字と同じ大きさ・色になります）。

```tsx
<Icon value="home" style={{ fontSize: 24, color: 'tomato' }} />
```

### 読み上げ

`aria-label`・`aria-labelledby` を渡すと、画像（`role="img"`）として読み上げられます。渡さなければ、飾りとして `aria-hidden` が付きます。

```tsx
<button type="button">
  <Icon value="search" /> 検索 {/* 飾り */}
</button>
<button type="button">
  <Icon value="search" aria-label="検索" /> {/* アイコンだけのボタン */}
</button>
```

### フォントの読み込み中にスケルトンを出す

`createFontIcon` で作った部品は、描くのに要る Web フォントを `webFonts` に持っています。[`@fringeworks/react-defer-rendering`](https://www.npmjs.com/package/@fringeworks/react-defer-rendering) の `useDeferUntilWebFontReady` にそのまま渡せます。

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

### 名前が無いとき

`createSvgIcon`・`createPrefixedIcon` の部品は、対応表に無い名前を受け取ると、例外にせず空の箱を描きます。設定から実行時に値が来るときも、並びが崩れません。

## API

| 名前                                     | 説明                                                         |
| ---------------------------------------- | ------------------------------------------------------------ |
| `createFontIcon(definition)`             | アイコンフォントのセットの定義から、アイコンの部品を作る     |
| `createFontIconProps(definition, props)` | アイコンフォントの要素に渡す props を作る                    |
| `createSvgIcon(icons)`                   | 名前と SVG の部品の対応表から、アイコンの部品を作る          |
| `SvgIconFrame`                           | 子要素（`<path>` など）を入れる `<svg>` の枠の部品           |
| `createSpriteIcon(definition)`           | SVG のスプライトのセットの定義から、アイコンの部品を作る     |
| `createPrefixedIcon(icons)`              | `接頭辞:名前` の値で、複数のセットから選ぶアイコンの部品を作る |

どの部品も、受け取った props を要素（`<span>` か `<svg>`）に渡します。`className`・`style` は合成し、同じプロパティは受け取った値を優先します。

### `createFontIcon`

```ts
createFontIcon<V extends string>(
  definition: FontIconDefinition<V>,
): FontIconComponent<V>
```

アイコンフォントのセットの定義から、アイコンの部品を作ります。作った部品は `value` でアイコンの名前を受け取り、`<span>` に描きます。

| 定義のキー    | 型                                                              | 説明                                                                   |
| ------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `fontFamily?` | `string`                                                        | 要素の `font-family`。`webFonts` もここから作る                        |
| `fontWeight?` | `number \| 'normal' \| 'bold'`                                  | 要素の `font-weight`。`webFonts` にも入れる                            |
| `fontStyle?`  | `'normal' \| 'italic'`                                          | 要素の `font-style`。`webFonts` にも入れる                             |
| `className?`  | `string \| ((name: V) => string)`                               | 要素に足すクラス。関数はアイコンの名前を受け取ってクラスを返す         |
| `text?`       | `'name' \| 'none' \| Record<V, string> \| ((name: V) => string)` | 要素の文字。既定は `'name'`。下の表                                    |

| `text` の値 | 要素の文字                                                         |
| ----------- | ------------------------------------------------------------------ |
| `'name'`    | アイコンの名前をそのまま入れる（合字）                             |
| `'none'`    | 何も入れない（クラスで描くもの）                                   |
| 対応表      | 名前に対応する文字を入れる（コードポイント）。無い名前は何も入れない |
| 関数        | 戻り値を入れる                                                     |

作った部品の静的なプロパティ:

| プロパティ    | 型                           | 説明                                                                     |
| ------------- | ---------------------------- | ------------------------------------------------------------------------ |
| `webFonts`    | `readonly FontIconWebFont[]` | 描くのに要る Web フォント。定義に `fontFamily` が無ければ空の配列        |
| `displayName` | `string`                     | `FontIcon(<fontFamily>)`。`fontFamily` が無ければ `FontIcon`             |

### `createFontIconProps`

```ts
createFontIconProps<V extends string>(
  definition: FontIconDefinition<V>,
  props: FontIconProps<V>,
): ComponentPropsWithRef<'span'>
```

アイコンフォントの要素に渡す props（クラス・style・文字・読み上げの props）を作ります。`createFontIcon` の中で使っているもので、`<span>` 以外の要素や、ほかのライブラリの部品にアイコンを描くときに使います。

```tsx
<i {...createFontIconProps({ fontFamily: 'MyIcons' }, { value: 'home' })} />
```

### `createSvgIcon`

```ts
createSvgIcon<V extends string>(icons: SvgIconSet<V>): SvgIconComponent<V>
```

アイコンの名前と SVG の部品の対応表から、アイコンの部品を作ります。名前の型は対応表のキーから決まります。対応表に無い名前を受け取ったときは、空の箱（`SvgIconFrame`）を描きます。

### `SvgIconFrame`

```ts
SvgIconFrame(props: SvgIconFrameProps): ReactElement
```

子要素（`<path>` など）を入れる `<svg>` の枠の部品です。`viewBox` の既定は `'0 0 24 24'`、`fill` の既定は `'currentColor'` で、どちらも props で変えられます。`ref` は `<svg>` を指します。

### `createSpriteIcon`

```ts
createSpriteIcon<V extends string>(
  definition: SpriteIconDefinition<V>,
): SpriteIconComponent<V>
```

SVG のスプライトのセットの定義から、アイコンの部品を作ります。作った部品は、`SvgIconFrame` の中に `<use>` を描きます。名前に合う `<symbol>` が無ければ、空の箱になります。

| 定義のキー | 型                                | 説明                                                                                                                                                                 |
| ---------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `href`     | `string \| ((name: V) => string)` | `<use>` の `href`。文字列はスプライトのファイルの URL で、`#` と名前を続ける（`''` はページの中の `<symbol>`）。関数はアイコンの名前を受け取って `href` を返す（`<symbol>` の id に接頭辞がある場合など） |

### `createPrefixedIcon`

```ts
createPrefixedIcon<S extends PrefixedIconSet>(
  icons: S,
): PrefixedIconComponent<S>
```

接頭辞とアイコンの部品の対応表から、`接頭辞:名前` の値でアイコンを選ぶ部品を作ります。`value` を最初の `:` で分け、接頭辞の部品に名前と props を渡します。

- `value` 以外に受け取る props は、どの種類の部品にも渡せる `PrefixedIconSlotProps`（`className`・`style`・`id`・`title`・`role`・`aria-hidden`・`aria-label`・`aria-labelledby`・`aria-describedby`）だけです。`ref` やイベントのハンドラーは渡せません。
- 対応表に無い接頭辞や、`:` の無い値を受け取ったときは、空の箱（`<span class="frg-icon">`）を描きます。
- 接頭辞はあるが名前がそのセットに無いときの扱いは、そのセットの部品に任せます。

### CSS のクラス

| クラス         | 付く要素                                     | 説明                                                                             |
| -------------- | -------------------------------------------- | -------------------------------------------------------------------------------- |
| `frg-icon`     | すべてのアイコン                             | `1em` の正方形の箱                                                               |
| `frg-fonticon` | アイコンフォントのアイコン                   | 合字を有効にし、文字の間隔や折り返しなどを周りから受け継がないようにする         |
| `frg-svgicon`  | SVG の部品・`SvgIconFrame`・スプライトのアイコン | CSS の規則は持たない。SVG のアイコンをまとめて選ぶためのクラス                  |

クラスの規則は詳細度が 0（`:where()`）なので、利用者の CSS でそのまま上書きできます。

### 型

| 型                        | 説明                                                                                      |
| ------------------------- | ----------------------------------------------------------------------------------------- |
| `FontIconDefinition<V>`   | `createFontIcon`・`createFontIconProps` の定義                                            |
| `FontIconText<V>`         | 定義の `text`                                                                             |
| `FontIconProps<V>`        | `createFontIcon` で作った部品のプロパティ（`value` と `<span>` の props）                 |
| `FontIconComponent<V>`    | `createFontIcon` で作った部品                                                             |
| `FontIconWebFont`         | `webFonts` の要素（`family`・`weight?`・`style?`）                                        |
| `SvgIconSlotProps`        | `createSvgIcon` が組み込んだ部品に渡す props（`<svg>` の props）                          |
| `SvgIconSet<V>`           | `createSvgIcon` に渡す、名前と SVG の部品の対応表                                         |
| `SvgIconProps<V>`         | `createSvgIcon` で作った部品のプロパティ                                                  |
| `SvgIconComponent<V>`     | `createSvgIcon` で作った部品                                                              |
| `SvgIconFrameProps`       | `SvgIconFrame` のプロパティ（`<svg>` の props）                                           |
| `SpriteIconDefinition<V>` | `createSpriteIcon` の定義                                                                 |
| `SpriteIconProps<V>`      | `createSpriteIcon` で作った部品のプロパティ                                               |
| `SpriteIconComponent<V>`  | `createSpriteIcon` で作った部品                                                           |
| `PrefixedIconSlotProps`   | `createPrefixedIcon` で作った部品が受け取り、対応表の部品に渡す props（`value` を除く）   |
| `PrefixedIconSet`         | `createPrefixedIcon` に渡す、接頭辞とアイコンの部品の対応表                               |
| `PrefixedIconValue<S>`    | `createPrefixedIcon` で作った部品の `value` の型（`接頭辞:名前`）                         |
| `PrefixedIconProps<S>`    | `createPrefixedIcon` で作った部品のプロパティ                                             |
| `PrefixedIconComponent<S>` | `createPrefixedIcon` で作った部品                                                        |

## ライセンス

MIT
