//@flow
import Syntax from "../Syntax";
import Context from "./context";
import meta from "./metadata";
import { writeFunctionPointer } from "./implicit-imports";
import type { Node } from "../flow/types";
import {
  findLocalIndex,
  findGlobalIndex,
  findFunctionIndex
} from "./introspection";

// Maybe identifier, maybe function call
const maybeIdentifier = (ctx: Context): Node => {
  const node = ctx.startNode();
  const localIndex = findLocalIndex(ctx, ctx.token);
  const globalIndex = findGlobalIndex(ctx, ctx.token);
  const functionIndex = findFunctionIndex(ctx, ctx.token);

  let Type = Syntax.Identifier;
  // Not a function call or pointer, look-up variables
  if (localIndex !== -1) {
    node.type = ctx.func.locals[localIndex].type;
    node.meta.push(meta.localIndex(localIndex));
  } else if (globalIndex !== -1) {
    node.type = ctx.globals[globalIndex].type;
    node.meta.push(meta.globalIndex(globalIndex));
  } else if (functionIndex !== -1 && ctx.stream.peek().value !== "(") {
    node.type = "i32";
    Type = Syntax.FunctionPointer;
    node.meta.push(meta.get(meta.FUNCTION_INDEX, ctx.functions[functionIndex]));
    writeFunctionPointer(ctx, functionIndex);
  } else if (functionIndex == -1) {
    throw ctx.syntaxError(`Undefined variable name ${ctx.token.value}`);
  }

  ctx.diAssoc = "left";
  return ctx.endNode(node, Type);
};

export default maybeIdentifier;
