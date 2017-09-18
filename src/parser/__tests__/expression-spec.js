import test from 'ava';
import expression from '../expression';
import printNode from '../../utils/print-node';
import { mockContext } from '../../utils/mocks';

test('array: offset is constant', t => {
  const ctx = mockContext('b[1] + 5');
  const nodes = expression(ctx);
  t.snapshot(nodes);
});

test('array: offset is compound expression', t => {
  const ctx = mockContext('a + b[1 + 1] * 5');
  const nodes = expression(ctx);
  t.snapshot(nodes);
});


