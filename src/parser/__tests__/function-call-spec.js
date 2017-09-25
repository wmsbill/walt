import test from "ava";
import statement from "../statement";
import printNode from "../../utils/print-node";
import { mockContext } from "../../utils/mocks";

test("function call, no arguments", t => {
  const ctx = mockContext("test();");
  ctx.func = {
    locals: []
  };
  ctx.functions = [
    {
      id: "test",
      meta: []
    }
  ];
  const nodes = statement(ctx);
  t.snapshot(nodes);
});

test.only("function call, in a return", t => {
  const ctx = mockContext("return test();");
  ctx.func = {
    locals: []
  };
  ctx.functions = [
    {
      id: "test",
      meta: []
    }
  ];
  const nodes = statement(ctx);

  console.log(ctx.token);
  console.log(printNode(nodes));
  debugger;
  // t.snapshot(nodes);
});
