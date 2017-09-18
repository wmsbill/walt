// @flow
import Syntax from '../Syntax';
import Context from './context';
import expression, { predicate } from './expression';
import maybeIdentifier from './maybe-identifier';
import type { Node } from '../flow/types';

// Maybe this should be a modified ArraySubscript?
const memoryStore = (ctx: Context): Node => {
  const node = expression(
    ctx,
    'i32',
    // quit at '='
    token => predicate(token) && token.value !== '='
  );

  ctx.expect(['=']);

  const rhs = expression(ctx);

  // NOTE:
  // Left hand side is an expression resolving to a memory address and must
  // be pused to the stack last for correct IR to be generated
  node.params.push(rhs);

  node.meta = ['Store'];

  return ctx.endNode(node, Syntax.ArraySubscript);
}

export default memoryStore;

