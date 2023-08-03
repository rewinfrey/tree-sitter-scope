### tree-sitter-scope

This is an experimental parser for parsing the scope heirarchy of languages that use curly braces to open and close scopes.

This parser is suitable for use with languages that descend from C family of languages which use `{ ... }` to denote scopes.

Additionally, this parser supports enclosing pairs of `( ... )` and `[ ... ]` to denote scopes.

### Key points

Scopes occuring on the same line:

```
if (cond) { ... }
```

Are parsed as separate nodes:

```
(source_file
  (scope) // signifies the `(cond)` of the `if (cond)`.
  (scope) // signifies the `{ ... }` of the `if (cond) { ... }`.
)
```

However, every scope is associated with a range of line start and line end and column start and column end, which allows for convenient post processing of the tree nodes if desired for the use case.

Nested scopes maintain a clear and correct parent / child relationship:

```
 1|class A {
 2|  function () {
 3|    if (cond) {
 4|      bar()
 5|    } else {
 6|      a = baz()
 7|      return [a]
 8|    }
 9|
10|    return [
11|      d,
12|      c,
13|      b,
14|      a,
15|    ]
16|  }
17|}
```

Produces the tree:

```
(source_file     // start of file
  (scope         // line     1| From the `{` in `class A {`
    (scope)      // line     2| From the `()` in `function () {`
    (scope       // line     2| From the `{` in `function () {`
      (scope)    // line     3| From the `()` in `if (cond) {`
      (scope     // line     3| From the `{` in `if (cond) {`
        (scope)  // line     4| From the `()` in `bar()`
      )          // line     5| From the `}` in `} else {`
      (scope     // line     5| From the `{` in `} else {`
        (scope)  // line     6| From the `()` in `a = baz()`
        (scope)  // line     7| From the `[]` in return `[a]`
      )          // line     8| } end of if statement
      (scope)    // line 12-15| From the `[]` in `return [d,c,b,a]`
    )            // line    16| } end of function
  )              // line    17| } end of class
)                // end of file
```

### Usage

This can be useful for generic parsing of programming language source files for languages using curly braces to denote scopes.

For example, understanding where enclosing pairs of `{ ... }` in any source file can serve as a useful proxy for identifying key syntax elements like function definitions, class bodies, or control flow statements.

