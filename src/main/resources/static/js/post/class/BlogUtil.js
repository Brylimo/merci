/*
* BlogUtil class uses LineObj class in a number of places
* gotta import LineObj js class first
* */
document.write('<script src="/js/post/class/LineObj.js"></script>');

class BlogUtil {
    /* the wrapper div of main textarea
    * you gotta initialize it to properly use this utility class
    * jquery type html element form is needed
    * */
    static $txtareaWrapper = null;

    /* the span tag of draft span
    * you need this when you get a width of added or deleted letter
    * you gotta initialize it to properly use this utility class
    * jquery type html element form is needed
    * */
    static $draftSpan = null;

    /* the current targeting pre tag
    * you gotta initialize it to properly use this utility class
    * jquery type html element form is needed
    * */
    static $targetPre = null;

    /* the html element corresponds to cursor
    * you gotta initialize it to properly use this utility class
    * jquery type html element form is needed
    * */
    static $cursor = null;

    static timers = [];
    static lineList = []; // list that remembers width of the each line
    static isActive = false;
    static isCodeTypeChanged = 0; // default = 0, ascii = 1, unicode = 2, ascii -> unicode = 3, unicode -> ascii = 4

    // index
    static Index = {
        cursor: 0, // cursor index
        text: 0, // text index
        origin: 0, // origin index
        line: 0 // line index
    }

    /*
    * initialize function
    * */
    static init($txtareaWrapper, $draftSpan, $targetPre, $cursor) {
        this.setTxtareaWrapper($txtareaWrapper);
        this.setDraftSpan($draftSpan);
        this.setTargetPre($targetPre);
        this.setCursor($cursor)
    }

    /*
    * setter function of $txtareaWrapper
    * */
    static setTxtareaWrapper($txtareaWrapper) {
        this.$txtareaWrapper = $txtareaWrapper;
    }

    /*
    * setter function of $draftSpan
    * */
    static setDraftSpan($draftSpan) {
        this.$draftSpan = $draftSpan;
    }

    /*
    * setter function of $targetPre
    * */
    static setTargetPre($targetPre) {
        this.$targetPre = $targetPre;
    }

    /*
    * setter function of $cursor
    * */
    static setCursor($cursor) {
        this.$cursor = $cursor;
    }

    static timerFn() {
        const target = $(".wp .cursors");

        if (target.hasClass("cursor-visible")) {
            target.removeClass("cursor-visible");
        } else {
            target.addClass("cursor-visible");
        }
    }

    static timerPlayer() {
        let timerId = setTimeout(() => {
            BlogUtil.timerFn();

            BlogUtil.timers.splice(0);
            BlogUtil.timerPlayer();
        }, 450)

        BlogUtil.timers.push(timerId);
    }

    static clearTimerPlayer() {
        for (let i = 0; i < BlogUtil.timers.length; i++) {
            clearTimeout(BlogUtil.timers[i]);
        }
    }

