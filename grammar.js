module.exports = grammar({
  name: 'scope',
  extras: $ => [
    /[^{}()\[\]]+/,
  ],

  rules: {
    source_file: $ => repeat($.scope),

    scope: $ => prec.left(
      repeat1(
        choice(
          $._curl_scope,
          $._paren_scope,
          $._bracket_scope,
        ),
      )
    ),

    _curl_scope: $ => prec.left(1, seq('{', repeat($.scope), '}')),
    _paren_scope: $ => prec.left(1, seq('(', repeat($.scope), ')')),
    _bracket_scope: $ => prec.left(1, seq('[', repeat($.scope), ']')),
  }
});
