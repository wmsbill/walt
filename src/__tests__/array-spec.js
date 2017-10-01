import test from "ava";
import compile from "..";

const compileAndRun = (src, imports) =>
  WebAssembly.instantiate(compile(src), imports);
const outputIs = (t, value) => result =>
  t.is(result.instance.exports.test(33), value);

test.skip("basic array", t => {
  const memory = new WebAssembly.Memory({ initial: 1 });
  return compileAndRun(
    `
  export function test(): i32 {
    let x: i32[] = new Array(1);
    x[0] = 21;
    x[1] = 2;
    return x[0] * x[1];
  }`,
    {
      env: {
        memory,
        new: size => {
          return 0;
        }
      }
    }
  ).then(outputIs(t, 42));
});
