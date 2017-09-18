// @flow
import Syntax from '../Syntax';
import { generateInit } from './generator';
import expression from './expression';
import Context from './context';
import type { Node } from '../flow/types';
import { importMemory } from './implicit-imports';

const generate = (ctx, node) => {
  if (!ctx.func) {
    node.globalIndex = ctx.Program.Globals.length;
    ctx.Program.Globals.push(generateInit(node));
    ctx.globals.push(node);
  } else {
    node.localIndex = ctx.func.locals.length;
    ctx.func.locals.push(node);
  }
}

const arrayDeclaration = (node: Node, ctx: Context): Node => {
  ctx.expect([']']);
  ctx.expect(['=']);

  importMemory(ctx);

  if (ctx.eat(['new'], Syntax.Keyword)) {
    const init = ctx.startNode();
    ctx.expect(['Array']);
    ctx.expect(['(']);
    node.size = parseInt(ctx.expect(null, Syntax.Constant).value);
    ctx.expect([')']);

    init.id = 'new';
    init.arguments = [{
      value: 14,
      Type: Syntax.Constant,
      type: 'i32'
    }];
    init.functionIndex = 0;

    node.init = ctx.endNode(init, Syntax.FunctionCall);
  }

  generate(ctx, node);

  return ctx.endNode(node, Syntax.ArrayDeclaration);
}

const declaration = (ctx: Context): Node => {
  const node = ctx.startNode();
  node.const = ctx.token.value === 'const';
  if (!ctx.eat(['const', 'let', 'function']))
    throw ctx.unexpectedValue(['const', 'let', 'function']);

  node.id = ctx.expect(null, Syntax.Identifier).value;
  ctx.expect([':']);

  node.type = ctx.expect(null, Syntax.Type).value;
  if (ctx.eat(['['])) {
    return arrayDeclaration(node, ctx);
  }

  if (ctx.eat(['=']))
    node.init = expression(ctx, node.type);

  if (node.const && !node.init)
    throw ctx.syntaxError('Constant value must be initialized');

  generate(ctx, node);

  return ctx.endNode(node, Syntax.Declaration);
}

export default declaration;


