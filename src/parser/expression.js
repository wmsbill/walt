// @flow
import Syntax from "../Syntax";
import Context from "./context";
import operator from "./operator";
import constant from "./constant";
import { getAssociativty, getPrecedence } from "./introspection";
import maybeIdentifier from "./maybe-identifier";
import type { Node, Token } from "../flow/types";

export type Predicate = (Token, number) => boolean;
export type OperatorCheck = Token => boolean;

const last = (list: any[]): any => list[list.length - 1];

const valueIs = (v: string) => (o: Token): boolean => o.value === v;

const isLBracket = valueIs("(");
const isRBracket = valueIs(")");
const isRSqrBracket = valueIs("]");
const isLSqrBracket = valueIs("[");
const isTStart = valueIs("?");
const isTEnd = valueIs(":");

export const predicate = (token: Token, depth: number): boolean =>
  token.value !== ";" && depth > 0;

// Shunting yard
const expression = (
  ctx: Context,
  type: string = "i32",
  check: Predicate = predicate
) => {
  const operators: Token[] = [];
  const operands: Node[] = [];
  // Depth is the nesting level of brackets in this expression. If we find a
  // closing bracket which causes our depth to fall below 1, then we know we
  // should exit the expression.
  let depth: number = 1;
  let eatFunctionCall = false;

  const consume = () => operands.push(operator(ctx, operators.pop(), operands));

  const eatUntil = condition => {
    let prev = last(operators);
    while (prev && !condition(prev)) {
      consume();
      prev = last(operators);
    }
  };

  debugger;
  while (ctx.token && check(ctx.token, depth)) {
    if (ctx.token.type === Syntax.Constant) {
      eatFunctionCall = false;
      operands.push(constant(ctx));
    } else if (ctx.token.type === Syntax.Identifier) {
      eatFunctionCall = true;
      operands.push(maybeIdentifier(ctx));
    } else if (ctx.token.type === Syntax.Punctuator) {
      switch (ctx.token.value) {
        case "(":
          // Function call.
          if (eatFunctionCall) {
            // Tokenizer does not generate function call tokens it is our job here
            // to generate a function call on the fly
            operators.push({
              ...ctx.token,
              type: Syntax.FunctionCall
            });
            operands.push(expression(ctx));
          } else {
            operators.push(ctx.token);
          }
          depth++;
          break;
        case "[":
          operators.push(ctx.token);
          break;
        case "]":
          eatUntil(isLSqrBracket);
          consume();
          break;
        case ":":
          eatUntil(isTStart);
          break;
        case ")": {
          // If we are not in a group already find the last LBracket,
          // consume everything until that point
          eatUntil(isLBracket);
          const previous = last(operators);
          if (previous && previous.type === Syntax.FunctionCall) consume();
          else
            // Pop left bracket
            operators.pop();

          depth--;
          break;
        }
        default: {
          let previous;
          while (
            (previous = last(operators)) &&
            previous.Type !== Syntax.Sequence &&
            getPrecedence(previous) >= getPrecedence(ctx.token) &&
            getAssociativty(previous) === "left"
          ) {
            if (
              ctx.token.value === "," &&
              previous.type === Syntax.FunctionCall
            )
              break;
            consume();
          }
          operators.push(ctx.token);
        }
      }
      eatFunctionCall = false;
    }

    ctx.next();
  }

  while (operators.length) consume();

  // Should be a node
  return operands.pop();
};

export default expression;
