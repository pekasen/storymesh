import { assert } from 'chai'
import { describe, it } from 'mocha'

import { MDAST } from '../src/index'

/** Runs a series of automated tests for line tags
 * 
 * @param  {string} tag the tag to test
 * @param  {string} text test string
 * @returns {void}
 */
function makeLineTest(tag: string, text: string): void {
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
  const a = ["", " ", "  ", "   "]
  a.forEach(e => {
    cases.push({
      input: e + tags[tag] + " " + text,
      expected: {tag: tag, text: text},
      description: `should interpret ${tags[tag]} as ${tag}`
    })
  })
  // pad right
  a.forEach(e => {
    cases.push({
      input: tags[tag] + " " + text + e,
      expected: {tag: tag, text: text},
      description: `should interpret ${tags[tag]} as ${tag}`
    })
  })
  cases.forEach((_case) => {it(`${_case.description} for input: "${_case.input}"`, () => 
    assert.deepEqual(new MDAST(_case.input).repr(), _case.expected))
  })
  
  // fail if whitespace is missing
}

// function makeInlineTest(tag: string, text: string) {

// }

// const large = `
// # Ignesque Icarus frontis dubium stant arma habenti

// ## Crabronum datura igitur raptaque

// Lorem markdownum stimulataque cribri grata, est, nato debilis ferreus aequora me
// quatenus ripae amplexu Perseus. Gemitum _locum_ faceret, fumis parte respondit
// traiecit peregit, repertum. A subegit tenaci patres more faverat tectoque exiguo
// ad ictibus, male qui oculos gesserit et. Claudit nomine, coepta. Nil nigro nec
// ferre huic Libye, et vulnere ambit manus: viribus.

// > Exsultatque placeas sedes ferrum. Ars enim Cytherea. Sed auribus minus ex
// > licuit resupinus sculpsit tenus vel nympharum tuta saniemque agendum atque et
// > mentis erant. Bacis hunc urbe de doloris utque.

// **Cura** natus dixit saepe **ne omnem**. Puppi Eurystheus tum, ut umbra et duo
// videtur, manu vultus animum et undas obstipuit miscuit, sintque pro. **Fuit**
// facit virtus inquit, per est est et arcus en sonuit. Pars Romana et felix
// paretur: est speravit exemploque omnes. Velant tua aevum at profusis per dixerat
// lumina, Eurytus, et.

// > Iunctura timor barba letataque te urguet misero legem, statione praemiaque
// > libidine adhuc texerat exstabant infelix rediit congerie vocabat. Exire fuit
// > hic esse ramum, pugnantem, tenet relevare salutant creati aquarum. Est tamquam
// > viaque. Est **quo** pulverulenta erant Atlantiades petit, pellis sinus esto
// > tyranno decorem.

// ## Narrata iterum

// **Nostros mallet procubuit** quoque novantur sceleratus _ipso_ pabula. Simul in
// primi per movere litore nequeunt praecipue dextra tertius obtulit post. Ense
// medio. Cum et, non praestem tulit annum silet, iuxta Tartara nymphae habemus
// inpositum pericula prius. Poenas hamadryadas ipsum solet sed, labori nec aethera
// altaria spatioso, sub excidit ferat truncoque valle!

//     var ipx = hardCopyrightRate(dcim_bar_backside);
//     web_abend_market = servlet;
//     megapixel -= animatedHibernate;

// Viri matri effuge sceleratus reddere peremptis sacra, oras aliter fuisset mira
// _infestae_ pascua nostrum venerat mellaque conspexit ternis, lacrimas. Si viridi
// toros petit de laeta, Amphrysos Siculaeque audit. Inmodicum timuere pendebat
// protinus sciet derantque habent vidisse flammis coctilibus lupum, parabat
// litora? Et nobis, effugiunt. Est avulsa parvae poscere rutilasque, se naris
// populare!

