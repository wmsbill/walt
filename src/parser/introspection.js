// @flow
import Context from './context';
import type { Token } from '../flow/types';

const findFieldIndex = (fields: string[]) => (
  ctx: Context,
  token: Token
) => {
  let field: any = fields.reduce(
    (memo, f) => {
      if (memo)
        return (memo: Object)[f];
      return memo;
    }, ctx);

  if (field) {
    return field.findIndex(node => node.id === token.value);
  }

  return -1;
};

export const findLocalIndex = findFieldIndex(['func', 'locals']);
export const findGlobalIndex = findFieldIndex(['globals']);
export const findFunctionIndex = findFieldIndex(['functions']);

