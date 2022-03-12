import { Component, h, ComponentChild } from 'preact'

export class MDAST {
    public text: string | MDAST | (string | MDAST)[]
    public tag: string | undefined

    private paragraphTerminator = /\n\s*\n/gm
    private lineterminator = /\n/gm
    private lineStartRules = [
        {tag: 'h1', regex: /^\s{0,3}#{1}\s/g, remove: true},
        {tag: 'h2', regex: /^\s{0,3}#{2}\s/g, remove: true},
        {tag: 'h3', regex: /^\s{0,3}#{3}\s/g, remove: true},
        {tag: 'h4', regex: /^\s{0,3}#{4}\s/g, remove: true},
        {tag: 'h5', regex: /^\s{0,3}#{5}\s/g, remove: true},
        {tag: 'h6', regex: /^\s{0,3}#{6}\s/g, remove: true},
        {tag: 'ul', regex: /^\s{0,3}[-|*|+]\s/g, remove: true, block: true},
        {tag: 'ol', regex: /^\s{0,3}\d+\s/g, remove: true, block: true},
        {tag: 'quote', regex: /^\s{0,3}>\s/g, remove: true, block: true},
        {tag: 'code', regex: /^\s{4,}/g, remove: true},
        {tag: 'hline', regex: /^\s{0,3}[-|*|+]{3,}\s{0,}/g, remove: true},
        {tag: 'p', regex: /^\s{0,3}[\w|\s]*/g, remove: false}
    ]
    private lineRules = [
        {tag: 'strong', regex: /\*{2}\w.*?\*{2}/gm},
        {tag: 'em', regex: /_{2}\w.*?_{2}/gm},
    ]

    public constructor(text: string | MDAST | (string | MDAST)[], tag?: string) {
        this.text = text
        if (typeof text === 'string') {
            if (this.paragraphTerminator.test(text)) {
                this.text = new MDAST(text.split(this.paragraphTerminator))
            }
            if (this.lineterminator.test(text)) {
                this.text = new MDAST(text.split(this.lineterminator))
            }
            else {
                const { _text, _tag } = this.processLineStarts(text)
                this.text = this.processInline(_text) || _text
                this.tag = _tag
            }
        } else {
            if (tag === undefined) {
                if (Array.isArray(text)) {
                    // reduce the array and try to assemble nodes into one
                    this.text = text.reduce<MDAST[]>((agg, cur) => {
                    cur = (typeof cur === 'string') ? new MDAST(cur) : cur
                    if (agg.length > 1) {
                        const last = agg.pop()
                        const thing = last?.union(cur)
                        if (thing) agg.push(...thing)
                    } else agg.push(cur)
                    return agg
                    }, [])
                    this.tag = 'array'
                }
            } else {
                this.tag = tag
            }
        }
        this.prune()
    }

    private processInline(text: string): (string | MDAST)[] | undefined {
        // let carry = text
        const _ret = this.lineRules.reduce<(string | MDAST)[]>((agg, rule) => {       
            const _agg: (string | MDAST)[] = []

            agg.forEach((text => {
                if (typeof text === 'string') {
                    if (rule.regex.test(text)) {
                        let carry = text
                        const matches = text.match(rule.regex)
                        if (matches !== null) {
                            matches.forEach(match => {
                                const [before, after] = carry.split(match)
                                const cleaned = match.substring(2, match.length -2)
                                _agg.push(before, new MDAST(cleaned, rule.tag))
                                carry = after
                            })
                        }
                        _agg.push(carry)
                    } else {
                        _agg.push(text)
                    }
                } else {
                    _agg.push(text)
                }
            }))
            return _agg
        }, [text])

        if (_ret.length <= 1) {
            // _ret.push(carry)
            return undefined
        }
        return _ret.filter(e => (e !== undefined))
    }

    private processLineStarts(text: string): {_tag: string | undefined, _text: string} {
        return this.lineStartRules.reduce<{_tag: string | undefined, _text: string} | undefined>((agg, rule) => {
            text = text.trimEnd()
            if (agg === undefined && text.match(rule.regex)) {
                if (rule.tag === 'p') text = text.trimStart()
                return {
                    _text: (rule.remove) ? text.replace(rule.regex, '') : text,
                    _tag: rule.tag
                }}
            else
                return agg
        }, undefined) || {_text: text, _tag: undefined}
    }

    public prune(): void {
        if (this.text instanceof MDAST) {
            const other = this.text
            other.prune()
            this.text = other.text
            this.tag = other.tag
        }
    }

    public union(other: MDAST): MDAST[] {
        if (this.tag === 'ul' && other.tag == 'ul') {
            return [new MDAST([this, other], 'ulist')]
        } else if (this.tag === 'p' && other.tag === 'p' ) {
            if (Array.isArray(this.text)) {
                if (Array.isArray(other.text)) this.text = [...this.text, ...other.text]
                else this.text = [...this.text, other.text]
            } else {
                if (Array.isArray(other.text)) this.text = [this.text, ...other.text]
                else this.text = [this.text, other.text]
            }

            this.text = this.text.filter(e => e !== '')

            return [this]
        } else if (this.tag === 'ulist' && other.tag == 'ul') {
            if (Array.isArray(this.text)) {
                this.text.push(other)
            }
            return [this]
        } else if (other.tag === undefined) {
            return [this]
        } else if (this.tag === undefined) {
            return [other]
        }

        return [this, other]
    }

    public toString(): string {
        console.log('MarkdownAST coerced to string')
        if (Array.isArray(this.text)) return this.text.map(e => (
            (typeof e === 'string') ? e : e.toString()
        )).join(' ')
        else if (typeof this.text === 'string') return `'${this.tag}': {${this.text}}\n`
        else return this.text.toString()
    }

    public repr() : unknown{
        return {
            tag: this.tag,
            text: (typeof this.text === 'string') ? 
                this.text : (Array.isArray(this.text)) ? 
                    this.text.map(e => (typeof e === 'string') ? e : e.repr()) : this.text.repr()
        }
    }

    public map<T>(callback: (text: string | (string | T)[], tag?: string) => T) : T {
        if (Array.isArray(this.text)) {
            return callback(this.text.map(e => (typeof e === 'string') ? e : e.map(callback)), this.tag)
        } else if (typeof this.text === 'string') {
            return callback(this.text, this.tag)
        } else return this.text.map(callback)
    }
}

export interface Mapper {
    tag: string,
    newtag: string
}

export interface MarkdownProps {
    markdown: string
}

export class Markdown extends Component<MarkdownProps> {

    public render({ markdown }: MarkdownProps) : ComponentChild {
        const ast = new MDAST(markdown)
        console.log('Markdown AST:', ast.repr())

        return ast.map((text, tag) => h(tag || 'p', {children: text}))
    }
}
