# Snapshot report for `src/parser/__tests__/parser-spec.js`

The actual snapshot is saved in `parser-spec.js.snap`.

Generated by [AVA](https://ava.li).

## compiles exports

> Snapshot 1

    {
      Code: [],
      Element: [],
      Exports: [
        {
          field: 'answer',
          index: 0,
          kind: 3,
        },
      ],
      Functions: [],
      Globals: [
        {
          init: 42,
          mutable: 0,
          type: 127,
        },
      ],
      Imports: [],
      Memory: [],
      Types: [],
      body: [
        {
          Type: '',
          decl: {
            Type: 'Declaration',
            const: true,
            globalIndex: 0,
            id: 'answer',
            init: {
              Type: 'Constant',
              meta: [],
              params: [],
              range: [
                {
                  col: 27,
                  line: 1,
                },
                {
                  col: 29,
                  line: 1,
                },
              ],
              type: 'i32',
              value: '42',
            },
            meta: [],
            params: [],
            range: [
              {
                col: 7,
                line: 1,
              },
              {
                col: 30,
                line: 1,
              },
            ],
            type: 'i32',
            value: 'const',
          },
          meta: [],
          params: [],
          range: [
            {
              col: 0,
              line: 1,
            },
          ],
          value: 'export',
        },
      ],
    }

## compiles globals

> Snapshot 1

    {
      Code: [],
      Element: [],
      Exports: [],
      Functions: [],
      Globals: [
        {
          init: 42,
          mutable: 0,
          type: 127,
        },
      ],
      Imports: [],
      Memory: [],
      Types: [],
      body: [
        {
          Type: 'Declaration',
          const: true,
          globalIndex: 0,
          id: 'answer',
          init: {
            Type: 'Constant',
            meta: [],
            params: [],
            range: [
              {
                col: 20,
                line: 1,
              },
              {
                col: 22,
                line: 1,
              },
            ],
            type: 'i32',
            value: '42',
          },
          meta: [],
          params: [],
          range: [
            {
              col: 0,
              line: 1,
            },
            {
              col: 23,
              line: 1,
            },
          ],
          type: 'i32',
          value: 'const',
        },
      ],
    }

## the most basic of modules in wasm

> Snapshot 1

    {}
