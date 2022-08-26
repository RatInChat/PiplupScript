@{% 
    const lexer = require("./lexer");
%}

@lexer lexer

program
    -> _ml statements _ml
    {%
        (data) => {
            return data[1];
        }
    %}
statements
    ->  statement (__lb_ statement):*
        {%
            (data) => {
                const repeated = data[1];
                const restStatements = repeated.map(chunks => chunks[1]);
                return [data[0], ...restStatements];
            }
        %}

statement
    -> var_assign  {% id %}
    |  fun_call    {% id %}
    |  %comment    {% id %}
    |  function    {% id %}
    | const_assign {% id %}
    | import        {% id %}
    | %mulitlineComment {% id %}

var_assign
    -> "piplup" _ %identifier _ "=" _ expr
          {%
            (data) => {
                return {
                    type: "var_assign",
                    var_name: data[2],
                    value: data[6]
                }
            }
          %}
expr
    ->  %string     {% id %}
    |  %number     {% id %}
    |  %identifier {% id %}
    |  fun_call    {% id %}
    |  lambda      {% id %}
 

# var_call
#     -> "$" _ %class_call "." statement
#     {%
#         (data) => {
#             return {
#                 type: "var_call",
#                 var_name: data[2],
#                 value: data[4]
#             }
#         }
#     %}

import
    -> "import" _ %identifier _ "=" _ expr
          {%
            (data) => {
                return {
                    type: "import",
                    import_name: data[2],
                    value: data[6]
                }
            }
          %}

const_assign
    -> "pip" _ %identifier _ "=" _ expr
          {%
            (data) => {
                return {
                    type: "const_assign",
                    const_name: data[2],
                    value: data[6]
                }
            }
          %}

fun_call
    -> %identifier _ "(" _ml (arg_list _ml):? ")"
        {%
            (data) => {
                return {
                    type: "fun_call",
                    fun_name: data[0],
                    arguments: data[4] ? data[4][0] : []
                }
            }
        %}

arg_list

    -> expr
    {%
        (data) => {
            return [data[0]];
        }
    %}
    | arg_list __ml expr
        {%
            (data) => {
                return [...data[0], data[2]];
            }
        %}

lambda -> "(" _ (param_list _):? ")" _ "=>" _ml lambda_body
    {%
        (data) => {
            return {
                type: "lambda",
                parameters: data[2] ? data[2][0] : [],
                body: data[7]
            }
        }
    %}
 


function -> "def" __ %identifier _ "(" (param_list _):? ")" _ml lambda_body
    {%
        (data) => {
            return {
                type: "function",
                func_name: data[2],
                parameters: data[5] ? data[5][0] : [],
                body: data[8]
            }
        }
    %}

param_list
    -> %identifier (__ "pip" __ %identifier):*
        {%
            (data) => {
                const repeatedPieces = data[1];
                const restParams = repeatedPieces.map(piece => piece[1]);
                return [data[0], ...restParams];
            }
        %}
lambda_body
    -> expr
        {%
            (data) => {
                return [data[0]];
            }
        %}
    |  "{" __lb_ statements __lb_ "}"
        {%
            (data) => {
                return data[2];
            }
        %}
# Mandatory line-break with optional whitespace
__lb_ -> (_ %NL):+ _

# Optional multi-line whitespace
_ml -> (%WS | %NL):*
# Mandatory multi-line whitespace
__ml -> (%WS | %NL):+
# Optional whitespace

_ -> %WS:*

# Mandatory whitespace
__ -> %WS:+
