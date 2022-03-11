import { Component, h } from 'preact'

export class MDAST {
    // @ts-ignore
    public text: string | MDAST | MDAST[]
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
        {tag: 'ul', regex: /^\s{0,3}[-|\*|\+]\s/g, remove: true, block: true},
        {tag: 'ol', regex: /^\s{0,3}\d+\s/g, remove: true, block: true},
        {tag: 'quote', regex: /^\s{0,3}\>\s/g, remove: true, block: true},
        {tag: 'code', regex: /^\s{4,}/g, remove: true},
        {tag: 'hline', regex: /^\s{0,3}[-|\*»\+|\s*]{3,}\s{0,}/g, remove: true},
        {tag: 'p', regex: /^\w+/g, remove: false}
    ]
    private lineRules = [
        {tag: 'bold', regex: /\*{2}.*\*{2}/},
        {tag: 'ital', regex: /\_{2}.*\_{2}/},
    ]

    public constructor(text: string | MDAST | (string | MDAST)[], tag?: string) {
        if (tag === undefined) {
            if (typeof text === 'string') {
                if (this.paragraphTerminator.test(text)) {
                    this.text = new MDAST(text.split(this.paragraphTerminator))
                }
                if (this.lineterminator.test(text)) {
                    this.text = new MDAST(text.split(this.lineterminator))
                }
                else {
                    const { _text, _tag } = this.processLineStarts(text)
                    this.text = _text
                    this.tag = _tag
                }
            } else if (Array.isArray(text)) {
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
            this.text = text as string
            this.tag = tag
        }
        this.prune()
    }

    private processLineStarts(text: string): {_tag: string | undefined, _text: string} {
        return this.lineStartRules.reduce<{_tag: string | undefined, _text: string} | undefined>((agg, rule) => {
            if (agg === undefined && text.match(rule.regex))
                return {
                    _text: (rule.remove) ? text.replace(rule.regex, '') : text,
                    _tag: rule.tag
                }
            else
                return agg
        }, undefined) || {_text: text, _tag: undefined}
    }

    public prune() {
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
        } else if (this.tag === other.tag) {
            this.text = [this.text, other.text].join(' ')
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
        if (Array.isArray(this.text)) return this.text.map(e => (
            (typeof e === 'string') ? e : e.toString()
        )).join(' ')
        else if (typeof this.text === 'string') return `'${this.tag}': {${this.text}}\n`
        else return this.text.toString()
    }

    public repr() : any{
        return {
            tag: this.tag,
            text: (typeof this.text === 'string') ? 
                this.text : (Array.isArray(this.text)) ? 
                    this.text.map(e => e.repr()) : this.text.repr()
        }
    }

    public map(callback: (text: string, tag?: string) => any) : any {
        if (Array.isArray(this.text)) {
            return this.text.map(e => e.map(callback))
        } else if (typeof this.text === 'string') {
            return callback(this.text, this.tag)
        } else return this.text.map(callback)
    }
}

export interface Mapper {
    tag: string,
    newtag: string
}

export function translate(ast: MDAST, mapper: Mapper[]) {

}

export interface MarkdownProps {
    markdown: string
}

export class Markdown extends Component<MarkdownProps> {

    public render({ markdown }: MarkdownProps) {
        const ast = new MDAST(markdown)

        return ast.map((text, tag) => h(tag!, {children: text}))
    }
}
