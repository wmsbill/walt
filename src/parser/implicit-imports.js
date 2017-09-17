// @flow
import Context from './context';
import { EXTERN_TABLE, EXTERN_MEMORY } from '../emitter/external_kind';
import { generateImport, generateElement } from './generator';

const memoryImport = generateImport({
  module: 'env',
  fields: [{
    id: 'memory',
    kind: EXTERN_MEMORY
  }]
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
  }
}

