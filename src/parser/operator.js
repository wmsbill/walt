// @flow
import Syntax from '../Syntax';
import Context from './context';
import type { OperatorToken, Node } from '../flow/types';

function binary(ctx: Context, operator: OperatorToken, params: Node[]) {
  const node = ctx.startNode(params[0]);
  node.value = operator.value;
  node.params = params;
  node.type = operator.type;
  node.isPostfix = operator.isPostfix;

  ctx.diAssoc = 'left';
  let Type = Syntax.BinaryExpression;
  if (node.value === '=') {
    Type = Syntax.Assignment;
    ctx.diAssoc = 'right';
  } else if (node.value === '[') {
    Type = Syntax.ArraySubscript;
  }

  return ctx.endNode(node, Type);
}

function unary(ctx: Context, operator: OperatorToken, params: Node[]) {
  // Since WebAssembly has no 'native' support for incr/decr _opcode_ it's much simpler to
  // convert this unary to a binary expression by throwing in an extra operand of 1
  if (operator.value === '--' || operator.value === '++') {
    // set isPostfix to help the IR generator
    // TODO: abstract this to the generator?
    const newParams = [...params];
    const newOperator = {...operator};
    newOperator.value = operator.value[0];
    newOperator.isPostfix = operator.assoc === 'left';
    newParams.push({ Type: Syntax.Constant, value: '1' });
    return binary(ctx, newOperator, newParams);
  }
  const node = ctx.startNode(params[0]);
  node.params = params;
  node.value = operator.value;

  return ctx.endNode(node, Syntax.UnaryExpression);
}

const ternary = (ctx: Context, operator: OperatorToken, params: Node[]) => {
  const node = ctx.startNode(params[0]);
  node.params = params;
  node.value = operator.value;
  node.type = operator.type;

  return ctx.endNode(node, Syntax.TernaryExpression);
};

// Abstraction for handling operations
const operator = (ctx: Context, operator: OperatorToken, operands: Node[]) => {
  switch(operator.value) {
    case '++':
    case '--':
      return unary(ctx, operator, operands.splice(-1));
    case '?':
      return ternary(ctx, operator, operands.splice(-3));
    default:
      return binary(ctx, operator, operands.splice(-2));
  }
};

export default operator;

