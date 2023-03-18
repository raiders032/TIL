# Metacharacters

- 특별한 의미를 가지는 캐릭터들

| Character | Description                                                  | Example        | Try it                                                       |
| :-------- | :----------------------------------------------------------- | :------------- | :----------------------------------------------------------- |
| []        | A set of characters                                          | "[a-m]"        | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_regex_meta1) |
| \         | Signals a special sequence (can also be used to escape special characters) | "\d"           | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_regex_meta2) |
| .         | Any character (except newline character)                     | "he..o"        | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_regex_meta3) |
| ^         | Starts with                                                  | "^hello"       | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_regex_meta4) |
| $         | Ends with                                                    | "planet$"      | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_regex_meta5) |
| *         | Zero or more occurrences                                     | "he.*o"        | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_regex_meta6) |
| +         | One or more occurrences                                      | "he.+o"        | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_regex_meta7) |
| ?         | Zero or one occurrences                                      | "he.?o"        | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_regex_meta10) |
| {}        | Exactly the specified number of occurrences                  | "he.{2}o"      | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_regex_meta8) |
| \|        | Either or                                                    | "falls\|stays" | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_regex_meta9) |
| ()        | Capture and group                                            |                |                                                              |



## .

(Dot.) In the default mode, this matches any character except a newline. If the [`DOTALL`](https://docs.python.org/3/library/re.html#re.DOTALL) flag has been specified, this matches any character including a newline.



## ^

(Caret.) Matches the start of the string, and in [`MULTILINE`](https://docs.python.org/3/library/re.html#re.MULTILINE) mode also matches immediately after each newline.



## $

Matches the end of the string or just before the newline at the end of the string, and in MULTILINE mode also matches before a newline. foo matches both ‘foo’ and ‘foobar’, while the regular expression foo$ matches only ‘foo’. More interestingly, searching for foo.$ in 'foo1\nfoo2\n' matches ‘foo2’ normally, but ‘foo1’ in MULTILINE mode; searching for a single $ in 'foo\n' will find two (empty) matches: one just before the newline, and one at the end of the string.



## *

Causes the resulting RE to match 0 or more repetitions of the preceding RE, as many repetitions as are possible. ab* will match ‘a’, ‘ab’, or ‘a’ followed by any number of ‘b’s.



## +

Causes the resulting RE to match 1 or more repetitions of the preceding RE. `ab+` will match ‘a’ followed by any non-zero number of ‘b’s; it will not match just ‘a’.



## ?

Causes the resulting RE to match 0 or 1 repetitions of the preceding RE. ab? will match either ‘a’ or ‘ab’.



## {m}

Specifies that exactly *m* copies of the previous RE should be matched; fewer matches cause the entire RE not to match. For example, `a{6}` will match exactly six `'a'` characters, but not five.



## {m,n}

Causes the resulting RE to match from m to n repetitions of the preceding RE, attempting to match as many repetitions as possible. For example, a{3,5} will match from 3 to 5 'a' characters. Omitting m specifies a lower bound of zero, and omitting n specifies an infinite upper bound. As an example, a{4,}b will match 'aaaab' or a thousand 'a' characters followed by a 'b', but not 'aaab'. The comma may not be omitted or the modifier would be confused with the previously described form.



## {m,n}?

Causes the resulting RE to match from m to n repetitions of the preceding RE, attempting to match as few repetitions as possible. This is the non-greedy version of the previous qualifier. For example, on the 6-character string 'aaaaaa', a{3,5} will match 5 'a' characters, while a{3,5}? will only match 3 characters.



# Special Sequences

- A special sequence is a `\` followed by one of the characters in the list below, and has a special meaning:

| Character | Description                                                  | Example           | Try it                                                       |
| :-------- | :----------------------------------------------------------- | :---------------- | :----------------------------------------------------------- |
| \A        | Returns a match if the specified characters are at the beginning of the string | "\AThe"           | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_regex_seq1) |
| \b        | Returns a match where the specified characters are at the beginning or at the end of a word (the "r" in the beginning is making sure that the string is being treated as a "raw string") | r"\bain" r"ain\b" | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_regex_seq2) [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_regex_seq2-2) |
| \B        | Returns a match where the specified characters are present, but NOT at the beginning (or at the end) of a word (the "r" in the beginning is making sure that the string is being treated as a "raw string") | r"\Bain" r"ain\B" | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_regex_seq3) [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_regex_seq3-2) |
| \d        | Returns a match where the string contains digits (numbers from 0-9) | "\d"              | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_regex_seq4) |
| \D        | Returns a match where the string DOES NOT contain digits     | "\D"              | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_regex_seq5) |
| \s        | Returns a match where the string contains a white space character | "\s"              | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_regex_seq6) |
| \S        | Returns a match where the string DOES NOT contain a white space character | "\S"              | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_regex_seq7) |
| \w        | Returns a match where the string contains any word characters (characters from a to Z, digits from 0-9, and the underscore _ character) | "\w"              | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_regex_seq8) |
| \W        | Returns a match where the string DOES NOT contain any word characters | "\W"              | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_regex_seq9) |
| \Z        | Returns a match if the specified characters are at the end of the string | "Spain\Z"         | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_regex_seq10) |



# Set

- A set is a set of characters inside a pair of square brackets `[]` with a special meaning:



| Set        | Description                                                  | Try it                                                       |
| :--------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| [arn]      | Returns a match where one of the specified characters (`a`, `r`, or `n`) is present | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_regex_set1) |
| [a-n]      | Returns a match for any lower case character, alphabetically between `a` and `n` | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_regex_set2) |
| [^arn]     | Returns a match for any character EXCEPT `a`, `r`, and `n`   | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_regex_set3) |
| [0123]     | Returns a match where any of the specified digits (`0`, `1`, `2`, or `3`) are present | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_regex_set4) |
| [0-9]      | Returns a match for any digit between `0` and `9`            | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_regex_set5) |
| [0-5][0-9] | Returns a match for any two-digit numbers from `00` and `59` | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_regex_set6) |
| [a-zA-Z]   | Returns a match for any character alphabetically between `a` and `z`, lower case OR upper case | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_regex_set7) |
| [+]        | In sets, `+`, `*`, `.`, `|`, `()`, `$`,`{}` has no special meaning, so `[+]` means: return a match for any `+` character in the string | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_regex_set8) |



참고

- https://docs.python.org/3/library/re.html