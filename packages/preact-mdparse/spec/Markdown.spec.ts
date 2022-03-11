import { assert } from 'chai'
import { describe, it } from 'mocha'

import { MDAST } from '../src/index'

export function makeLineTest(tag: string, text: string) {
  const tags: Record<string, string> = {
    h1: '#',
    h2: '##',
    h3: '###',
    h4: '####',
    h5: '#####',
    h6: '######',
    blockquote: '>',
    code: '    ',
    p: ''
  }
  
  const cases: {input: string, expected: {tag: string, text: string}, description: string}[] = [] 
  // plain and pad left
  const a = ["", " ", "  ", "   "].forEach(e => {
    cases.push({
      input: e + tags[tag] + " " + text,
      expected: {tag: tag, text: text},
      description: `should interpret ${tags[tag]} as ${tag}`
    })
  })
  // pad right
  const b = ["", " ", "         ", "             "].forEach(e => {
    cases.push({
      input: tags[tag] + " " + text + e,
      expected: {tag: tag, text: text},
      description: `should interpret ${tags[tag]} as ${tag}`
    })
  })
  cases.forEach((_case) => {it(_case.description, () => 
    assert.deepEqual(new MDAST(_case.input).repr(), _case.expected))
  })
  
  // fail if whitespace is missing
}

describe('MDAST', () => {
    describe('MD Items', () => {
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

            const ret = new MDAST(markdown)
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
        it('should interpret # as h1', () => {
          const md = "# Headline"
          const repr = new MDAST(md).repr()
          const expected = {tag: 'h1', text: 'Headline'}

          assert.deepEqual(repr, expected)
        })
        const taggies = [
          ['h1', 'Headline'],
          ['h2', 'Headline'],
          ['h3', 'Headline'],
          ['h4', 'Headline'],
          ['h5', 'Headline'],
          ['h6', 'Headline'],
          ['p', 'Paragraph text'],
        ]

        taggies.forEach(e => makeLineTest(e[0], e[1]))
    })
})
