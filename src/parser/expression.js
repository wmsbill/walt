// @flow
import Syntax from '../Syntax';
import Context from './context';
import operator from './operator';
import constant from './constant';
import precedence from './precedence';
import maybeIdentifier from './maybe-identifier';
import type { Node, Token, OperatorToken } from '../flow/types';

export type Predicate = (Token) => boolean;
export type OperatorCheck = (OperatorToken) => boolean;

const last = list => list[list.length - 1];

const assoc = op => {
  switch(op) {
    case '+':
    case '-':
    case '/':
    case '*':
    case ':':
      return 'left';
    case '=':
    case '--':
    case '++':
    case '?':
      return 'right';
    default:
      return 'left';
  }
};

const valueIs = (v: string) => (o: OperatorToken): boolean => o.value === v;

const isLBracket = valueIs('(');
const isRBracket = valueIs(')');
const isRSqrBracket = valueIs(']');
const isLSqrBracket = valueIs('[');
const isTStart = valueIs('?');
const isTEnd = valueIs(':');
const hasLBracket = ops => ops.find(isLBracket);

export const predicate = (token: Token): boolean =>
  token.value !== ';' && token.value !== ',';

// Shunting yard
const expression = (
  ctx: Context,
  type: string = 'i32',
  check: Predicate = predicate
) => {
  const operators: Token[] = [];
  const operands: Node[] = [];

  const consume = () =>
    operands.push(operator(ctx, operators.pop(), operands));

  const eatUntil = (condition) => {
    let prev = last(operators);
    while(prev && !condition(prev)) {
      consume();
      prev = last(operators);
    }
  };

  while(ctx.token && check(ctx.token)) {
    if (ctx.token.type === Syntax.Constant)
      operands.push(constant(ctx));
    else if (ctx.token.type === Syntax.Identifier)
      operands.push(maybeIdentifier(ctx));
    else if (ctx.token.type === Syntax.Punctuator) {
      const op: OperatorToken = {
        ...ctx.token,
        precedence: precedence[ctx.token.value],
        assoc: 'left',
        type
      };

      // Increment, decrement are a bit annoying...
      // we don't know if it's left associative or right without a lot of gymnastics
      if (ctx.token.value === '--' || ctx.token.value === '++') {
        // As we create different nodes the diAssoc is changed
        op.assoc = ctx.diAssoc;
      } else {
        // vanilla binary operator
        op.assoc = assoc(op.value);
      }

      if (isLBracket(op) || isLSqrBracket(op)) {
        operators.push(op);
      } else if (isTEnd(op)) {
        eatUntil(isTStart);
      } else if (isRBracket(op)) {
        // If we are not in a group already find the last LBracket,
        // consume everything until that point
        eatUntil(isLBracket);

        // Pop left bracket
        operators.pop();
      } else if (isRSqrBracket(op)) {
        eatUntil(isLSqrBracket);
        // instead of popping the square bracket (like the parens) we consume it
        // and create a array-subscript operation
        consume();
      } else {
        while(last(operators)
          && last(operators).precedence >= op.precedence
          && last(operators).assoc === 'left'
        ) consume();

        operators.push(op);
      }
    }

    ctx.next();
  };


  while(operators.length)
    consume();

  // Should be a node
  return operands.pop();
}

export default expression;

