// @flow
import Context from './context';
import {
  EXTERN_TABLE,
  EXTERN_MEMORY,
  EXTERN_FUNCTION
} from '../emitter/external_kind';
import {
  generateType,
  generateImport,
  generateElement
} from './generator';

const memoryImport = generateImport({
  module: 'env',
  fields: [
    {
      id: 'memory',
      kind: EXTERN_MEMORY
    }
  ]
});

export const writeFunctionPointer = (
  ctx: Context,
  functionIndex: number
): void => {
  if (!ctx.Program.Element.length) {
    ctx.Program.Imports.push.apply(
      ctx.Program.Imports,
      generateImport({
        module: 'env',
        fields: [{
          id: 'table',
          kind: EXTERN_TABLE
        }]
      }));
  }

  const exists = ctx.Program.Element.find(
    n => n.functionIndex === functionIndex
  );
  if (exists == null) {
    ctx.Program.Element.push(generateElement(functionIndex));
  }
}

export const importMemory = (ctx: Context): void => {
  if (!ctx.Program.Imports.find(({ kind }) => kind === EXTERN_MEMORY)) {
    ctx.Program.Imports.push.apply(
      ctx.Program.Imports,
      memoryImport
    );

    const newNode = {
      id: 'new',
      params: [{ type: 'i32', isParam: true }],
      result: 'i32',
      typeIndex: 1 // ctx.Program.Types.length
    };

    ctx.Program.Types.push(generateType(newNode));
    ctx.Program.Imports.push.apply(
      ctx.Program.Imports,
      generateImport({
        module: 'env',
        fields: [{
          id: 'new',
          kind: EXTERN_FUNCTION,
          typeIndex: newNode.typeIndex
        }]
      })
    );
    ctx.Program.Functions.push(null);
  }
}

