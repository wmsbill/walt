import test from 'ava';
import compile from '..';

const compileAndRun = (src, imports) => WebAssembly.instantiate(compile(src), imports);
const outputIs = (t, value) => result => t.is(result.instance.exports.test(33), value);

test('basic array', t => {
  const memory = new WebAssembly.Memory({ initial: 1 });
  return compileAndRun(`
  export function test(): i32 {
    let x: i32[] = new Array(5);
    x[0] = 42;
    return x[0];
  }`, {
    env: {
      memory,
      new: () => 11
    }
  }).then(outputIs(t, 42));
});
