import type { ReactElement } from 'react';
import type { FontIconProps } from '../createFontIconProps';

/**
 * フォントのアイコンを待つときの Web フォントの指定\
 * react-defer-rendering の `useDeferUntilWebFontReady` の `fonts` にそのまま渡せる
 */
export type FontIconWebFont = {
  /**
   * フォントファミリー
   */
  family: string;

  /**
   * フォントの太さ（font-weight）
   */
  weight?: number | 'normal' | 'bold';

  /**
   * フォントのスタイル（font-style）
   */
  style?: 'normal' | 'italic';
};

/**
 * `createFontIcon` で作ったアイコンの部品
 */
export type FontIconComponent<V extends string> = {
  (props: FontIconProps<V>): ReactElement;

  /**
   * このセットのアイコンを描くのに要る Web フォント。定義に `fontFamily` が無ければ空の配列
   */
  readonly webFonts: readonly FontIconWebFont[];

  displayName?: string;
};
