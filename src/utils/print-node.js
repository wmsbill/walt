// @flow
import type { Node } from '../flow/types';

const printNode = (node: Node, level: number = 0): string => {
  let out = `${node.Type}${node.type ? '<' + node.type + '>' : ''} ${node.value}\n`;
  out = out.padStart(out.length + level);
  node.params.forEach(p => out += printNode(p, level + 1));
  return out;
}

export default printNode;

