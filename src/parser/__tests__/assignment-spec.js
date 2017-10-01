import test from "ava";
import assignment from "../maybe-assignment";
import printNode from "../../utils/print-node";
import { mockContext } from "../../utils/mocks";

test.skip("array assignment", t => {
  const ctx = mockContext("x[0] = 2;");
  const nodes = assignment(ctx);
  t.snapshot(nodes);
});
