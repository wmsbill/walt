//@flow
import Syntax from '../Syntax'
import functionCall from './function-call';
import Context from './context';
import type { Node } from '../flow/types';
import { writeFunctionPointer } from './implicit-imports';
import {
  findLocalIndex,
  findGlobalIndex,
  findFunctionIndex
} from './introspection';

// Maybe identifier, maybe function call
const maybeIdentifier = (ctx: Context): Node => {
  const node = ctx.startNode();
  const localIndex = findLocalIndex(ctx, ctx.token);
  const globalIndex = findGlobalIndex(ctx, ctx.token);
  const functionIndex = findFunctionIndex(ctx, ctx.token);
  const nextToken = ctx.stream.peek();
  const isFuncitonCall = nextToken.value === '(';
  const isArraySubscript = nextToken.value === '[';

  // Function pointer
  if (!isFuncitonCall && localIndex < 0 && globalIndex < 0 && functionIndex > -1) {
    // Save the element
    writeFunctionPointer(ctx, functionIndex);
    // Encode a function pointer as a i32.const representing the function index
    const tableIndex = ctx.Program.Element.findIndex(e => e.functionIndex === functionIndex);
    node.value = tableIndex;
    return ctx.endNode(node, Syntax.Constant);
  } else if (isFuncitonCall) {
    // if function call then encode it as such
    return functionCall(ctx);
  }

  // Not a function call or pointer, look-up variables
  if (localIndex !== -1) {
    node.localIndex = localIndex;
    node.target = ctx.func.locals[localIndex];
    node.type = node.target.type;
  } else if (globalIndex !== -1) {
    node.globalIndex = globalIndex;
    node.target = ctx.globals[node.globalIndex];
    node.type = node.target.type;
  } else {
    throw ctx.syntaxError(`Undefined variable name ${ctx.token.value}`);
  }

  ctx.diAssoc = 'left';
  return ctx.endNode(node, Syntax.Identifier);
}

export default maybeIdentifier;
