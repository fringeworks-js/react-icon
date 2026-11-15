import type { ValueProps } from '@fringeworks/react-contract';
import type { ComponentPropsWithRef, ReactElement } from 'react';

/**
 * スプライトのアイコンのセットの定義
 */
export type SpriteIconDefinition<V extends string> = {
  /**
   * `<use>` の `href`
   *
   * - 文字列: スプライトの SVG のファイルの URL。`#` と名前を続けて `<symbol>` を参照する（`'/icons.svg'` → `'/icons.svg#home'`）。
   *   `''` はページの中の `<symbol>` を参照する（`'#home'`）
   * - 関数: アイコンの名前を受け取って `href` を返す（`<symbol>` の id に接頭辞がある場合など）
   */
  href: string | ((name: V) => string);
};

/**
 * `createSpriteIcon` で作ったアイコンの部品のプロパティ\n * `value` 以外は、アイコンの箱の `<span>` に渡す
 */
export type SpriteIconProps<V extends string> = ValueProps<V> &
  Omit<ComponentPropsWithRef<'span'>, 'children'>;

/**
 * `createSpriteIcon` で作ったアイコンの部品
 */
export type SpriteIconComponent<V extends string> = {
  (props: SpriteIconProps<V>): ReactElement;

  displayName?: string;
};
