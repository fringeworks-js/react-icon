import type { ValueProps } from '@fringeworks/react-contract';
import type { ReactElement } from 'react';
import type { SvgIconSlotProps } from '../createSvgIcon';

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
 * `createSpriteIcon` で作ったアイコンの部品のプロパティ
 */
export type SpriteIconProps<V extends string> = ValueProps<V> &
  SvgIconSlotProps;

/**
 * `createSpriteIcon` で作ったアイコンの部品
 */
export type SpriteIconComponent<V extends string> = {
  (props: SpriteIconProps<V>): ReactElement;

  displayName?: string;
};