// > Est pronus Anius, Abantiades vestrae conscia _auxiliaribus_ dies prodest,
// > palmis esse incurvae **reducunt**. Tenebant feram creator arcem. Nisi **sed
// > concrevit**, coniuge per? Non aut seque, loci lucum viderat iano Livor femina
// > poenas.

// Adfusique _arcanaque_ tamen ripae dixit ille nepos longum frustra pallor ignes
// quae. Neque sub re, **suis incaluere taurus** erit! Tum antra delubra torvos.
// Sic populus et fessa.

// `

describe('MDAST', () => {
    describe('MD Items', () => {
//         it('should split markdown strings by "\\n\\n"', () => {
//             const markdown = `# Headline

// Here's text.
// And here's some more.

// And here a listing:
// - a
// - b
// + c
// - d

// ---    

//   ### Here's another **headline**!

// Here's some quoted stuff:

// > Blllaasdsssa
// > and antoher blockquote

// And here is a code block:

//             const x = 1
// `

//             const ret = new MDAST(markdown)
//             console.dir(ret.repr(), {depth: null})
//             const expected = {
//                 tag: 'array',
//                 text: [
//                   { tag: 'h1', text: 'Headline' },
//                   {
//                     tag: 'p',
//                     text: "Here's text. And here's some more. And here a listing:"
//                   },
//                   {
//                     tag: 'ulist',
//                     text: [
//                       { tag: 'ul', text: 'a' },
//                       { tag: 'ul', text: 'b' },
//                       { tag: 'ul', text: 'c' },
//                       { tag: 'ul', text: 'd' }
//                     ]
//                   },
//                   { tag: 'hline', text: '' },
//                   { tag: 'h3', text: "Here's another **headline**!" },
//                   { tag: 'p', text: "Here's some quoted stuff:" },
//                   { tag: 'quote', text: 'Blllaasdsssa and antoher blockquote' },
//                   { tag: 'p', text: 'And here is a code block:' },
//                   { tag: 'code', text: 'const x = 1' }
//                 ]
//               }
//             assert.deepEqual(ret.repr(), expected)
//         })
        it('should interpret **w+** as bold', () => {
          const md = 'Here is some **bold text** and here some **more**.'
          const expected = {tag: 'p', text: [
            'Here is some ',
            {tag: 'strong', text: 'bold text'},
            ' and here some ',
            {tag: 'strong', text: 'more'},
            '.'
          ]}
          const repr = new MDAST(md).repr()
          assert.deepEqual(repr, expected)
        })
        it('should interpret __w+__ as italics', () => {
          const md = 'Here is some __italics text__ and here some __more__.'
          const expected = {tag: 'p', text: [
            'Here is some ',
            {tag: 'em', text: 'italics text'},
            ' and here some ',
            {tag: 'em', text: 'more'},
            '.'
          ]}
          const repr = new MDAST(md).repr()
          assert.deepEqual(repr, expected)
        })
        it('should interpret handle nested inline styles', () => {
          const md = 'Here is some **italics __text__** and some more **bold**.'
          const expected = {tag: 'p', text: [
            'Here is some ',
            {tag: 'strong', text: ['italics', {tag: 'em', text: 'text'}]},
            ' and some more ',
            {tag: 'strong', text: 'bold'},
            '.'
          ]}
          const repr = new MDAST(md).repr()
          assert.deepEqual(repr, expected)
        })
        it('should interpret # as h1', () => {
          const md = "# Headline"
          const repr = new MDAST(md).repr()
          const expected = {tag: 'h1', text: 'Headline'}

          assert.deepEqual(repr, expected)
        })
        it('should handle multiline string', () => {
          const md = `# Headline

Here comes the **sun**


Here comes the __moon__.`
          const repr = new MDAST(md).repr()
          console.log(repr)
          const expected = {tag: 'array', text: [
            {tag: 'h1', text: 'Headline'},
            {tag: 'p', text: ['Here comes the ', {tag: 'strong', text: 'sun'}]},
            {tag :'p', text: ['Here comes the ', {tag: 'em', text: 'moon'}, '.']}
          ]}

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
