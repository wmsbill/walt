//@flow
import Syntax from '../Syntax';
import Context from './context';
import type { Node } from '../flow/types';

const forLoop = (ctx: Context): Node => {
  ctx.eat(['for']);


}

export default forLoop;

