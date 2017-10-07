(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Walt = global.Walt || {})));
}(this, (function (exports) { 'use strict';

//      

// Base Character stream class
class Stream {

  constructor(input = "") {
    this.pos = this.line = this.col = 0;
    this.input = input;
    this.lines = input.split("\n");
    this.newLine();
  }

  // Stop parsing and throw a fatal error
  die(reason) {
    throw new Error(reason);
  }

  // Peek at a character at current position
  peek() {
    return this.input.charAt(this.pos);
  }

  // Advance to next character in stream
  next() {
    const char = this.input.charAt(this.pos++);

    if (Stream.eol(char)) this.newLine();else this.col++;

    return char;
  }

  // Begin a new line
  newLine() {
    this.line++;
    this.col = 0;
  }

  // Is the character an end of line
  static eol(char) {
    return char === "\n";
  }

  // Is the character an end of file
  static eof(char) {
    return char === "";
  }

  // Is the charater a whitespace
  static whitespace(char) {
    return char === "\n" || char === " " || char === "\t" || char === "\v" || char === "\r" || char === "\f";
  }
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var trie$1 = createCommonjsModule(function (module) {
/**
 * A very basic trie with functional,recursive search
 */
const fsearch = node => {
  const next = char => {
    if (node && node.children[char]) {
      return fsearch(node.children[char]);
    }

    return null;
  };

  next.leaf = node.leaf;

  return next;
};

class Trie {
  constructor(words) {
    this.root = {
      char: '',
      children: {},
      leaf: false
    };

    words.map(word => this.add(word));
    this.fsearch = fsearch(this.root);
  }

  add(word) {
    let current = this.root;
    let char = word.slice(0, 1);

    word = word.slice(1);

    while (typeof current.children[char] !== 'undefined' && char.length > 0) {
      current = current.children[char];
      char = word.slice(0, 1);
      word = word.slice(1);
    }

    while (char.length > 0) {
      const node = {
        char,
        children: {},
        leaf: false
      };

      current.children[char] = node;
      current = node;
      char = word.slice(0, 1);
      word = word.slice(1);
    }

    current.leaf = true;
  }
}

module.exports = Trie;
});

var token = createCommonjsModule(function (module) {
const wrap = (predicate, type, supported) => {
  const wrapper = value => {
    const result = predicate(value);
    return typeof result === 'function' ? wrap(result, type, supported) : result;
  };
  wrapper.type = type;
  wrapper.supported = supported;
  wrapper.strict = !!supported;
  wrapper.leaf = predicate.leaf;
  return wrapper;
};

module.exports = wrap;
});

const Syntax = {
  // Syntax Nodes
  Keyword: "Keyword",
  Export: "Export",
  Import: "Import",
  Statement: "Statement",
  IfThenElse: "IfThenElse",
  UnaryExpression: "UnaryExpression",
  BinaryExpression: "BinaryExpression",
  TernaryExpression: "TernaryExpression",
  NumberLiteral: "NumberLiteral",
  StringLiteral: "StringLiteral",
  Punctuator: "Punctuator",
  Identifier: "Identifier",
  ArraySubscript: "ArraySubscript",
  Constant: "Constant",
  Type: "Type",
  Declaration: "Declaration",
  FunctionDeclaration: "FunctionDeclaration",
  ArrayDeclaration: "ArrayDeclaration",
  IndirectFunctionCall: "IndirectFunctionCall",
  FunctionCall: "FunctionCall",
  Loop: "Loop",
  Program: "Program",
  MemoryAssignment: "MemoryAssignment",
  Assignment: "Assignment",
  Param: "Param",
  Typedef: "Typedef",
  ReturnStatement: "ReturnStatement",
  Sequence: "Sequence",

  // Semantic Nodes
  FunctionIndex: "FunctionIndex",
  FunctionIdentifier: "FunctionIdentifier",
  FunctionPointer: "FunctionPointer"
};

var Syntax_1 = Syntax;

const supported = ['+', '++', '-', '--', '=', '==', '=>', '<=', '!=', '%', '/', '^', '&', '|', '!', '**', ':', '(', ')', '.', '{', '}', ',', '[', ']', ';', '>', '<', '?'];

const trie = new trie$1(supported);
var index = token(trie.fsearch, Syntax_1.Punctuator, supported);

var index$1 = createCommonjsModule(function (module) {
const { isNaN, parseInt } = Number;



const isNumber = char => !isNaN(parseInt(char));
const isDot = char => char === '.';
const number = char => isNumber(char) ? number : null;
const numberOrDot = char => {
  if (isDot(char)) return number;

  if (isNumber(char)) {
    return numberOrDot;
  }
  return null;
};

const root = char => {
  if (char === '-' || char === '+') return numberOrDot;

  if (isDot(char)) return number;

  if (isNumber(char)) return numberOrDot;

  return null;
};

// TODO: split constants into literals String vs Numbers with Types
module.exports = token(root, Syntax_1.Constant);
});

const quoteOK = quoteCheck => char => quoteCheck;
const nextFails = () => null;

const endsInSingleQuote = char => {
  if (char === '\\') return quoteOK(endsInSingleQuote);
  if (char === '\'') return nextFails;

  return endsInSingleQuote;
};

const endsInDoubleQuote = char => {
  if (char === '\\') return quoteOK(endsInDoubleQuote);
  if (char === '"') return nextFails;

  return endsInDoubleQuote;
};

const maybeQuote = char => {
  if (char === '\'') return endsInSingleQuote;
  if (char === '"') return endsInDoubleQuote;

  return null;
};

const stringParser = token(maybeQuote, Syntax_1.StringLiteral);

const parse = char => {
  if (!stringParser(char) && !index(char) && !index$1(char)) return parse;
  return null;
};
const tokenParser = token(parse, Syntax_1.Identifier);

const supported$1 = [
// EcmaScript
"break", "if", "else", "import", "from", "export", "return", "switch", "case", "default", "const", "let", "for", "continue", "do", "while",

// walt replacement, matching s-expression syntax
"function",

// s-expression
"global", "module", "memory", "table", "type",

// specials/asserts
"invoke", "assert", "assert_return",

// additional syntax
// statically replaced with consant value at compile time
"sizeof"];

const trie$3 = new trie$1(supported$1);
const root = trie$3.fsearch;
var index$2 = token(root, Syntax_1.Keyword, supported$1);

const supported$2 = ['i32', 'i64', 'f32', 'f64', 'Function', 'void'];
const trie$4 = new trie$1(supported$2);
var index$3 = token(trie$4.fsearch, Syntax_1.Type, supported$2);

class Tokenizer {
  constructor(stream, parsers = [index, index$1, tokenParser, index$2, stringParser, index$3]) {
    if (!(stream instanceof Stream)) this.die(`Tokenizer expected instance of Stream in constructor.
                Instead received ${JSON.stringify(stream)}`);
    this.stream = stream;
    this.tokens = [];
    this.pos = 0;
    this.parsers = parsers;
  }

  /**
   * Get next token
   *
   * @return {Object} token
   */
  next() {
    let value = "";
    this.seekNonWhitespace();
    let char;
    let matchers = this.parsers;
    let nextMatchers = this.match(char, matchers);
    let start = {
      line: this.stream.line,
      col: this.stream.col
    };

    do {
      char = this.stream.peek();
      matchers = this.match(char, matchers);
      value += char;
      this.stream.next();
      nextMatchers = this.match(this.stream.peek(), matchers);
    } while (!Stream.eol(this.stream.peek()) && !Stream.eof(this.stream.peek()) && !Stream.whitespace(this.stream.peek()) && nextMatchers.length > 0);

    // If we fell off the end then bail out
    if (Stream.eof(value)) return null;

    const token = this.token(value, matchers);
    token.start = start;
    token.end = {
      line: this.stream.line,
      col: this.stream.col
    };
    this.tokens.push(token);

    return this.tokens[this.pos++];
  }

  match(char, parsers) {
    if (char == null) return parsers;

    return parsers.map(parse => parse(char)).filter(p => p);
  }

  /**
   * Match a particular non-whitespace value to a token
   *
   * @param {String} value Value to match
   * @return {Object} token
   */
  token(value, parsers, token = { type: "unknown", value }) {
    // Strict parsers must end on a leaf node
    if (parsers.length > 1) {
      parsers = parsers.filter(parser => parser.strict ? parser.leaf : true);
      if (parsers.length > 1) parsers = parsers.filter(parser => parser.strict);
    }

    if (parsers.length === 1) token.type = parsers[0].type;

    return token;
  }

  /**
   * Seek Stream until next non-whitespace character. Can end in eof/eol
   */
  seekNonWhitespace() {
    while (this.stream.peek() && Stream.whitespace(this.stream.peek())) this.stream.next();
  }

  parse() {
    while (!Stream.eof(this.stream.peek())) this.next();

    return this.tokens;
  }

  /**
   * Stop parsing and throw a fatal error
   *
   * @param {String} reason
   * @throws
   */
  die(reason) {
    throw new Error(reason);
  }
}

var index$4 = createCommonjsModule(function (module) {
/* eslint-env es6 */
/**
 * WASM types
 *
 * https://github.com/WebAssembly/spec/tree/master/interpreter#s-expression-syntax
 *
 * Plus some extra C type mappings
 *
 * @author arthrubuldauskas@gmail.com
 * @license MIT
 */

const i32 = 1;
const i64 = 1 << 1;
const f32 = 1 << 2;
const f64 = 1 << 3;
const anyfunc = 1 << 4;
const func = 1 << 5;
const block_type = 1 << 6;

// C type mappings
const i8 = 1 << 7;
const u8 = 1 << 8;
const i16 = 1 << 9;
const u16 = 1 << 10;
const u32 = 1 << 11;
const u64 = 1 << 12;

const word = 4;

const sizeof = {
  [i32]: word,
  [i64]: word * 2,
  [f32]: word,
  [f64]: word * 2,
  [u32]: word,
  [u16]: word >> 1,
  [u8]: word >> 2,
  [i8]: word >> 2,
  [i16]: word >> 1,
  [anyfunc]: word,
  [func]: word,
  [block_type]: word
};

// TODO: Make this configurable.
const LITTLE_ENDIAN = true;

const get = (type, index, dataView) => {
  switch (type) {
    case i32:
      return dataView.getInt32(index, LITTLE_ENDIAN);
    case i64:
      return dataView.getInt64(index, LITTLE_ENDIAN);
    case f32:
      return dataView.getFloat32(index, LITTLE_ENDIAN);
    case f64:
      return dataView.getFloat64(index, LITTLE_ENDIAN);
    case anyfunc:
      return dataView.getUint32(index, LITTLE_ENDIAN);
    case func:
      return dataView.getUint32(index, LITTLE_ENDIAN);
    case i8:
      return dataView.getInt8(index, LITTLE_ENDIAN);
    case u8:
      return dataView.getUint8(index, LITTLE_ENDIAN);
    case i16:
      return dataView.getInt16(index, LITTLE_ENDIAN);
    case u16:
      return dataView.getUint16(index, LITTLE_ENDIAN);
    case u32:
      return dataView.getUint32(index, LITTLE_ENDIAN);
    case u64:
      return dataView.getUint64(index, LITTLE_ENDIAN);
    default:
      return dataView.getUint8(index, LITTLE_ENDIAN);
  }
};

const set = (type, index, dataView, value) => {
  switch (type) {
    case i32:
      return dataView.setInt32(index, value, LITTLE_ENDIAN);
    case i64:
      return dataView.setInt64(index, value, LITTLE_ENDIAN);
    case f32:
      return dataView.setFloat32(index, value, LITTLE_ENDIAN);
    case f64:
      return dataView.setFloat64(index, value, LITTLE_ENDIAN);
    case anyfunc:
      return dataView.setUint32(index, value, LITTLE_ENDIAN);
    case func:
      return dataView.setUint32(index, value, LITTLE_ENDIAN);
    case i8:
      return dataView.setInt8(index, value, LITTLE_ENDIAN);
    case u8:
      return dataView.setUint8(index, value, LITTLE_ENDIAN);
    case i16:
      return dataView.setInt16(index, value, LITTLE_ENDIAN);
    case u16:
      return dataView.setUint16(index, value, LITTLE_ENDIAN);
    case u32:
      return dataView.setUint32(index, value, LITTLE_ENDIAN);
    case u64:
      return dataView.setUint64(index, value, LITTLE_ENDIAN);
    default:
      return dataView.setUint8(index, value, LITTLE_ENDIAN);
  }
};

module.exports = {
  i32,
  i64,
  f32,
  f64,
  anyfunc,
  func,
  block_type,
  i8,
  u8,
  i16,
  u16,
  u32,
  u64,
  set,
  get,
  sizeof
};
});

var index_1 = index$4.i32;
var index_2 = index$4.i64;
var index_3 = index$4.f32;
var index_4 = index$4.f64;
var index_9 = index$4.u8;
var index_12 = index$4.u32;
var index_14 = index$4.set;
var index_16 = index$4.sizeof;

const EXTERN_FUNCTION = 0;
const EXTERN_TABLE = 1;
const EXTERN_MEMORY = 2;
const EXTERN_GLOBAL = 3;

const getTypeString = type => {
  switch (type) {
    case I32:
      return 'i32';
    case I64:
      return 'i64';
    case F32:
      return 'f32';
    case F64:
      return 'f64';
    case FUNC:
      return 'func';
    case ANYFUNC:
      return 'anyfunc';
    default:
      return '?';
  }
};

const I32 = 0x7F;
const I64 = 0x7E;
const F32 = 0x7D;
const F64 = 0x7C;
const ANYFUNC = 0x70;
const FUNC = 0x60;

/**
 * Ported from https://github.com/WebAssembly/wabt/blob/master/src/opcode.def
 */
const def = {};
const opcodeMap = [];
const textMap = [];
const ___ = null;

/**
 * Convert Opcode definiton to usable object(s)
 *
 * @param {Number} result result type
 * @param {Number} first  t1 type of the 1st parameter
 * @param {Number} second type of the 2nd parameter
 * @param {Number} m      memory size of the operation, if any
 * @param {Number} code   opcode
 * @param {String} name   used to generate the opcode enum
 * @param {String} text   a string of the opcode name in the text format
 *
 * @return {Object} Opcode
 **/
const opcode = (result, first, second, size, code, name, text) => {
  const definition = {
    result,
    first,
    second,
    size,
    code,
    name,
    text
  };

  def[name] = definition;
  opcodeMap[code] = definition;
  textMap[text] = definition;

  return definition;
};

opcode(___, ___, ___, 0, 0x00, 'Unreachable', "unreachable");
opcode(___, ___, ___, 0, 0x01, 'Nop', "nop");
opcode(___, ___, ___, 0, 0x02, 'Block', "block");
opcode(___, ___, ___, 0, 0x03, 'Loop', "loop");
opcode(___, ___, ___, 0, 0x04, 'If', "if");
opcode(___, ___, ___, 0, 0x05, 'Else', "else");
opcode(___, ___, ___, 0, 0x06, 'Try', "try");
opcode(___, ___, ___, 0, 0x07, 'Catch', "catch");
opcode(___, ___, ___, 0, 0x08, 'Throw', "throw");
opcode(___, ___, ___, 0, 0x09, 'Rethrow', "rethrow");
opcode(___, ___, ___, 0, 0x0a, 'CatchAll', "catch_all");
opcode(___, ___, ___, 0, 0x0b, 'End', "end");
opcode(___, ___, ___, 0, 0x0c, 'Br', "br");
opcode(___, ___, ___, 0, 0x0d, 'BrIf', "br_if");
opcode(___, ___, ___, 0, 0x0e, 'BrTable', "br_table");
opcode(___, ___, ___, 0, 0x0f, 'Return', "return");
opcode(___, ___, ___, 0, 0x10, 'Call', "call");
opcode(___, ___, ___, 0, 0x11, 'CallIndirect', "call_indirect");
opcode(___, ___, ___, 0, 0x1a, 'Drop', "drop");
opcode(___, ___, ___, 0, 0x1b, 'Select', "select");
opcode(___, ___, ___, 0, 0x20, 'GetLocal', "get_local");
opcode(___, ___, ___, 0, 0x21, 'SetLocal', "set_local");
opcode(___, ___, ___, 0, 0x22, 'TeeLocal', "tee_local");
opcode(___, ___, ___, 0, 0x23, 'GetGlobal', "get_global");
opcode(___, ___, ___, 0, 0x24, 'SetGlobal', "set_global");
opcode(index_1, index_1, ___, 4, 0x28, 'i32Load', "i32.load");
opcode(index_2, index_1, ___, 8, 0x29, 'i64Load', "i64.load");
opcode(index_3, index_1, ___, 4, 0x2a, 'f32Load', "f32.load");
opcode(index_3, index_1, ___, 8, 0x2b, 'f32Load', "f64.load");
opcode(index_1, index_1, ___, 1, 0x2c, 'i32Load8S', "i32.load8_s");
opcode(index_1, index_1, ___, 1, 0x2d, 'i32Load8U', "i32.load8_u");
opcode(index_1, index_1, ___, 2, 0x2e, 'i32Load16S', "i32.load16_s");
opcode(index_1, index_1, ___, 2, 0x2f, 'i32Load16U', "i32.load16_u");
opcode(index_2, index_1, ___, 1, 0x30, 'i64Load8S', "i64.load8_s");
opcode(index_2, index_1, ___, 1, 0x31, 'i64Load8U', "i64.load8_u");
opcode(index_2, index_1, ___, 2, 0x32, 'i64Load16S', "i64.load16_s");
opcode(index_2, index_1, ___, 2, 0x33, 'i64Load16U', "i64.load16_u");
opcode(index_2, index_1, ___, 4, 0x34, 'i64Load32S', "i64.load32_s");
opcode(index_2, index_1, ___, 4, 0x35, 'i64Load32U', "i64.load32_u");
opcode(___, index_1, index_1, 4, 0x36, 'i32Store', "i32.store");
opcode(___, index_1, index_2, 8, 0x37, 'i64Store', "i64.store");
opcode(___, index_1, index_3, 4, 0x38, 'f32Store', "f32.store");
opcode(___, index_1, index_3, 8, 0x39, 'f32Store', "f64.store");
opcode(___, index_1, index_1, 1, 0x3a, 'i32Store8', "i32.store8");
opcode(___, index_1, index_1, 2, 0x3b, 'i32Store16', "i32.store16");
opcode(___, index_1, index_2, 1, 0x3c, 'i64Store8', "i64.store8");
opcode(___, index_1, index_2, 2, 0x3d, 'i64Store16', "i64.store16");
opcode(___, index_1, index_2, 4, 0x3e, 'i64Store32', "i64.store32");
opcode(index_1, ___, ___, 0, 0x3f, 'CurrentMemory', "current_memory");
opcode(index_1, index_1, ___, 0, 0x40, 'GrowMemory', "grow_memory");
opcode(index_1, ___, ___, 0, 0x41, 'i32Const', "i32.const");
opcode(index_2, ___, ___, 0, 0x42, 'i64Const', "i64.const");
opcode(index_3, ___, ___, 0, 0x43, 'f32Const', "f32.const");
opcode(index_3, ___, ___, 0, 0x44, 'f64Const', "f64.const");
opcode(index_1, index_1, ___, 0, 0x45, 'i32Eqz', "i32.eqz");
opcode(index_1, index_1, index_1, 0, 0x46, 'i32Eq', "i32.eq");
opcode(index_1, index_1, index_1, 0, 0x47, 'i32Ne', "i32.ne");
opcode(index_1, index_1, index_1, 0, 0x48, 'i32LtS', "i32.lt_s");
opcode(index_1, index_1, index_1, 0, 0x49, 'i32LtU', "i32.lt_u");
opcode(index_1, index_1, index_1, 0, 0x4a, 'i32GtS', "i32.gt_s");
opcode(index_1, index_1, index_1, 0, 0x4b, 'i32GtU', "i32.gt_u");
opcode(index_1, index_1, index_1, 0, 0x4c, 'i32LeS', "i32.le_s");
opcode(index_1, index_1, index_1, 0, 0x4d, 'i32LeU', "i32.le_u");
opcode(index_1, index_1, index_1, 0, 0x4e, 'i32GeS', "i32.ge_s");
opcode(index_1, index_1, index_1, 0, 0x4f, 'i32GeU', "i32.ge_u");
opcode(index_1, index_2, ___, 0, 0x50, 'i64Eqz', "i64.eqz");
opcode(index_1, index_2, index_2, 0, 0x51, 'i64Eq', "i64.eq");
opcode(index_1, index_2, index_2, 0, 0x52, 'i64Ne', "i64.ne");
opcode(index_1, index_2, index_2, 0, 0x53, 'i64LtS', "i64.lt_s");
opcode(index_1, index_2, index_2, 0, 0x54, 'i64LtU', "i64.lt_u");
opcode(index_1, index_2, index_2, 0, 0x55, 'i64GtS', "i64.gt_s");
opcode(index_1, index_2, index_2, 0, 0x56, 'i64GtU', "i64.gt_u");
opcode(index_1, index_2, index_2, 0, 0x57, 'i64LeS', "i64.le_s");
opcode(index_1, index_2, index_2, 0, 0x58, 'i64LeU', "i64.le_u");
opcode(index_1, index_2, index_2, 0, 0x59, 'i64GeS', "i64.ge_s");
opcode(index_1, index_2, index_2, 0, 0x5a, 'i64GeU', "i64.ge_u");
opcode(index_1, index_3, index_3, 0, 0x5b, 'f32Eq', "f32.eq");
opcode(index_1, index_3, index_3, 0, 0x5c, 'f32Ne', "f32.ne");
opcode(index_1, index_3, index_3, 0, 0x5d, 'f32Lt', "f32.lt");
opcode(index_1, index_3, index_3, 0, 0x5e, 'f32Gt', "f32.gt");
opcode(index_1, index_3, index_3, 0, 0x5f, 'f32Le', "f32.le");
opcode(index_1, index_3, index_3, 0, 0x60, 'f32Ge', "f32.ge");
opcode(index_1, index_3, index_3, 0, 0x61, 'f32Eq', "f64.eq");
opcode(index_1, index_3, index_3, 0, 0x62, 'f32Ne', "f64.ne");
opcode(index_1, index_3, index_3, 0, 0x63, 'f32Lt', "f64.lt");
opcode(index_1, index_3, index_3, 0, 0x64, 'f32Gt', "f64.gt");
opcode(index_1, index_3, index_3, 0, 0x65, 'f32Le', "f64.le");
opcode(index_1, index_3, index_3, 0, 0x66, 'f32Ge', "f64.ge");
opcode(index_1, index_1, ___, 0, 0x67, 'i32Clz', "i32.clz");
opcode(index_1, index_1, ___, 0, 0x68, 'i32Ctz', "i32.ctz");
opcode(index_1, index_1, ___, 0, 0x69, 'i32Popcnt', "i32.popcnt");
opcode(index_1, index_1, index_1, 0, 0x6a, 'i32Add', "i32.add");
opcode(index_1, index_1, index_1, 0, 0x6b, 'i32Sub', "i32.sub");
opcode(index_1, index_1, index_1, 0, 0x6c, 'i32Mul', "i32.mul");
opcode(index_1, index_1, index_1, 0, 0x6d, 'i32DivS', "i32.div_s");
opcode(index_1, index_1, index_1, 0, 0x6e, 'i32DivU', "i32.div_u");
opcode(index_1, index_1, index_1, 0, 0x6f, 'i32RemS', "i32.rem_s");
opcode(index_1, index_1, index_1, 0, 0x70, 'i32RemU', "i32.rem_u");
opcode(index_1, index_1, index_1, 0, 0x71, 'i32And', "i32.and");
opcode(index_1, index_1, index_1, 0, 0x72, 'i32Or', "i32.or");
opcode(index_1, index_1, index_1, 0, 0x73, 'i32Xor', "i32.xor");
opcode(index_1, index_1, index_1, 0, 0x74, 'i32Shl', "i32.shl");
opcode(index_1, index_1, index_1, 0, 0x75, 'i32ShrS', "i32.shr_s");
opcode(index_1, index_1, index_1, 0, 0x76, 'i32ShrU', "i32.shr_u");
opcode(index_1, index_1, index_1, 0, 0x77, 'i32Rotl', "i32.rotl");
opcode(index_1, index_1, index_1, 0, 0x78, 'i32Rotr', "i32.rotr");
opcode(index_2, index_2, ___, 0, 0x79, 'i64Clz', "i64.clz");
opcode(index_2, index_2, ___, 0, 0x7a, 'i64Ctz', "i64.ctz");
opcode(index_2, index_2, ___, 0, 0x7b, 'i64Popcnt', "i64.popcnt");
opcode(index_2, index_2, index_2, 0, 0x7c, 'i64Add', "i64.add");
opcode(index_2, index_2, index_2, 0, 0x7d, 'i64Sub', "i64.sub");
opcode(index_2, index_2, index_2, 0, 0x7e, 'i64Mul', "i64.mul");
opcode(index_2, index_2, index_2, 0, 0x7f, 'i64DivS', "i64.div_s");
opcode(index_2, index_2, index_2, 0, 0x80, 'i64DivU', "i64.div_u");
opcode(index_2, index_2, index_2, 0, 0x81, 'i64RemS', "i64.rem_s");
opcode(index_2, index_2, index_2, 0, 0x82, 'i64RemU', "i64.rem_u");
opcode(index_2, index_2, index_2, 0, 0x83, 'i64And', "i64.and");
opcode(index_2, index_2, index_2, 0, 0x84, 'i64Or', "i64.or");
opcode(index_2, index_2, index_2, 0, 0x85, 'i64Xor', "i64.xor");
opcode(index_2, index_2, index_2, 0, 0x86, 'i64Shl', "i64.shl");
opcode(index_2, index_2, index_2, 0, 0x87, 'i64ShrS', "i64.shr_s");
opcode(index_2, index_2, index_2, 0, 0x88, 'i64ShrU', "i64.shr_u");
opcode(index_2, index_2, index_2, 0, 0x89, 'i64Rotl', "i64.rotl");
opcode(index_2, index_2, index_2, 0, 0x8a, 'i64Rotr', "i64.rotr");
opcode(index_3, index_3, index_3, 0, 0x8b, 'f32Abs', "f32.abs");
opcode(index_3, index_3, index_3, 0, 0x8c, 'f32Neg', "f32.neg");
opcode(index_3, index_3, index_3, 0, 0x8d, 'f32Ceil', "f32.ceil");
opcode(index_3, index_3, index_3, 0, 0x8e, 'f32Floor', "f32.floor");
opcode(index_3, index_3, index_3, 0, 0x8f, 'f32Trunc', "f32.trunc");
opcode(index_3, index_3, index_3, 0, 0x90, 'f32Nearest', "f32.nearest");
opcode(index_3, index_3, index_3, 0, 0x91, 'f32Sqrt', "f32.sqrt");
opcode(index_3, index_3, index_3, 0, 0x92, 'f32Add', "f32.add");
opcode(index_3, index_3, index_3, 0, 0x93, 'f32Sub', "f32.sub");
opcode(index_3, index_3, index_3, 0, 0x94, 'f32Mul', "f32.mul");
opcode(index_3, index_3, index_3, 0, 0x95, 'f32Div', "f32.div");
opcode(index_3, index_3, index_3, 0, 0x96, 'f32Min', "f32.min");
opcode(index_3, index_3, index_3, 0, 0x97, 'f32Max', "f32.max");
opcode(index_3, index_3, index_3, 0, 0x98, 'f32Copysign', "f32.copysign");
opcode(index_3, index_3, index_3, 0, 0x99, 'f32Abs', "f64.abs");
opcode(index_3, index_3, index_3, 0, 0x9a, 'f32Neg', "f64.neg");
opcode(index_3, index_3, index_3, 0, 0x9b, 'f32Ceil', "f64.ceil");
opcode(index_3, index_3, index_3, 0, 0x9c, 'f32Floor', "f64.floor");
opcode(index_3, index_3, index_3, 0, 0x9d, 'f32Trunc', "f64.trunc");
opcode(index_3, index_3, index_3, 0, 0x9e, 'f32Nearest', "f64.nearest");
opcode(index_3, index_3, index_3, 0, 0x9f, 'f32Sqrt', "f64.sqrt");
opcode(index_3, index_3, index_3, 0, 0xa0, 'f32Add', "f64.add");
opcode(index_3, index_3, index_3, 0, 0xa1, 'f32Sub', "f64.sub");
opcode(index_3, index_3, index_3, 0, 0xa2, 'f32Mul', "f64.mul");
opcode(index_3, index_3, index_3, 0, 0xa3, 'f32Div', "f64.div");
opcode(index_3, index_3, index_3, 0, 0xa4, 'f32Min', "f64.min");
opcode(index_3, index_3, index_3, 0, 0xa5, 'f32Max', "f64.max");
opcode(index_3, index_3, index_3, 0, 0xa6, 'f32Copysign', "f64.copysign");
opcode(index_1, index_2, ___, 0, 0xa7, 'i32Wrapi64', "i32.wrap/i64");
opcode(index_1, index_3, ___, 0, 0xa8, 'i32TruncSf32', "i32.trunc_s/f32");
opcode(index_1, index_3, ___, 0, 0xa9, 'i32TruncUf32', "i32.trunc_u/f32");
opcode(index_1, index_3, ___, 0, 0xaa, 'i32TruncSf32', "i32.trunc_s/f64");
opcode(index_1, index_3, ___, 0, 0xab, 'i32TruncUf32', "i32.trunc_u/f64");
opcode(index_2, index_1, ___, 0, 0xac, 'i64ExtendSi32', "i64.extend_s/i32");
opcode(index_2, index_1, ___, 0, 0xad, 'i64ExtendUi32', "i64.extend_u/i32");
opcode(index_2, index_3, ___, 0, 0xae, 'i64TruncSf32', "i64.trunc_s/f32");
opcode(index_2, index_3, ___, 0, 0xaf, 'i64TruncUf32', "i64.trunc_u/f32");
opcode(index_2, index_3, ___, 0, 0xb0, 'i64TruncSf32', "i64.trunc_s/f64");
opcode(index_2, index_3, ___, 0, 0xb1, 'i64TruncUf32', "i64.trunc_u/f64");
opcode(index_3, index_1, ___, 0, 0xb2, 'f32ConvertSi32', "f32.convert_s/i32");
opcode(index_3, index_1, ___, 0, 0xb3, 'f32ConvertUi32', "f32.convert_u/i32");
opcode(index_3, index_2, ___, 0, 0xb4, 'f32ConvertSi64', "f32.convert_s/i64");
opcode(index_3, index_2, ___, 0, 0xb5, 'f32ConvertUi64', "f32.convert_u/i64");
opcode(index_3, index_3, ___, 0, 0xb6, 'f32Demotef32', "f32.demote/f64");
opcode(index_3, index_1, ___, 0, 0xb7, 'f32ConvertSi32', "f64.convert_s/i32");
opcode(index_3, index_1, ___, 0, 0xb8, 'f32ConvertUi32', "f64.convert_u/i32");
opcode(index_3, index_2, ___, 0, 0xb9, 'f32ConvertSi64', "f64.convert_s/i64");
opcode(index_3, index_2, ___, 0, 0xba, 'f32ConvertUi64', "f64.convert_u/i64");
opcode(index_3, index_3, ___, 0, 0xbb, 'f32Promotef32', "f64.promote/f32");
opcode(index_1, index_3, ___, 0, 0xbc, 'i32Reinterpretf32', "i32.reinterpret/f32");
opcode(index_2, index_3, ___, 0, 0xbd, 'i64Reinterpretf32', "i64.reinterpret/f64");
opcode(index_3, index_1, ___, 0, 0xbe, 'f32Reinterpreti32', "f32.reinterpret/i32");
opcode(index_3, index_2, ___, 0, 0xbf, 'f32Reinterpreti64', "f64.reinterpret/i64");

/**
 * Return opcode mapping to the operator. Signed result is always prefered
 */
const opcodeFromOperator = ({ type, value }) => {
  switch (value) {
    case '+':
      return def[type + 'Add'];
    case '-':
      return def[type + 'Sub'];
    case '*':
      return def[type + 'Mul'];
    case '/':
      return def[type + 'DivS'] || def[type + 'Div'];
    case '%':
      return def[type + 'RemS'] || def[type + 'RemU'];
    case '==':
      return def[type + 'Eq'];
    case '!=':
      return def[type + 'Ne'];
    case '>':
      return def[type + 'GtS'] || def[type + 'Gt'];
    case '<':
      return def[type + 'LtS'] || def[type + 'Lt'];
    case '<=':
      return def[type + 'LeS'] || def[type + 'Le'];
    case '>=':
      return def[type + 'GeS'] || def[type + 'Ge'];
    case '?':
      return def.If;
    case ':':
      return def.Else;
    case '[':
      return def[type + 'Load'];
    default:
      throw new Error(`No mapping from operator to opcode ${value}`);
  }
};

/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var NODE_ENV = undefined;

var invariant = function (condition, format, a, b, c, d, e, f) {
  if (NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

var invariant_1 = invariant;

var slice = Array.prototype.slice;
var toArray = function (a) {
    return slice.call(a);
};
var tail = function (a) {
    return slice.call(a, 1);
};

// fn, [value] -> fn
//-- create a curried function, incorporating any number of
//-- pre-existing arguments (e.g. if you're further currying a function).
var createFn = function (fn, args, totalArity) {
    var remainingArity = totalArity - args.length;

    switch (remainingArity) {
        case 0:
            return function () {
                return processInvocation(fn, concatArgs(args, arguments), totalArity);
            };
        case 1:
            return function (a) {
                return processInvocation(fn, concatArgs(args, arguments), totalArity);
            };
        case 2:
            return function (a, b) {
                return processInvocation(fn, concatArgs(args, arguments), totalArity);
            };
        case 3:
            return function (a, b, c) {
                return processInvocation(fn, concatArgs(args, arguments), totalArity);
            };
        case 4:
            return function (a, b, c, d) {
                return processInvocation(fn, concatArgs(args, arguments), totalArity);
            };
        case 5:
            return function (a, b, c, d, e) {
                return processInvocation(fn, concatArgs(args, arguments), totalArity);
            };
        case 6:
            return function (a, b, c, d, e, f) {
                return processInvocation(fn, concatArgs(args, arguments), totalArity);
            };
        case 7:
            return function (a, b, c, d, e, f, g) {
                return processInvocation(fn, concatArgs(args, arguments), totalArity);
            };
        case 8:
            return function (a, b, c, d, e, f, g, h) {
                return processInvocation(fn, concatArgs(args, arguments), totalArity);
            };
        case 9:
            return function (a, b, c, d, e, f, g, h, i) {
                return processInvocation(fn, concatArgs(args, arguments), totalArity);
            };
        case 10:
            return function (a, b, c, d, e, f, g, h, i, j) {
                return processInvocation(fn, concatArgs(args, arguments), totalArity);
            };
        default:
            return createEvalFn(fn, args, remainingArity);
    }
};

// [value], arguments -> [value]
//-- concat new arguments onto old arguments array
var concatArgs = function (args1, args2) {
    return args1.concat(toArray(args2));
};

// fn, [value], int -> fn
//-- create a function of the correct arity by the use of eval,
//-- so that curry can handle functions of any arity
var createEvalFn = function (fn, args, arity) {
    var argList = makeArgList(arity);

    //-- hack for IE's faulty eval parsing -- http://stackoverflow.com/a/6807726
    var fnStr = 'false||' + 'function(' + argList + '){ return processInvocation(fn, concatArgs(args, arguments)); }';
    return eval(fnStr);
};

var makeArgList = function (len) {
    var a = [];
    for (var i = 0; i < len; i += 1) a.push('a' + i.toString());
    return a.join(',');
};

var trimArrLength = function (arr, length) {
    if (arr.length > length) return arr.slice(0, length);else return arr;
};

// fn, [value] -> value
//-- handle a function being invoked.
//-- if the arg list is long enough, the function will be called
//-- otherwise, a new curried version is created.
var processInvocation = function (fn, argsArr, totalArity) {
    argsArr = trimArrLength(argsArr, totalArity);

    if (argsArr.length === totalArity) return fn.apply(null, argsArr);
    return createFn(fn, argsArr, totalArity);
};

// fn -> fn
//-- curries a function! <3
var curry = function (fn) {
    return createFn(fn, [], fn.length);
};

// num, fn -> fn
//-- curries a function to a certain arity! <33
curry.to = curry(function (arity, fn) {
    return createFn(fn, [], arity);
});

// num, fn -> fn
//-- adapts a function in the context-first style
//-- to a curried version. <3333
curry.adaptTo = curry(function (num, fn) {
    return curry.to(num, function (context) {
        var args = tail(arguments).concat(context);
        return fn.apply(this, args);
    });
});

// fn -> fn
//-- adapts a function in the context-first style to
//-- a curried version. <333
curry.adapt = function (fn) {
    return curry.adaptTo(fn.length, fn);
};

var curry_1$1 = curry;

//      


const FUNCTION_INDEX = "function/index";
const POSTFIX = "operator/postfix";
const LOCAL_INDEX = "local/index";
const GLOBAL_INDEX = "global/index";
const TABLE_INDEX = "table/index";

const make = (payload, type) => ({
  type,
  payload
});

const get = (type, node) => {
  return node.meta.find(({ type: _type }) => _type === type) || null;
};

const funcIndex = payload => ({
  payload,
  type: FUNCTION_INDEX
});

const localIndex = payload => ({
  payload,
  type: LOCAL_INDEX
});

const globalIndex = payload => ({
  payload,
  type: GLOBAL_INDEX
});

const tableIndex = payload => ({
  payload,
  type: TABLE_INDEX
});

const postfix = payload => ({
  payload,
  type: POSTFIX
});

const metadata = {
  make,
  get,
  postfix,
  funcIndex,
  localIndex,
  globalIndex,
  tableIndex,
  POSTFIX,
  LOCAL_INDEX,
  FUNCTION_INDEX,
  TABLE_INDEX
};

// This thing is getting pretty large, should break this file up
// clean this up
const getType = str => {
  switch (str) {
    case "f32":
      return F32;
    case "f64":
      return F64;
    case "i32":
    case "Function":
    default:
      return I32;
  }
};

let syntaxMap = {};

const scopeOperation = curry_1$1((op, node) => {
  const local = get(LOCAL_INDEX, node);
  const _global = get(GLOBAL_INDEX, node);
  const index = local || _global;
  const kind = local ? op + "Local" : op + "Global";
  return { kind: def[kind], params: [index.payload] };
});

const getConstOpcode = node => ({
  kind: def[node.type + "Const"] || def.i32Const,
  params: [node.value]
});

const setInScope = scopeOperation("Set");
const getInScope = scopeOperation("Get");
const mergeBlock = (block, v) => {
  // some node types are a sequence of opcodes:
  // nested expressions for example
  if (Array.isArray(v)) block = [...block, ...v];else block.push(v);
  return block;
};

const mapSyntax = curry_1$1((parent, operand) => {
  const mapping = syntaxMap[operand.Type];
  if (!mapping) {
    const value = operand.id || operand.value || operand.operator && operand.operator.value;
    throw new Error(`Unexpected Syntax Token ${operand.Type} : ${value}`);
  }
  return mapping(operand, parent);
});

const generateExport = node => {
  const _export = {};
  if (node && node.init) {
    return {
      index: node.globalIndex,
      kind: EXTERN_GLOBAL,
      field: node.id
    };
  }

  if (node && node.func) {
    return {
      get index() {
        return get(FUNCTION_INDEX, node).payload.functionIndex;
      },
      kind: EXTERN_FUNCTION,
      field: node.id
    };
  }

  invariant_1(false, "Unknown Export");
};

const generateImport = node => {
  const module = node.module;
  return node.fields.map(({ id, nativeType, typeIndex, global, kind }) => {
    kind = kind || nativeType && EXTERN_GLOBAL || EXTERN_FUNCTION;
    return {
      module,
      field: id,
      global,
      kind,
      typeIndex
    };
  });
};

const generateValueType = node => {
  const value = {
    mutable: node.const ? 0 : 1,
    type: getType(node.type)
  };
  return value;
};

const generateInit = node => {
  const _global = generateValueType(node);

  const { Type, value } = node.init;
  if (Type === Syntax_1.Constant) {
    switch (_global.type) {
      case F32:
      case F64:
        _global.init = parseFloat(value);
        break;
      case I32:
      case I64:
      default:
        _global.init = parseInt(value);
    }
  }

  return _global;
};

const generateType = node => {
  const type = { params: [], result: null };
  if (node.result && node.result !== "void") {
    type.result = getType(node.result);
  }

  type.params = node.params.map(p => getType(p.type));
  type.id = node.id;

  return type;
};

const generateReturn = node => {
  const parent = { postfix: [] };
  // Postfix in return statement should be a no-op UNLESS it's editing globals
  const block = node.params.map(mapSyntax(parent)).reduce(mergeBlock, []);
  block.push({ kind: def.Return });
  if (parent.postfix.length) {
    // do we have postfix operations?
    // are they editing globals?
    // TODO: do things to globals
  }

  return block;
};

const generateDeclaration = (node, parent) => {
  let block = [];
  if (node.init) {
    node.init.type = node.type;
    block = [...block, ...generateExpression(node.init)];
    block.push({ kind: def.SetLocal, params: [node.localIndex] });
  }
  parent.locals.push(generateValueType(node));
  return block;
};

const generateArrayDeclaration = (node, parent) => {
  const block = [];
  if (node.init) {
    block.push.apply(block, generateExpression(node.init));
    block.push({ kind: def.SetLocal, params: [node.localIndex] });
  }
  parent.locals.push(generateValueType(node));
  return block;
};

const generateArraySubscript = (node, parent) => {
  const block = [...node.params.map(mapSyntax(parent)).reduce(mergeBlock, []), { kind: def.i32Const, params: [4] }, { kind: def.i32Mul, params: [] }, { kind: def.i32Add, params: [] }];

  // The last piece is the WASM opcode. Either load or store
  block.push({
    kind: def[node.type + "Load"],
    params: [
    // Alignment
    // TODO: make this extendible
    2,
    // Memory. Always 0 in the WASM MVP
    0]
  });

  return block;
};

/**
 * Transform a binary expression node into a list of opcodes
 */
const generateBinaryExpression = (node, parent) => {
  // Map operands first
  const block = node.params.map(mapSyntax(parent)).reduce(mergeBlock, []);
  // Increment and decrement make this less clean:
  // If either increment or decrement then:
  //  1. generate the expression
  //  2. APPEND TO PARENT post-expressions
  //  3. return [];
  if (node.isPostfix && parent) {
    parent.postfix.push(block);
    // Simply return the left-hand
    return node.params.slice(0, 1).map(mapSyntax(parent)).reduce(mergeBlock, []);
  }

  // Map the operator last
  block.push({
    kind: opcodeFromOperator(node)
  });

  return block;
};

const generateTernary = (node, parent) => {
  const mapper = mapSyntax(parent);
  const block = node.params.slice(0, 1).map(mapper).reduce(mergeBlock, []);

  block.push({
    kind: opcodeFromOperator(node),
    valueType: generateValueType(node)
  });
  block.push.apply(block, node.params.slice(1, 2).map(mapper).reduce(mergeBlock, []));
  block.push({
    kind: opcodeFromOperator({ value: ":" })
  });
  block.push.apply(block, node.params.slice(-1).map(mapper).reduce(mergeBlock, []));
  block.push({ kind: def.End });

  return block;
};

const generateAssignment = (node, parent) => {
  const subParent = { postfix: [] };
  const block = node.params.slice(1).map(mapSyntax(subParent)).reduce(mergeBlock, []);

  block.push(setInScope(node.params[0]));

  return subParent.postfix.reduce(mergeBlock, block);
};

const generateFunctionCall = (node, parent) => {
  const block = node.params.map(mapSyntax(parent)).reduce(mergeBlock, []);

  block.push({
    kind: def.Call,
    params: [get(FUNCTION_INDEX, node).payload.functionIndex]
  });

  return block;
};

const generateIndirectFunctionCall = (node, parent) => {
  const block = node.params.map(mapSyntax(parent)).reduce(mergeBlock, []);

  block.push({
    kind: def.CallIndirect,
    params: [node.typeIndex, { kind: def.Nop, params: [] }]
  });

  return block;
};

const generateFunctionPointer = node => {
  return {
    kind: def.i32Const,
    params: [get(TABLE_INDEX, node).payload]
  };
};

// probably should be called "generateBranch" and be more generic
// like handling ternary for example. A lot of shared logic here & ternary
const generateIf = (node, parent) => {
  const mapper = mapSyntax(parent);
  const block = [node.expr].map(mapper).reduce(mergeBlock, []);

  block.push({
    kind: def.If,
    // if-then-else blocks have no return value and the Wasm spec requires us to
    // provide a literal byte '0x40' for "empty block" in these cases
    params: [0x40]
  });

  // after the expression is on the stack and opcode is following it we can write the
  // implicit 'then' block
  block.push.apply(block, node.then.map(mapper).reduce(mergeBlock, []));

  // fllowed by the optional 'else'
  if (node.else.length) {
    block.push({ kind: def.Else });
    block.push.apply(block, node.else.map(mapper).reduce(mergeBlock, []));
  }

  block.push({ kind: def.End });
  return block;
};

const generateLoop = (node, parent) => {
  const block = [];
  const mapper = mapSyntax(parent);
  const reverse = {
    ">": "<",
    "<": ">",
    ">=": "<=",
    "<=": ">=",
    "==": "!=",
    "!=": "=="
  };

  const condition = node.params.slice(1, 2);
  condition[0].value = reverse[condition[0].value];
  const expression = node.params.slice(2, 3);

  block.push({ kind: def.Block, params: [0x40] });
  block.push({ kind: def.Loop, params: [0x40] });

  block.push.apply(block, condition.map(mapper).reduce(mergeBlock, []));
  block.push({ kind: def.BrIf, params: [1] });

  block.push.apply(block, node.body.map(mapper).reduce(mergeBlock, []));

  block.push.apply(block, expression.map(mapper).reduce(mergeBlock, []));
  block.push({ kind: def.Br, params: [0] });

  block.push({ kind: def.End });
  block.push({ kind: def.End });

  return block;
};

const generateSequence = (node, parent) => {
  return node.params.map(mapSyntax(parent)).reduce(mergeBlock, []);
};

const generateMemoryAssignment = (node, parent) => {
  const block = [...node.params[0].params.map(mapSyntax(parent)).reduce(mergeBlock, []),
  // FIXME: 4 needs to be configurable
  { kind: def.i32Const, params: [4] }, { kind: def.i32Mul, params: [] }, { kind: def.i32Add, params: [] }];

  block.push.apply(block, node.params.slice(1).map(mapSyntax(parent)).reduce(mergeBlock, []));

  // The last piece is the WASM opcode. Either load or store
  block.push({
    kind: def[node.type + "Store"],
    params: [
    // Alignment
    // TODO: make this extendible
    2,
    // Memory. Always 0 in the WASM MVP
    0]
  });

  return block;
};

syntaxMap = {
  [Syntax_1.FunctionCall]: generateFunctionCall,
  [Syntax_1.IndirectFunctionCall]: generateIndirectFunctionCall,
  // Unary
  [Syntax_1.Constant]: getConstOpcode,
  [Syntax_1.BinaryExpression]: generateBinaryExpression,
  [Syntax_1.TernaryExpression]: generateTernary,
  [Syntax_1.IfThenElse]: generateIf,
  [Syntax_1.Identifier]: getInScope,
  [Syntax_1.FunctionIdentifier]: getInScope,
  [Syntax_1.FunctionPointer]: generateFunctionPointer,
  [Syntax_1.ReturnStatement]: generateReturn,
  // Binary
  [Syntax_1.Declaration]: generateDeclaration,
  [Syntax_1.ArrayDeclaration]: generateArrayDeclaration,
  [Syntax_1.ArraySubscript]: generateArraySubscript,
  [Syntax_1.Assignment]: generateAssignment,
  // Memory
  [Syntax_1.MemoryAssignment]: generateMemoryAssignment,
  // Imports
  [Syntax_1.Import]: generateImport,
  // Loops
  [Syntax_1.Loop]: generateLoop,
  // Comma separated lists
  [Syntax_1.Sequence]: generateSequence
};

const generateExpression = (node, parent) => {
  const block = [node].map(mapSyntax(parent)).reduce(mergeBlock, []);
  return block;
};

const generateElement = functionIndex => {
  return { functionIndex };
};

const generateCode = func => {
  const block = {
    code: [],
    locals: []
  };

  // NOTE: Declarations have a side-effect of changing the local count
  //       This is why mapSyntax takes a parent argument
  block.code = func.body.map(mapSyntax(block)).reduce(mergeBlock, []);

  return block;
};

//     


class TokenStream {

  constructor(tokens = []) {
    this.length = tokens.length;
    this.tokens = tokens;
    this.pos = 0;
  }

  next() {
    return this.tokens[this.pos++];
  }

  peek() {
    return this.tokens[this.pos];
  }

  seek(relative) {
    this.pos = relative;
    return this.tokens[this.pos];
  }

  last() {
    return this.tokens[this.length - 1];
  }
}

const generateErrorString = (msg, error, token, Line, filename, func) => {
  const { line, col } = token.start;
  const { col: end } = token.end;

  const highlight = new Array(end - col + 1).join('^').padStart(end, ' ');
  return `
${Line}
${highlight} ${error}
${msg}
  at ${func} (${filename}:${line}:${col})`;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

//      


/**
 * Context is used to parse tokens into an AST and IR used by the generator.
 * Originally the parser was a giant class and the context was the 'this' pointer.
 * Maintaining a monolithic parser is rather difficult so it was broken up into a
 * collection of self-contained parsers for each syntactic construct. The context
 * is passed around between each one to generate the desired tree
 */

class Context {

  constructor(options) {
    Object.assign(this, _extends({
      body: [],
      diAssoc: "right",
      globals: [],
      functions: [],
      lines: [],
      functionImports: [],
      functionImportsLength: 0
    }, options));

    this.Program = {
      body: [],
      // Setup keys needed for the emiter
      Types: [],
      Code: [],
      Exports: [],
      Imports: [],
      Globals: [],
      Element: [],
      Functions: [],
      Memory: []
    };
  }

  syntaxError(msg, error) {
    return new SyntaxError(generateErrorString(msg, error || "", this.token, this.lines[this.token.start.line - 1], this.filename || "unknown", this.func && this.func.id || "global"));
  }

  unexpectedValue(value) {
    return this.syntaxError(`Expected: ${Array.isArray(value) ? value.join("|") : value}`, "Unexpected value");
  }

  unexpected(token) {
    return this.syntaxError(`Expected: ${Array.isArray(token) ? token.join(" | ") : JSON.stringify(token)}`, `Unexpected token ${this.token.type}`);
  }

  unknown({ value }) {
    return this.syntaxError("Unknown token", value);
  }

  unsupported() {
    return this.syntaxError("Language feature not supported", this.token.value);
  }

  expect(value, type) {
    const token = this.token;
    if (!this.eat(value, type)) {
      throw value ? this.unexpectedValue(value) : this.unexpected(type);
    }

    return token;
  }

  next() {
    this.token = this.stream.next();
  }

  eat(value, type) {
    if (value) {
      if (value.includes(this.token.value)) {
        this.next();
        return true;
      }
      return false;
    }

    if (this.token.type === type) {
      this.next();
      return true;
    }

    return false;
  }

  startNode(token = this.token) {
    return {
      Type: "",
      value: token.value,
      range: [token.start],
      meta: [],
      params: []
    };
  }

  endNode(node, Type) {
    const token = this.token || this.stream.last();
    return _extends({}, node, {
      Type,
      range: node.range.concat(token.end)
    });
  }

  makeNode(node, syntax) {
    return this.endNode(_extends({}, this.startNode(), node), syntax);
  }
}

//      
const memoryImport = generateImport({
  module: "env",
  fields: [{
    id: "memory",
    kind: EXTERN_MEMORY
  }]
});

const writeFunctionPointer = (ctx, functionIndex) => {
  if (!ctx.Program.Element.length) {
    ctx.Program.Imports.push.apply(ctx.Program.Imports, generateImport({
      module: "env",
      fields: [{
        id: "table",
        kind: EXTERN_TABLE
      }]
    }));
  }

  const exists = ctx.Program.Element.findIndex(n => n.functionIndex === functionIndex);
  if (exists < 0) {
    ctx.Program.Element.push(generateElement(functionIndex));
    return ctx.Program.Element.length - 1;
  }

  return exists;
};

const importMemory = ctx => {
  if (!ctx.Program.Imports.find(({ kind }) => kind === EXTERN_MEMORY)) {
    ctx.Program.Imports.push.apply(ctx.Program.Imports, memoryImport);

    const newNode = ctx.makeNode({
      id: "new",
      params: [{ type: "i32", isParam: true }],
      result: "i32",
      // ctx.Program.Types.length
      typeIndex: 1,
      meta: [make({ functionIndex: ctx.functionImports.length }, FUNCTION_INDEX)]
    }, Syntax_1.FunctionDeclaration);

    ctx.Program.Types.push(generateType(newNode));
    ctx.Program.Imports.push.apply(ctx.Program.Imports, generateImport({
      module: "env",
      fields: [{
        id: "new",
        kind: EXTERN_FUNCTION,
        typeIndex: newNode.typeIndex
      }]
    }));
    ctx.Program.Functions.push(null);
    ctx.functionImports.push(newNode);
  }
};

//      
const functionCall = (ctx, op, operands) => {
  const node = ctx.startNode(op);
  // If last operand is a sequence that means we have function arguments
  const maybeArguments = operands[operands.length - 1];
  if (maybeArguments && maybeArguments.Type !== Syntax_1.FunctionIdentifier) {
    node.params = operands.splice(-1);
  }

  const identifier = operands.splice(-1)[0];
  const maybePointer = ctx.func.locals.find(l => l.id === identifier.value);
  const localIndex = ctx.func.locals.findIndex(({ id }) => id === identifier.value);

  let Type = Syntax_1.FunctionCall;

  if (maybePointer && localIndex > -1) {
    Type = Syntax_1.IndirectFunctionCall;
    const functionIndex = identifier.meta[0].payload;
    node.params.push(identifier);
  } else {
    const func = ctx.functions.find(({ id }) => id == identifier.value);
    if (!func) throw ctx.syntaxError(`Undefined function: ${identifier.value}`);

    node.meta.push(_extends({}, func.meta[0]));
  }

  return ctx.endNode(node, Type);
};

// More or less JavaScript precedence
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence

const PRECEDENCE_PARAMS = -99;
const PRECEDENCE_COMMA = -1;
const PRECEDENCE_ADDITION = 0;
const PRECEDENCE_SUBTRACTION = 0;
const PRECEDENCE_MULTIPLY = 1;
const PRECEDENCE_DIVIDE = 1;
const PRECEDENCE_INCREMENT = 2;


const PRECEDENCE_FUNCTION_CALL = 19;

const precedence = {
  "(": PRECEDENCE_PARAMS,
  ",": PRECEDENCE_COMMA,
  "+": PRECEDENCE_ADDITION,
  "-": PRECEDENCE_SUBTRACTION,
  "*": PRECEDENCE_MULTIPLY,
  "/": PRECEDENCE_DIVIDE,
  "++": PRECEDENCE_INCREMENT,
  "--": 2,
  "==": 2,
  "!=": 2,
  "=": 3,
  "-=": 3,
  "+=": 3,
  ":": 4,
  "?": 4,
  ">": 5,
  "<": 5
};

//      
const findTypeIndex$1 = (node, ctx) => {
  return ctx.Program.Types.findIndex(t => {
    const paramsMatch = t.params.length === node.params.length && t.params.reduce((a, v, i) => node.params[i] && a && v === getType(node.params[i].type), true);

    const resultMatch = t.result == node.result || node.result && t.result === getType(node.result.type);

    return paramsMatch && resultMatch;
  });
};

const findFieldIndex = fields => (ctx, token) => {
  let field = fields.reduce((memo, f) => {
    if (memo) return memo[f];
    return memo;
  }, ctx);

  if (field) {
    return field.findIndex(node => node.id === token.value);
  }

  return -1;
};

const findLocalIndex = findFieldIndex(["func", "locals"]);
const findGlobalIndex = findFieldIndex(["globals"]);
const findFunctionIndex = findFieldIndex(["functions"]);

// FIXME: do all of this inline here
// FIXME: add a symbol for function call
const getPrecedence = token => {
  return precedence[token.value];
};
const getAssociativty = token => {
  switch (token.value) {
    case "+":
    case "-":
    case "/":
    case "*":
    case ":":
      return "left";
    case "=":
    case "--":
    case "++":
    case "?":
      return "right";
    default:
      return "left";
  }
};

//      
function binary(ctx, op, params) {
  const node = ctx.startNode(params[0]);
  node.value = op.value;
  node.params = params;
  // FIXME: type of the binary expression should be more accurate
  node.type = params[0].type || "i32";

  ctx.diAssoc = "left";
  let Type = Syntax_1.BinaryExpression;
  if (node.value === "=") {
    Type = Syntax_1.Assignment;
    ctx.diAssoc = "right";
  } else if (node.value === "[") {
    Type = Syntax_1.ArraySubscript;
  }

  return ctx.endNode(node, Type);
}

function unary(ctx, op, params) {
  // Since WebAssembly has no 'native' support for incr/decr _opcode_ it's much simpler to
  // convert this unary to a binary expression by throwing in an extra operand of 1
  if (op.value === "--" || op.value === "++") {
    const newParams = [...params, ctx.makeNode({
      value: "1"
    }, Syntax_1.Constant)];
    const newOperator = binary(ctx, _extends({}, op), newParams);
    newOperator.meta.push(metadata.postfix(true));
    newOperator.value = op.value[0];
    return newOperator;
  }
  const node = ctx.startNode(params[0]);
  node.params = params;
  node.value = op.value;

  return ctx.endNode(node, Syntax_1.UnaryExpression);
}

const ternary = (ctx, op, params) => {
  const node = ctx.startNode(params[0]);
  node.params = params;
  node.value = op.value;
  node.type = params[params.length - 1].type;

  return ctx.endNode(node, Syntax_1.TernaryExpression);
};

const flattenSequence = sequence => {
  return sequence.reduce((memo, node) => {
    if (node.Type === Syntax_1.Sequence) {
      memo.push.apply(memo, flattenSequence(node.params));
    } else {
      memo.push(node);
    }

    return memo;
  }, []);
};

// Sequence is a list of comma separated nodes. It's a slighlty special operator
// in that it unrolls any other sequences into it's own params
const sequence = (ctx, op, params) => {
  const node = ctx.startNode(params[0]);
  node.value = op.value;
  node.params = flattenSequence(params);
  node.type = op.type;
  return ctx.endNode(node, Syntax_1.Sequence);
};

// Abstraction for handling operations
const operator = (ctx, op, operands) => {
  switch (op.value) {
    case "++":
    case "--":
      return unary(ctx, op, operands.splice(-1));
    case "?":
      return ternary(ctx, op, operands.splice(-3));
    case ",":
      return sequence(ctx, op, operands.slice(-2));
    default:
      if (op.type === Syntax_1.FunctionCall) return functionCall(ctx, op, operands);
      return binary(ctx, op, operands.splice(-2));
  }
};

const constant$1 = ctx => {
  const node = ctx.startNode();
  const value = ctx.token.value;
  if (value.toString().indexOf(".") !== -1) node.type = "f32";else node.type = "i32";
  node.value = value;
  return ctx.endNode(node, Syntax_1.Constant);
};

//     
// Maybe identifier, maybe function call
const maybeIdentifier = ctx => {
  const node = ctx.startNode();
  const localIndex$$1 = findLocalIndex(ctx, ctx.token);
  const globalIndex$$1 = findGlobalIndex(ctx, ctx.token);
  const functionIndex = findFunctionIndex(ctx, ctx.token);

  let Type = Syntax_1.Identifier;
  // Not a function call or pointer, look-up variables
  if (localIndex$$1 !== -1) {
    node.type = ctx.func.locals[localIndex$$1].type;
    node.meta.push(metadata.localIndex(localIndex$$1));
  } else if (globalIndex$$1 !== -1) {
    node.type = ctx.globals[globalIndex$$1].type;
    node.meta.push(metadata.globalIndex(globalIndex$$1));
  } else if (functionIndex !== -1 && ctx.stream.peek().value !== "(") {
    node.type = "i32";
    Type = Syntax_1.FunctionPointer;
    node.meta.push(metadata.tableIndex(writeFunctionPointer(ctx, functionIndex)));
  } else if (functionIndex == -1) {
    throw ctx.syntaxError(`Undefined variable name ${ctx.token.value}`);
  }

  ctx.diAssoc = "left";
  return ctx.endNode(node, Type);
};

//      
const last = list => list[list.length - 1];

const valueIs = v => o => o.value === v;

const isLBracket = valueIs("(");
const isLSqrBracket = valueIs("[");
const isTStart = valueIs("?");
const predicate = (token, depth) => token.value !== ";" && depth > 0;

// Shunting yard
const expression = (ctx, type = "i32", check = predicate) => {
  const operators = [];
  const operands = [];
  // Depth is the nesting level of brackets in this expression. If we find a
  // closing bracket which causes our depth to fall below 1, then we know we
  // should exit the expression.
  let depth = 1;
  let eatFunctionCall = false;

  const consume = () => operands.push(operator(ctx, operators.pop(), operands));

  const eatUntil = condition => {
    let prev = last(operators);
    while (prev && !condition(prev)) {
      consume();
      prev = last(operators);
    }
  };

  const flushOperators = (precedence, value) => {
    let previous = null;
    while ((previous = last(operators)) && previous.Type !== Syntax_1.Sequence && getPrecedence(previous) >= precedence && getAssociativty(previous) === "left") {
      if (value === "," && previous.type === Syntax_1.FunctionCall) break;
      consume();
    }
  };

  const process = () => {
    if (ctx.token.type === Syntax_1.Constant) {
      eatFunctionCall = false;
      operands.push(constant$1(ctx));
    } else if (ctx.token.type === Syntax_1.Identifier) {
      eatFunctionCall = true;
      operands.push(maybeIdentifier(ctx));
    } else if (ctx.token.type === Syntax_1.Punctuator) {
      switch (ctx.token.value) {
        case "(":
          depth++;
          // Function call.
          // TODO: figure out a cleaner(?) way of doing this, maybe
          if (eatFunctionCall) {
            // definetly not immutable
            last(operands).Type = Syntax_1.FunctionIdentifier;
            flushOperators(PRECEDENCE_FUNCTION_CALL);
            // Tokenizer does not generate function call tokens it is our job here
            // to generate a function call on the fly
            operators.push(_extends({}, ctx.token, {
              type: Syntax_1.FunctionCall
            }));
            ctx.next();
            const expr = expression(ctx);
            if (expr) operands.push(expr);
            return false;
          } else {
            operators.push(ctx.token);
          }
          break;
        case "[":
          depth++;
          operators.push(ctx.token);
          break;
        case "]":
          depth--;
          eatUntil(isLSqrBracket);
          consume();
          break;
        case ":":
          eatUntil(isTStart);
          break;
        case ")":
          {
            depth--;
            if (depth < 1) return false;
            // If we are not in a group already find the last LBracket,
            // consume everything until that point
            eatUntil(isLBracket);
            const previous = last(operators);
            if (previous && previous.type === Syntax_1.FunctionCall) consume();else if (depth > 0)
              // Pop left bracket
              operators.pop();

            break;
          }
        default:
          {
            flushOperators(getPrecedence(ctx.token), ctx.token.value);
            operators.push(ctx.token);
          }
      }
      eatFunctionCall = false;
    }

    return true;
  };

  while (ctx.token && check(ctx.token, depth)) {
    if (process()) ctx.next();
  }

  while (operators.length) consume();

  // Should be a node
  return operands.pop();
};

//      
const generate = (ctx, node) => {
  if (!ctx.func) {
    node.globalIndex = ctx.Program.Globals.length;
    ctx.Program.Globals.push(generateInit(node));
    ctx.globals.push(node);
  } else {
    node.localIndex = ctx.func.locals.length;
    ctx.func.locals.push(node);
  }
};

const arrayDeclaration = (node, ctx) => {
  ctx.expect(["]"]);
  ctx.expect(["="]);

  importMemory(ctx);

  // FIXME: This should be pretty easy to parse with a simple expression
  if (ctx.eat(["new"], Syntax_1.Keyword)) {
    const init = ctx.startNode();
    ctx.expect(["Array"]);
    ctx.expect(["("]);
    node.size = parseInt(ctx.expect(null, Syntax_1.Constant).value);
    ctx.expect([")"]);

    init.id = "new";
    init.params = [ctx.makeNode({
      params: [],
      meta: [],
      range: [],
      value: node.size * 4,
      type: "i32"
    }, Syntax_1.Constant)];

    init.meta = [metadata.funcIndex({
      functionIndex: ctx.functionImports.findIndex(({ id }) => id === "new")
    })];

    node.init = ctx.endNode(init, Syntax_1.FunctionCall);
  }

  generate(ctx, node);

  return ctx.endNode(node, Syntax_1.ArrayDeclaration);
};

const declaration = ctx => {
  const node = ctx.startNode();
  node.const = ctx.token.value === "const";
  if (!ctx.eat(["const", "let", "function"])) throw ctx.unexpectedValue(["const", "let", "function"]);

  node.id = ctx.expect(null, Syntax_1.Identifier).value;
  ctx.expect([":"]);

  node.type = ctx.expect(null, Syntax_1.Type).value;
  if (ctx.eat(["["])) {
    return arrayDeclaration(node, ctx);
  }

  if (ctx.eat(["="])) node.init = expression(ctx, node.type);

  if (node.const && !node.init) throw ctx.syntaxError("Constant value must be initialized");

  generate(ctx, node);

  return ctx.endNode(node, Syntax_1.Declaration);
};

const last$1 = list => list[list.length - 1];

const paramList = ctx => {
  const paramList = [];
  ctx.expect(["("]);
  while (ctx.token.value !== ")") paramList.push(param(ctx));
  ctx.expect([")"]);
  return paramList;
};

const param = ctx => {
  const node = ctx.startNode();
  node.id = ctx.expect(null, Syntax_1.Identifier).value;
  ctx.expect([":"]);

  // maybe a custom type
  const identifier = ctx.token.value;
  if (ctx.eat(null, Syntax_1.Identifier)) {
    // find the type
    node.typePointer = ctx.Program.Types.find(({ id }) => id === identifier);
    if (node.typePointer == null) throw ctx.syntaxError("Undefined Type", identifier);

    node.type = "i32";
  } else {
    node.type = ctx.expect(null, Syntax_1.Type).value;
  }

  node.isParam = true;

  ctx.eat([","]);
  return ctx.endNode(node, Syntax_1.Param);
};

const maybeFunctionDeclaration = ctx => {
  const node = ctx.startNode();
  if (!ctx.eat(["function"])) return declaration(ctx);

  ctx.func = node;
  node.func = true;
  node.id = ctx.expect(null, Syntax_1.Identifier).value;
  node.params = paramList(ctx);
  node.locals = [...node.params];
  ctx.expect([":"]);
  node.result = ctx.expect(null, Syntax_1.Type).value;
  node.result = node.result === "void" ? null : node.result;

  // NOTE: We need to write function into Program BEFORE
  // we parse the body as the body may refer to the function
  // itself recursively
  // Either re-use an existing type or write a new one
  const typeIndex = findTypeIndex$1(node, ctx);
  if (typeIndex !== -1) {
    node.typeIndex = typeIndex;
  } else {
    // attach to a type index
    node.typeIndex = ctx.Program.Types.length;
    ctx.Program.Types.push(generateType(node));
  }

  node.meta = [make({
    get functionIndex() {
      return node.functionIndex + ctx.functionImports.length;
    }
  }, FUNCTION_INDEX)];
  node.functionIndex = ctx.Program.Functions.length;
  ctx.Program.Functions.push(node.typeIndex);
  ctx.functions.push(node);

  ctx.expect(["{"]);
  node.body = [];
  let stmt = null;
  while (ctx.token && ctx.token.value !== "}") {
    stmt = statement(ctx);
    if (stmt) node.body.push(stmt);
  }

  // Sanity check the return statement
  const ret = last$1(node.params);
  if (ret && node.type) {
    if (node.type === "void" && ret.Type === Syntax_1.ReturnStatement) throw ctx.syntaxError("Unexpected return value in a function with result : void");
    if (node.type !== "void" && ret.Type !== Syntax_1.ReturnStatement) throw ctx.syntaxError("Expected a return value in a function with result : " + node.result);
  } else if (node.result) {}
  // throw ctx.syntaxError(`Return type expected ${node.result}, received ${JSON.stringify(ret)}`);


  // generate the code block for the emiter
  ctx.Program.Code.push(generateCode(node));

  ctx.expect(["}"]);
  ctx.func = null;

  return ctx.endNode(node, Syntax_1.FunctionDeclaration);
};

const _export = ctx => {
  const node = ctx.startNode();
  ctx.eat(['export']);

  const decl = maybeFunctionDeclaration(ctx);
  if (!decl.func) {
    if (!decl.init) throw ctx.syntaxError('Exports must have a value');
  }

  ctx.Program.Exports.push(generateExport(decl));
  node.decl = decl;

  ctx.endNode(node, Syntax_1.Export);

  return node;
};

//      
const field = ctx => {
  const f = {
    id: ctx.expect(null, Syntax_1.Identifier).value
  };

  ctx.expect([":"]);
  const typeString = ctx.token.value;
  if (ctx.eat(null, Syntax_1.Type)) {
    // native type, aka GLOBAL export
    f.global = getType(typeString);
  } else if (ctx.eat(null, Syntax_1.Identifier)) {
    // now we need to find a typeIndex, if we don't find one we create one
    // with the idea that a type will be filled in later. if one is not we
    // will throw a SyntaxError when we attempt to emit the binary

    f.typeIndex = ctx.Program.Types.findIndex(({ id }) => id === typeString);
    if (f.typeIndex === -1) {
      f.typeIndex = ctx.Program.Types.length;
      ctx.Program.Types.push({
        id: typeString,
        params: [],
        // When we DO define a type for it later, patch the dummy type
        hoist: node => {
          ctx.Program.Types[f.typeIndex] = generateType(node);
        }
      });
    }

    // attach to a type index
    const functionIndex = ctx.Program.Functions.length;
    f.meta = [make({
      functionIndex
    }, FUNCTION_INDEX)];

    f.functionIndex = functionIndex;

    ctx.Program.Functions.push(null);
    ctx.functions.push(f);
  }

  return f;
};

const fieldList = ctx => {
  const fields = [];
  while (ctx.token.value !== "}") {
    const f = field(ctx);
    if (f) {
      fields.push(f);
      ctx.eat([","]);
    }
  }
  ctx.expect(["}"]);

  return fields;
};

const _import = ctx => {
  const node = ctx.startNode();
  ctx.eat(["import"]);

  if (!ctx.eat(["{"])) throw ctx.syntaxError("expected {");

  node.fields = fieldList(ctx);
  ctx.expect(["from"]);

  node.module = ctx.expect(null, Syntax_1.StringLiteral).value;
  // NOTE: string literals contain the starting and ending quote char
  node.module = node.module.substring(1, node.module.length - 1);

  ctx.Program.Imports.push.apply(ctx.Program.Imports, generateImport(node));

  ctx.endNode(node, Syntax_1.Import);
  return node;
};

//      
const param$1 = ctx => {
  const type = ctx.expect(null, Syntax_1.Type).value;
  if (type === 'void') return null;
  return { type };
};

const params = ctx => {
  const list = [];
  let type;
  ctx.expect(['(']);
  while (ctx.token && ctx.token.value !== ')') {
    type = param$1(ctx);
    if (type) list.push(type);
    ctx.eat([',']);
  }
  ctx.expect([')']);

  return list;
};

const type$1 = ctx => {
  const node = ctx.startNode();

  ctx.eat(['type']);

  node.id = ctx.expect(null, Syntax_1.Identifier).value;
  ctx.expect(['=']);
  node.params = params(ctx);
  ctx.expect(['=>']);
  node.result = param$1(ctx);
  // At this point we may have found a type which needs to hoist
  const needsHoisting = ctx.Program.Types.find(({ id, hoist }) => id === node.id && hoist);
  if (needsHoisting) {
    needsHoisting.hoist(node);
  } else {
    ctx.Program.Types.push(generateType(node));
  }

  ctx.endNode(node, Syntax_1.Typedef);
  return node;
};

//     
const paramList$1 = ctx => {
  ctx.expect(["("]);
  const params = [];
  let node = null;
  while (ctx.token.value && ctx.token.value !== ")") {
    node = expression(ctx, "i32");
    if (node) {
      params.push(node);
      ctx.eat([";"]);
    }
  }

  ctx.expect([")"]);
  return params;
};

const forLoop = ctx => {
  const node = ctx.startNode();
  ctx.eat(["for"]);

  node.params = paramList$1(ctx);

  ctx.expect(["{"]);

  node.body = [];
  let stmt = null;
  while (ctx.token && ctx.token.value !== "}") {
    stmt = statement(ctx);
    if (stmt) node.body.push(stmt);
  }
  ctx.expect(["}"]);

  return ctx.endNode(node, Syntax_1.Loop);
};

//     
const whileLoop = ctx => {
  const node = ctx.startNode();
  ctx.eat(["while"]);
  ctx.expect(["("]);

  node.params = [null, expression(ctx, "i32")];

  ctx.expect([")"]);
  ctx.expect(["{"]);

  node.body = [];
  let stmt = null;
  while (ctx.token && ctx.token.value !== "}") {
    stmt = statement(ctx);
    if (stmt) node.body.push(stmt);
  }

  ctx.expect(["}"]);

  return ctx.endNode(node, Syntax_1.Loop);
};

const returnStatement = ctx => {
  const node = ctx.startNode();
  if (!ctx.func) throw ctx.syntaxError("Return statement is only valid inside a function");
  ctx.expect(["return"]);
  const expr = expression(ctx);

  // For generator to emit correct consant they must have a correct type
  // in the syntax it's not necessary to define the type since we can infer it here
  if (expr.type && ctx.func.result !== expr.type) throw ctx.syntaxError("Return type mismatch");else if (!expr.type && ctx.func.result) expr.type = ctx.func.result;

  node.params.push(expr);

  return ctx.endNode(node, Syntax_1.ReturnStatement);
};

//      
const ifThenElse = ctx => {
  const node = _extends({}, ctx.startNode(ctx.token), {
    then: [],
    else: []
  });
  ctx.eat(["if"]);
  // First operand is the expression
  ctx.expect(["("]);
  node.expr = expression(ctx, "i32");
  ctx.expect([")"]);

  // maybe a curly brace or not
  if (ctx.eat(["{"])) {
    let stmt = null;
    while (ctx.token && ctx.token.value !== "}") {
      stmt = statement(ctx);
      if (stmt) node.then.push(stmt);
    }

    ctx.expect(["}"]);

    if (ctx.eat(["else"])) {
      ctx.expect(["{"]);
      while (ctx.token && ctx.token.value !== "}") {
        stmt = statement(ctx);
        if (stmt) node.else.push(stmt);
      }
      ctx.expect(["}"]);
    }
  } else {
    // parse single statements only
    node.then.push(statement(ctx));
    ctx.expect([";"]);
    if (ctx.eat(["else"])) node.else.push(statement(ctx));
  }

  return ctx.endNode(node, Syntax_1.IfThenElse);
};

const keyword$1 = ctx => {
  switch (ctx.token.value) {
    case 'let':
    case 'const':
      return declaration(ctx);
    case 'function':
      return maybeFunctionDeclaration(ctx);
    case 'export':
      return _export(ctx);
    case 'import':
      return _import(ctx);
    case 'type':
      return type$1(ctx);
    case 'if':
      return ifThenElse(ctx);
    case 'for':
      return forLoop(ctx);
    case 'while':
      return whileLoop(ctx);
    case 'return':
      return returnStatement(ctx);
    default:
      throw ctx.unsupported();
  }
};

//      
// Parse the expression and set the appropriate Type for the egenerator
const memoryStore = ctx => {
  const node = expression(ctx, "i32");
  return ctx.endNode(node, Syntax_1.MemoryAssignment);
};

// It is easier to parse assignment this way as we need to maintain a valid type
// through out the right-hand side of the expression
function maybeAssignment(ctx) {
  const nextValue = ctx.stream.peek().value;
  if (nextValue === '[') return memoryStore(ctx);

  const target = maybeIdentifier(ctx);
  if (target.Type === Syntax_1.FunctionCall) return target;

  const params = [];

  const operator = nextValue === '=' || nextValue === '--' || nextValue === '++';

  if (operator) {
    if (nextValue === '=') {
      ctx.eat(null, Syntax_1.Identifier);
      ctx.eat(['=']);
    }
    const node = ctx.startNode();
    // Push the reference to the local/global
    params.push(target);
    const expr = expression(ctx);
    // not a postfix
    expr.isPostfix = false;
    params.push(expr);

    node.params = params;

    return ctx.endNode(node, Syntax_1.Assignment);
  }

  return expression(ctx);
}

const statement = ctx => {
  switch (ctx.token.type) {
    case Syntax_1.Keyword:
      return keyword$1(ctx);
    case Syntax_1.Punctuator:
      if (ctx.eat([';'])) return null;
    case Syntax_1.Identifier:
      return maybeAssignment(ctx);
    default:
      throw ctx.unknown(ctx.token);
  }
};

//     
class Parser {

  constructor(tokens, lines = []) {
    this.context = new Context({
      body: [],
      diAssoc: "right",
      stream: tokens,
      token: tokens.next(),
      lines,
      globals: [],
      functions: [],
      filename: "unknown.walt"
    });
  }

  // Get the ast
  parse() {
    const ctx = this.context;
    // No code, no problem, empty ast equals
    // (module) ; the most basic wasm module
    if (!ctx.stream || !ctx.stream.length) {
      return {};
    }

    const node = ctx.Program;

    while (ctx.stream.peek()) {
      const child = statement(ctx);
      if (child) node.body.push(child);
    }

    return node;
  }
}

// Used to output raw binary, holds values and types in a large array 'stream'
class OutputStream {
  constructor() {
    // Our data, expand it
    this.data = [];

    // start at the beginning
    this.size = 0;
  }

  push(type, value, debug = "") {
    let size = 0;
    switch (type) {
      case "varuint7":
      case "varuint32":
      case "varint7":
      case "varint1":
        {
          // Encode all of the LEB128 aka 'var*' types
          value = this.encode(value);
          size = value.length;
          invariant_1(size, `Cannot write a value of size ${size}`);
          break;
        }
      default:
        {
          size = index_16[type];
          invariant_1(size, `Cannot write a value of size ${size}, type ${type}`);
        }
    }

    this.data.push({ type, value, debug });
    this.size += size;

    return this;
  }

  encode(value) {
    const encoding = [];
    while (true) {
      const i = value & 127;
      value = value >>> 7;
      if (value === 0) {
        encoding.push(i);
        break;
      }

      encoding.push(i | 0x80);
    }

    return encoding;
  }

  // Get the BUFFER, not data array. **Always creates new buffer**
  buffer() {
    const buffer = new ArrayBuffer(this.size);
    const view = new DataView(buffer);
    let pc = 0;
    this.data.forEach(({ type, value }) => {
      if (Array.isArray(value)) {
        value.forEach(v => index_14(index_9, pc++, view, v));
      } else {
        index_14(type, pc, view, value);
        pc += index_16[type];
      }
    });
    return buffer;
  }

  // Writes source OutputStream into the current buffer
  write(source) {
    if (source) {
      this.data = this.data.concat(source.data);
      this.size += source.size;
    }

    return this;
  }
}

// TODO these should be configure-able/not defined here
const VERSION = 0x1;
const MAGIC = 0x6d736100;



function write() {
  return new OutputStream().push(index_12, MAGIC, `\\0asm`).push(index_12, VERSION, `version ${VERSION}`);
}

const varuint32 = 'varuint32';
const varint7 = 'varint7';
const varint1 = 'varint1';

function emitString(stream, string, debug = 'string length') {
  stream.push(varuint32, string.length, debug);
  for (let i = 0; i < string.length; i++) stream.push(index_9, string.charCodeAt(i), string[i]);
  return stream;
}

const writer = ({
  type,
  label,
  emitter
}) => ast => {
  const field = ast[label];
  if (!field || !field.length) return null;

  const stream = new OutputStream().push(index_9, type, label + ' section');
  const entries = emitter(field);

  stream.push(varuint32, entries.size, 'size');
  stream.write(entries);

  return stream;
};

const emit$1 = entries => {
  const payload = new OutputStream().push(varuint32, entries.length, 'entry count');

  entries.forEach(({ module, field, kind, global, typeIndex }) => {
    emitString(payload, module, 'module');
    emitString(payload, field, 'field');

    switch (kind) {
      case EXTERN_GLOBAL:
        {
          payload.push(index_9, kind, 'Global');
          payload.push(index_9, global, getTypeString(global));
          payload.push(index_9, 0, 'immutable');
          break;
        }
      case EXTERN_FUNCTION:
        {
          payload.push(index_9, kind, 'Function');
          payload.push(varuint32, typeIndex, 'type index');
          break;
        }
      case EXTERN_TABLE:
        {
          payload.push(index_9, kind, 'Table');
          payload.push(index_9, ANYFUNC, 'function table types');
          payload.push(varint1, 0, 'has max value');
          payload.push(varuint32, 0, 'iniital table size');
          break;
        }
      case EXTERN_MEMORY:
        {
          payload.push(index_9, kind, 'Memory');
          payload.push(varint1, 0, 'has no max');
          payload.push(varuint32, 1, 'iniital memory size(PAGES)');
          break;
        }
    }
  });

  return payload;
};

const emit$2 = exports => {
  const payload = new OutputStream();
  payload.push(varuint32, exports.length, 'count');

  exports.forEach(({ field, kind, index }) => {
    emitString(payload, field, 'field');

    payload.push(index_9, kind, 'Global');
    payload.push(varuint32, index, 'index');
  });

  return payload;
};

const encode = (payload, { type, init, mutable }) => {
  payload.push(index_9, type, getTypeString(type));
  payload.push(index_9, mutable, 'mutable');
  if (!Array.isArray(init)) {
    // Encode the constant
    switch (type) {
      case I32:
        payload.push(index_9, def.i32Const.code, def.i32Const.text);
        payload.push(varuint32, init, `value (${init})`);
        break;
      case F32:
        payload.push(index_9, def.f32Const.code, def.f32Const.text);
        payload.push(index_3, init, `value (${init})`);
        break;
      case F64:
        payload.push(index_9, def.f64Const.code, def.f64Const.text);
        payload.push(index_4, init, `value (${init})`);
        break;
    }
  } else {
    // Encode a list of opcodes
    init.forEach(({ kind, params }) => {
      payload.push(index_9, kind.code, kind.text);
      params.forEach(p => payload.push(varuint32, p, `value (${p})`));
    });
  }
  payload.push(index_9, def.End.code, 'end');
};

const emit$3 = globals => {
  const payload = new OutputStream();
  payload.push(varuint32, globals.length, 'count');

  globals.forEach(g => encode(payload, g));

  return payload;
};

// Emits function section. For function code emiter look into code.js
const emit$4 = functions => {
  functions = functions.filter(func => func !== null);
  const stream = new OutputStream();
  stream.push(varuint32, functions.length, 'count');

  functions.forEach(index => stream.push(varuint32, index, 'type index'));

  return stream;
};

//      
const emitElement = stream => ({ functionIndex }, index) => {
  stream.push(varuint32, 0, 'table index');
  stream.push(index_9, def.i32Const.code, 'offset');
  stream.push(varuint32, index, '');
  stream.push(index_9, def.End.code, 'end');
  stream.push(varuint32, 1, 'number of elements');
  stream.push(varuint32, functionIndex, 'function index');
};

const emit$5 = elements => {
  const stream = new OutputStream();
  stream.push(varuint32, elements.length, 'count');

  elements.forEach(emitElement(stream));

  return stream;
};

const emitType = (stream, { params, result }) => {
  // as of wasm 1.0 spec types are only of from === func
  stream.push(varint7, FUNC, 'func type');
  stream.push(varuint32, params.length, 'parameter count');
  params.forEach(type => stream.push(varint7, type, 'param'));
  if (result) {
    stream.push(varint1, 1, 'result count');
    stream.push(varint7, result, `result type ${getTypeString(result)}`);
  } else {
    stream.push(varint1, 0, 'result count');
  }
};

const emit$6 = types => {
  const stream = new OutputStream();
  stream.push(varuint32, types.length, 'count');

  types.forEach(type => emitType(stream, type));

  return stream;
};

// TODO
const emitLocal = (stream, local) => {
  if (local.isParam == null) {
    stream.push(varuint32, 1, "number of locals of following type");
    stream.push(varint7, local.type, `${getTypeString(local.type)}`);
  }
};

const emitFunctionBody = (stream, { locals, code }) => {
  // write bytecode into a clean buffer
  const body = new OutputStream();

  code.forEach(({ kind, params, valueType }) => {
    // There is a much nicer way of doing this
    body.push(index_9, kind.code, kind.text);

    if (valueType) {
      body.push(index_9, valueType.type, "result type");
      body.push(index_9, valueType.mutable, "mutable");
    }

    // map over all params, if any and encode each one
    (params || []).forEach(p => {
      let type = varuint32;
      // either encode unsigned 32 bit values or floats
      switch (kind.result) {
        case index_9:
          type = index_9;
          break;
        case index_4:
          type = index_4;
          break;
        case index_3:
          type = index_3;
          break;
        case index_1:
        default:
          type = varuint32;
      }
      body.push(type, p, " ");
    });
  });

  // output locals to the stream
  const localsStream = new OutputStream();
  locals.forEach(local => emitLocal(localsStream, local));

  // body size is
  stream.push(varuint32, body.size + localsStream.size + 2, "body size in bytes");
  stream.push(varuint32, locals.length, "locals count");

  stream.write(localsStream);
  stream.write(body);
  stream.push(index_9, def.End.code, "end");
};

const emit$7 = functions => {
  // do stuff with ast
  const stream = new OutputStream();
  stream.push(varuint32, functions.length, "function count");
  functions.forEach(func => emitFunctionBody(stream, func));

  return stream;
};

const SECTION_TYPE = 1;
const SECTION_IMPORT = 2;
const SECTION_FUNCTION = 3;


const SECTION_GLOBAL = 6;
const SECTION_EXPORT = 7;

const SECTION_ELEMENT = 9;
const SECTION_CODE = 10;

var section = {
  type: writer({ type: SECTION_TYPE, label: 'Types', emitter: emit$6 }),
  function: writer({ type: SECTION_FUNCTION, label: 'Functions', emitter: emit$4 }),
  imports: writer({ type: SECTION_IMPORT, label: 'Imports', emitter: emit$1 }),
  exports: writer({ type: SECTION_EXPORT, label: 'Exports', emitter: emit$2 }),
  globals: writer({ type: SECTION_GLOBAL, label: 'Globals', emitter: emit$3 }),
  element: writer({ type: SECTION_ELEMENT, label: 'Element', emitter: emit$5 }),
  code: writer({ type: SECTION_CODE, label: 'Code', emitter: emit$7 })
};

function emit(ast = {}) {
  const stream = new OutputStream();

  // Write MAGIC and VERSION. This is now a valid WASM Module
  return stream.write(write()).write(section.type(ast)).write(section.imports(ast)).write(section.function(ast)).write(section.globals(ast)).write(section.exports(ast)).write(section.element(ast)).write(section.code(ast));
}

const _debug = (stream, begin = 0, end) => {
  let pc = 0;
  return stream.data.slice(begin, end).map(({ type, value, debug }) => {
    const pcString = pc.toString(16).padStart(8, "0").padEnd(stream.data.length.toString().length + 1);
    let valueString;
    if (Array.isArray(value)) valueString = value.map(v => v.toString(16)).join().padStart(12);else valueString = value.toString(16).padStart(12);
    const out = `${pcString}: ${valueString} ; ${debug}`;
    pc += index_16[type] || value.length;
    return out;
  }).join("\n") + "\n ============ fin =============";
};

const debug = _debug;

// Used for deugging purposes
const getAst = source => {
  const stream = new Stream(source);
  const tokenizer = new Tokenizer(stream);
  const tokenStream = new TokenStream(tokenizer.parse());
  const parser = new Parser(tokenStream, stream.lines);
  const ast = parser.parse();
  return ast;
};

const getIR = source => {
  const ast = getAst(source);
  const wasm = emit(ast);
  return wasm;
};

// Compiles a raw binary wasm buffer
const compile = source => {
  const wasm = getIR(source);
  return wasm.buffer();
};

exports.debug = debug;
exports.getAst = getAst;
exports.getIR = getIR;
exports['default'] = compile;

Object.defineProperty(exports, '__esModule', { value: true });

})));
