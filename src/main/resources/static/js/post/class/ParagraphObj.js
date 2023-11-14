class ParagraphObj {
    constructor($pre) {
        this.$targetPre = $pre

        // guess all unicode letters have same width and all ascii letters have same width
        this.letterWidth = {
            unicode: 0,
            ascii: 0
        }

        // index
        this.Index = {
            cursor: 0, // cursor index
            text: 0, // text index
            origin: 0, // origin index
            line: 0 // line index
        }

        this.lineList = []
    }
}