import test from 'ava';
import compile from '..';

const compileAndRun = (src, imports) => WebAssembly.instantiate(compile(src), imports);
const outputIs = (t, value) => result => t.is(result.instance.exports.test(), value);

test.skip('basic array, no new', t => {
  return compileAndRun(`
  export function test(): i32 {
    let x: i32[] = new Array(5);
    x[4] = 42;
    return x[4];
  }`).then(outputIs(t, 42));
});
