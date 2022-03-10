import { assert } from 'chai'
import { describe, it } from 'mocha'

import { Parser } from '../src/index'

describe('Markdown', () => {
    describe('.parse', () => {
        it('should split markdown strings by "\\n\\n"', () => {
            const markdown = `# Headline

Here's text.
And here's some more.

And here a listing:
- a
- b
+ c
- d

---    

  ### Here's another **headline**!

Here's some quoted stuff:

> Blllaasdsssa
> and antoher blockquote

And here is a code block:

            const x = 1
`

            const parser = new Parser()
            const ret = parser.parse(markdown)
            console.dir(ret.repr(), {depth: null})
            const expected = {
                tag: 'array',
                text: [
                  { tag: 'h1', text: 'Headline' },
                  {
                    tag: 'p',
                    text: "Here's text. And here's some more. And here a listing:"
                  },
                  {
                    tag: 'ulist',
                    text: [
                      { tag: 'ul', text: 'a' },
                      { tag: 'ul', text: 'b' },
                      { tag: 'ul', text: 'c' },
                      { tag: 'ul', text: 'd' }
                    ]
                  },
                  { tag: 'hline', text: '' },
                  { tag: 'h3', text: "Here's another **headline**!" },
                  { tag: 'p', text: "Here's some quoted stuff:" },
                  { tag: 'quote', text: 'Blllaasdsssa and antoher blockquote' },
                  { tag: 'p', text: 'And here is a code block:' },
                  { tag: 'code', text: 'const x = 1' }
                ]
              }
            assert.deepEqual(ret.repr(), expected)
        })
        it('should construct a nested object from a markdown string')
        it('should interpret **\w+** as bold')
        it('should interpret __\w+__ as italics')
    })
})