    static containsKorean(inputString) {
        const koreanRegex = /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7A3]+/;
        return koreanRegex.test(inputString);
    }

    static letterWidthConverter(targetChar) {
        const $targetSpan = this.$targetPre.find("span").first();

        // sync font-size
        const fontSize = $targetSpan.css("font-size");
        this.$draftSpan.css("font-size", fontSize);

        if (!targetChar || targetChar === ' ') {
            // default behavior is returning a single space width('&nbsp;')
            this.$draftSpan.html('&nbsp;')
        } else {
            this.$draftSpan.text(targetChar);
        }
        const width = this.$draftSpan[0].getBoundingClientRect().width;
        this.$draftSpan.text('');

        return width;
    }

    static chainedLineOverflowHandler(lineIdx) {
        const coreWidth = this.$txtareaWrapper.parent()[0].getBoundingClientRect().width;
        const $targetSpan = this.$targetPre.find("span");
        const index = lineIdx;

        if (this.lineList[index].width > coreWidth) {
            // it means the current line overflows.. but the cursor isn't at the last letter of the line
            const lastChar = $targetSpan.text()[this.lineList[index].firstIdx + this.lineList[index].count];
            const letterWidth = this.letterWidthConverter(lastChar);

            this.lineList[index].width -= letterWidth;
            this.lineList[index].count -= 1;

            if (lastChar !== ' ') {
                if (!this.lineList[index + 1]) { // when new line is needed
                    this.lineList.push(new LineObj(letterWidth, this.lineList[index].firstIdx + this.lineList[index].count, 1));
                    return; /* exit condition */
                }

                this.lineList[index + 1].firstIdx--;
                this.lineList[index + 1].count += 1;
                this.lineList[index + 1].width += letterWidth;
            }
            this.lineList[index].status = "settle";

            this.chainedLineOverflowHandler(index + 1);
        } else {
            /* exit condition */
            this.lineList[index].status = "unsettle";
            return;
        }
    }

    /*
    * recursively reflects the letter deleting along the line
    * */
    static chainedLineDeletingLetterHandler(lineIdx) {
        const coreWidth = this.$txtareaWrapper.parent()[0].getBoundingClientRect().width;
        const $targetSpan = this.$targetPre.find("span");

        if (this.lineList[lineIdx].status === "unsettle") {
            for (let i = lineIdx + 1; i < this.lineList.length; i++) {
                this.lineList[i].firstIdx--;
            }

            if (this.lineList[lineIdx - 1] && this.lineList[lineIdx - 1].status === "unsettle") { // check previous line
                const firstIdx = this.lineList[lineIdx].firstIdx;
                let lastIdx = this.lineList[lineIdx].firstIdx + this.lineList[lineIdx].count;
                if (this.lineList[lineIdx].count !== 1 && this.containsKorean($targetSpan.text()[firstIdx])) {
                    for (let i = firstIdx + 1; i < firstIdx + this.lineList[lineIdx].count; i++) {
                        if (this.containsKorean($targetSpan.text()[i])) {
                            lastIdx = i;
                            break;
                        }
                    }
                } else {
                    for (let i = firstIdx; i < firstIdx + this.lineList[lineIdx].count; i++) {
                        if (this.containsKorean($targetSpan.text()[i])) {
                            lastIdx = i;
                            break;
                        }
                    }
                }

                const text = $targetSpan.text().slice(firstIdx, lastIdx);
                const textWidth = this.letterWidthConverter(text);

                if (this.lineList[lineIdx - 1].width + textWidth < coreWidth) {
                    const lineHeight = parseFloat(this.$targetPre.css("line-height"));
                    const topValue = parseFloat(this.$cursor.css("top")) - lineHeight;

                    this.lineList[lineIdx - 1].count += lastIdx - firstIdx;
                    this.lineList[lineIdx].count -= lastIdx - firstIdx;

                    if (this.lineList[lineIdx].count === 0) { // the line's gone
                        const before = this.lineList.slice(0, this.Index["line"]);
                        const after = this.lineList.slice(this.Index["line"]+1);
                        const mergedList = before.concat(after);

                        this.lineList = mergedList;

                        this.$cursor.css("left", parseFloat(this.$cursor.css("left")) + this.lineList[lineIdx - 1].width + "px"); this.$cursor.css("top", topValue + "px");
                        this.$txtareaWrapper.css("left", parseFloat(this.$cursor.css("left")) + this.lineList[lineIdx - 1].width + "px"); this.$txtareaWrapper.css("top", topValue + "px");

                        this.Index["line"]--;
                    } else {
                        this.lineList[lineIdx].width -= textWidth;
                        this.lineList[lineIdx].firstIdx += lastIdx - firstIdx;

                        if (lastIdx > this.Index["cursor"]) {
                            this.$cursor.css("left", parseFloat(this.$cursor.css("left")) + this.lineList[lineIdx - 1].width + "px"); this.$cursor.css("top", topValue + "px");
                            this.$txtareaWrapper.css("left", parseFloat(this.$txtareaWrapper.css("left")) + this.lineList[lineIdx - 1].width + "px"); this.$txtareaWrapper.css("top", topValue + "px");

                            this.Index["line"]--;
                        }
                    }

                    this.lineList[lineIdx - 1].width += textWidth;
                    this.lineList[lineIdx - 1].status = "settle";
                }
            }

            if (this.lineList[lineIdx + 1]) { // check if next line exists, O -> code Four
                const firstIdx = this.lineList[lineIdx + 1].firstIdx;
                let lastIdx = this.lineList[lineIdx + 1].firstIdx + this.lineList[lineIdx + 1].count;
                console.log("ttt", this.lineList[lineIdx + 1].count, firstIdx, lastIdx)
                if (this.lineList[lineIdx + 1].count !== 1 && this.containsKorean($targetSpan.text()[firstIdx])) {
                    for (let i = firstIdx + 1; i < firstIdx + this.lineList[lineIdx + 1].count; i++) {
                        if (this.containsKorean($targetSpan.text()[i])) {
                            lastIdx = i;
                            break;
                        }
                    }
                } else {
                    for (let i = firstIdx; i < firstIdx + this.lineList[lineIdx + 1].count; i++) {
                        if (this.containsKorean($targetSpan.text()[i])) {
                            lastIdx = i;
                            break;
                        }
                    }
                }

                const text = $targetSpan.text().slice(firstIdx, lastIdx);
                const textWidth = this.letterWidthConverter(text);

                if (this.lineList[lineIdx].width + textWidth < coreWidth) {
                    this.lineList[lineIdx].width += textWidth;
                    this.lineList[lineIdx].count += lastIdx - firstIdx;
                    this.lineList[lineIdx].status = "settle";

                    this.lineList[lineIdx + 1].count -= lastIdx - firstIdx;
                    if (this.lineList[lineIdx + 1].count === 0) {
                        const before = this.lineList.slice(0, this.Index["line"]+1);
                        const after = this.lineList.slice(this.Index["line"]+2);
                        const mergedList = before.concat(after);

                        this.lineList = mergedList;
                    } else {
                        this.lineList[lineIdx + 1].width -= textWidth;
                        this.lineList[lineIdx + 1].firstIdx += lastIdx - firstIdx;
                    }
                }
            }
        } else if (this.lineList[lineIdx].status === "settle") {
            if (this.lineList[lineIdx + 1]) { // check if next line exists
                // todo 마마마마......................바바바바바바
                const firstChar = $targetSpan.text()[this.lineList[lineIdx + 1].firstIdx];
                const firstLetterWidth = this.letterWidthConverter(firstChar);

                console.log("man", this.lineList[lineIdx].width + firstLetterWidth, coreWidth)
                if (this.lineList[lineIdx].width + firstLetterWidth < coreWidth) {
                    // normal case (settle)
                    this.lineList[lineIdx].width += firstLetterWidth;
                    this.lineList[lineIdx].count += 1;

                    /* subtract width value first */
                    this.lineList[lineIdx + 1].width -= firstLetterWidth;
                    this.lineList[lineIdx + 1].count -= 1;

                    if (this.lineList[lineIdx + 1].count === 0) {
                        /* if the count hits zero, we delete the LineObj object*/
                        const before = this.lineList.slice(0, this.Index["line"]+1);
                        const after = this.lineList.slice(this.Index["line"]+2);
                        const mergedList = before.concat(after);

                        this.lineList = mergedList;
                        return;
                    }

                    this.chainedLineDeletingLetterHandler(lineIdx + 1);
                } else {
                    this.lineList[lineIdx + 1].firstIdx--;
                }
            } else {
                this.lineList[lineIdx].status = "unsettle";
            }
        }

       return;
    }

    static moveCursorOneStepHorizontally(kind, targetChar, width) {
        const coreWidth = this.$txtareaWrapper.parent()[0].getBoundingClientRect().width;
        const leftValue = parseFloat(this.$cursor.css("left")) + width;

        if ((kind === "arrowRight" && this.lineList[this.Index["line"]].width + 1 < leftValue) ||
            (kind === "add" && coreWidth < leftValue)) { // move to new line, +1 means allowable error
            const lineHeight = parseFloat(this.$targetPre.css("line-height"));
            const topValue = parseFloat(this.$cursor.css("top")) + lineHeight;
            const $targetSpan = this.$targetPre.find("span");
            let normalCasePass = false;

            const LineFirstIdx = this.lineList[this.Index["line"]].firstIdx;
            const LineLastIdx = this.lineList[this.Index["line"]].firstIdx + this.lineList[this.Index["line"]].count;
            if (kind === "add" && !this.containsKorean(targetChar)) {
                // special case
                const selectedText = $targetSpan.text().slice(0, LineLastIdx + 1);
                let firstIdx = LineLastIdx;
                let spaceCnt = 0;
                let initialValue = 0;
                let cnt = 0;

                for (let i = LineLastIdx; i>= LineFirstIdx; i--) {
                    const char = selectedText[i];
                    if (this.containsKorean(char) || char === ' ') { // space acts like a korean alphabet here
                        if (char !== ' ' && (selectedText[i+1] == '.' || selectedText[i+1] == ',' || selectedText[i+1] == '!' ||
                                            selectedText[i+1] == "'" || selectedText[i+1] == '"' || selectedText[i+1] == '/' ||
                                            selectedText[i+1] == '?' || selectedText[i+1] == ')' || selectedText[i+1] == '(')) {

                            if (i === this.lineList[this.Index["line"]].firstIdx) {
                                // special case, same as else case code eg.) 나............. & new line
                                normalCasePass = true;
                            } else {
                                let innerWidth = this.letterWidthConverter(char);
                                initialValue = innerWidth;
                                cnt++;
                            }
                        } else {
                            firstIdx += 1;
                        }
                        break;
                    } else {
                        spaceCnt++;
                    }
                }

                if (spaceCnt === this.lineList[this.Index["line"]].count + 1) {
                    normalCasePass = true;
                }

                if (!normalCasePass) {
                    this.lineList[this.Index["line"]].width = parseFloat(this.$cursor.css("left")) - initialValue - (width * (spaceCnt - 1));
                    this.lineList[this.Index["line"]].count -= (cnt + spaceCnt - 1);

                    this.$cursor.css("left", (initialValue + width * spaceCnt) + "px"); this.$cursor.css("top", topValue + "px");
                    this.$txtareaWrapper.css("left", (initialValue + width * spaceCnt) + "px"); this.$txtareaWrapper.css("top", topValue + "px");

                    for (let i = this.Index["line"] + 1; i < this.lineList.length; i++) {
                        this.lineList[i].firstIdx++;
                    }

                    this.Index["line"]++;
                    this.lineList.splice(this.Index["line"], 0, new LineObj(initialValue + width * spaceCnt, firstIdx - spaceCnt, cnt + spaceCnt));
                }

                this.lineList[this.Index["line"]].status = "unsettle";
            }

            if (!(kind === "add" && !this.containsKorean($targetSpan.text()[LineLastIdx])) || normalCasePass) {
                // normal case
                if (kind === "add") {
                    this.lineList[this.Index["line"]].width = parseFloat(this.$cursor.css("left"));
                }

                this.$cursor.css("left", width + "px"); this.$cursor.css("top", topValue + "px");
                this.$txtareaWrapper.css("left", width + "px"); this.$txtareaWrapper.css("top", topValue + "px");
                this.lineList[this.Index["line"]].status = "settle";

                this.Index["line"]++;
                if (kind === "add" && this.lineList.length === this.Index["line"]) {
                    this.lineList.splice(this.Index["line"], 0, new LineObj(width, this.Index["cursor"], 1));
                }
            }
        } else if (leftValue <= 0) { // delete current line & go to previous line
            if ((kind === "backspace" && this.Index["line"] === 0) || (kind === "arrowLeft" && parseFloat(this.$cursor.css("left")) > 1)) { // originally zero but 1 is an allowable error
                this.$cursor.css("left", leftValue + "px");
                this.$txtareaWrapper.css("left", leftValue + "px");
                BlogUtil.Index["cursor"]--;

                if (kind === "backspace") {
                    this.lineList[0].count--;

                    if (this.lineList[0].count === 0) {
                        const before = this.lineList.slice(0, this.Index["line"]);
                        const after = this.lineList.slice(this.Index["line"]+1);
                        const mergedList = before.concat(after);

                        this.lineList = mergedList;
                    }
                }
                return;
            }

            const lineHeight = parseFloat(this.$targetPre.css("line-height"));
            const topValue = parseFloat(this.$cursor.css("top")) - lineHeight;

            if (kind === "backspace") {
                this.$cursor.css("left", this.lineList[this.Index["line"] - 1].width + "px"); this.$cursor.css("top", topValue + "px");
                this.$txtareaWrapper.css("left", this.lineList[this.Index["line"] - 1].width + "px"); this.$txtareaWrapper.css("top", topValue + "px");

                this.lineList[this.Index["line"]].count--;

                if (this.lineList[this.Index["line"]].count === 0) {
                    const before = this.lineList.slice(0, this.Index["line"]);
                    const after = this.lineList.slice(this.Index["line"]+1);
                    const mergedList = before.concat(after);

                    this.lineList = mergedList;
                }

                this.Index["line"]--;
            } else if (kind === "arrowLeft") {
                this.$cursor.css("left", this.lineList[this.Index["line"] - 1].width + width + "px"); this.$cursor.css("top", topValue + "px");
                this.$txtareaWrapper.css("left", this.lineList[this.Index["line"] - 1].width + width + "px"); this.$txtareaWrapper.css("top", topValue + "px");
                this.Index["line"]--;
            }
        } else { // normal case
            this.$cursor.css("left", leftValue + "px");
            this.$txtareaWrapper.css("left", leftValue + "px");
            if (kind === "add" && this.lineList.length == 0) {
                // type first letter
                this.lineList[this.Index["line"]] = new LineObj(0, this.Index["cursor"]);
            }

            if (kind === "add" || kind === "backspace") {
                this.lineList[this.Index["line"]].width += width;

                if (this.lineList[this.Index["line"]].width <= 0) {
                    this.lineList[this.Index["line"]].width = 0;
                }

                if (width > 0) {
                    this.chainedLineOverflowHandler(this.Index["line"]);
                    this.lineList[this.Index["line"]].count++;
                    for (let i = this.Index["line"] + 1; i < this.lineList.length; i++) {
                        this.lineList[i].firstIdx++;
                    }
                } else if (width < 0) {
                    this.lineList[this.Index["line"]].count--;
                    this.chainedLineDeletingLetterHandler(this.Index["line"]);
                }
            }
        }

        if (width > 0) {
            BlogUtil.Index["cursor"]++;
        } else if (width < 0) {
            BlogUtil.Index["cursor"]--;
        }

        if (BlogUtil.Index["cursor"] - BlogUtil.Index["origin"] - BlogUtil.Index["text"] === 2) {
            BlogUtil.Index["text"]++;
        }
    }

    static moveCursorOneStepVertically(kind, $targetPre, $cursor, $wpWrapper, width) {
        const lineHeight = parseFloat($targetPre.css("line-height"));
        const topValue = parseFloat($cursor.css("top")) - lineHeight;

        $cursor.css("top", topValue + "px");
        $wpWrapper.css("top", topValue + "px");
    }
}