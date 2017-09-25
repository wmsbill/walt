import Syntax from "../Syntax";

const constant = ctx => {
  const node = ctx.startNode();
  node.value = ctx.token.value;
  if (node.value.toString().indexOf(".") !== -1) node.type = "f32";
  else node.type = "i32";
  return ctx.endNode(node, Syntax.Constant);
};

export default constant;
