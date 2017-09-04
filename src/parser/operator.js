// @flow
import Syntax from '../Syntax';
import binaryOrUnary from './binary-or-unary';
import Context from './context';

const ternary = (ctx) => {
};

/**
 * @param {Context} ctx
 * @param {Object}  options
 *
 * optons = {
 *   type,     // string
 *   operator, // token
 *   operands
 * }
 **/
const operator = (ctx: Context, options) => {
  if (operator.value === '?')
    return ternary(ctx, options);

  return binaryOrUnary(ctx, options);
};

export default operator;
