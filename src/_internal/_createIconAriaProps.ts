/**
 * アイコンの読み上げに関わる props
 */
export type IconAriaProps = {
  role?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
  'aria-label'?: string;
  'aria-labelledby'?: string;
};

/**
 * アイコンの要素に付ける、読み上げの props を作る\
 * 名前（`aria-label`・`aria-labelledby`）が無ければ飾りとして `aria-hidden` を付け、
 * あれば画像として `role="img"` を付ける。
 * 利用者が `role`・`aria-hidden` を渡した場合は、そちらを使う（戻り値の後に利用者の props を重ねる）
 * @param props 利用者が渡した props
 * @returns 要素に付ける props
 */
export default function createIconAriaProps(
  props: IconAriaProps,
): Pick<IconAriaProps, 'role' | 'aria-hidden'> {
  if (props['aria-label'] || props['aria-labelledby']) {
    return { role: 'img' };
  }
  return { 'aria-hidden': true };
}
