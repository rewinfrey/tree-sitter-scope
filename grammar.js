module.exports = grammar({
  name: 'scope',
  extras: $ => [
    /\s/,
    /[^{}()\[\]]+/,
  ],

  externals: $ => [
    $.newline,
    $.indent,
    $.dedent,
    $.string_start,
    $.string_content,
    $.string_end,

    // Mark comments as external tokens so that the external scanner is always
    // invoked, even if no external token is expected. This allows for better
    // error recovery, because the external scanner can maintain the overall
    // structure by returning dedent tokens whenever a dedent occurs, even
    // if no dedent is expected.
    $.comment,

    // Allow the external scanner to check for the validity of closing brackets
    // so that it can avoid returning dedent tokens between brackets.
    ']',
    ')',
    '}',
  ],

  rules: {
    source_file: $ => repeat($.line),

    line: $ => prec.right(seq(
      // choice(
      //   $.indent,
      //   $.dedent,
      // ),
      repeat1($.scope),
      optional($.newline),
    )),

    scope: $ => choice(
      $._curl_scope,
      $._paren_scope,
      $._bracket_scope,
    ),

    _curl_scope: $ => prec.left(1, seq('{', repeat($.line), '}')),
    _paren_scope: $ => prec.left(1, seq('(', repeat($.line), ')')),
    _bracket_scope: $ => prec.left(1, seq('[', repeat($.line), ']')),
  }
});
