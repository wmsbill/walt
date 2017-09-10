//@flow

// Tokens
export type Marker = {
  line: number,
  col: number
};

export type Token = {
  start: Marker,
  end: Marker,
  type: string,
  value: string
}

// Nodes
export type Node = {
  start: Marker,
  range: Marker[],
  Type?: string,
  end?: Marker,
};

export type Typed = { id?: string, type: string };
export type TypeNode =
  {
    id: string,
    params: Typed[],
    result: Typed | null
  }
  & Node
  & Typed;

export type Field = {
  id: string,
  global?: number,
  typeIndex?: number,
  functionIndex?: number
};

export type Import =
  {
    fields: Field[],
    module: string
  }
  & Node;

