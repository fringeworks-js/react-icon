import createIconAriaProps from './_createIconAriaProps';

describe('createIconAriaProps', () => {
  it('名前が無ければ飾りとして aria-hidden を付ける', () => {
    expect(createIconAriaProps({})).toEqual({ 'aria-hidden': true });
  });

  it('aria-label があれば role="img" を付ける', () => {
    expect(createIconAriaProps({ 'aria-label': 'ホーム' })).toEqual({
      role: 'img',
    });
  });

  it('aria-labelledby があれば role="img" を付ける', () => {
    expect(createIconAriaProps({ 'aria-labelledby': 'title' })).toEqual({
      role: 'img',
    });
  });

  it('空の aria-label は名前が無いものとして扱う', () => {
    expect(createIconAriaProps({ 'aria-label': '' })).toEqual({
      'aria-hidden': true,
    });
  });
});
