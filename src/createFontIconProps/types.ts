import type { ValueProps } from '@fringeworks/react-contract';
import type { ComponentPropsWithRef } from 'react';

/**
 * フォントのアイコンの要素の文字
 *
 * - `'name'`: アイコンの名前をそのまま入れる（合字。Material Symbols など）
 * - `'none'`: 何も入れない（クラスで描くもの。Font Awesome など）
 * - 対応表: 名前に対応する文字を入れる（コードポイント。独自のフォントなど）。対応表に無い名前は何も入れない
 * - 関数: 戻り値を入れる
 */
export type FontIconText<V extends string> =
  'name' | 'none' | Readonly<Record<V, string>> | ((name: V) => string);

/**
 * フォントのアイコンのセットの定義
 */
export type FontIconDefinition<V extends string> = {
  /**
   * 要素の `font-family`。`webFonts` もここから作る
   */
  fontFamily?: string;

  /**
   * 要素の `font-weight`。`webFonts` にも入れる
   */
  fontWeight?: number | 'normal' | 'bold';

  /**
   * 要素の `font-style`。`webFonts` にも入れる
   */
  fontStyle?: 'normal' | 'italic';

  /**
   * 要素に足すクラス。関数はアイコンの名前を受け取ってクラスを返す
   */
  className?: string | ((name: V) => string);

  /**
   * 要素の文字
   * @default 'name'
   */
  text?: FontIconText<V>;
};

/**
 * フォントのアイコンの要素が受け取る props（`<span>` の props と、アイコンの名前の `value`）
 */
export type FontIconProps<V extends string> = ValueProps<V> &
  Omit<ComponentPropsWithRef<'span'>, 'children'>;
