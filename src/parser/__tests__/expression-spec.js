import test from 'ava';
import expression from '../expression';
import printNode from '../../utils/print-node';
import { mockContext } from '../../utils/mocks';

test('array expressions', t => {
  const ctx = mockContext('a + b[1 + 1] * 5');
  debugger;
  const nodes = expression(ctx);
  console.log(printNode(nodes));
});

