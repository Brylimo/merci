/*
* PostUtil class uses LineObj class and ParagraphObj class in many places
* gotta import LineObj, ParaGraphObj js class first
* */
document.write('<script src="/js/post/class/ParagraphObj.js"></script>');
document.write('<script src="/js/post/class/LineObj.js"></script>');
// todo 띄어쓰기 처리 개발 요망

class PostUtil {
    /*
    * root object of blog, only one root object is needed
    * */
    static root = {
        paragraphList: []
    }

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
    static lineList = []; // list that remembers width of the each line, 삭제 요망
    static isActive = false;

    // index 삭제 요망
    static Index = {
        cursor: 0, // cursor index
        text: 0, // text index
        origin: 0, // origin index
        line: 0 // line index
    }

    static Flag = {
        paste: false // ctrl + v flag
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

    /*
    * inspect if the input parameter is unicode or not
    * */
    static isUnicode(char) {
        return char !== undefined && char.length === 1 && char !== char.normalize('NFC');
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
            PostUtil.timerFn();

            PostUtil.timers.splice(0);
            PostUtil.timerPlayer();
        }, 450)

        PostUtil.timers.push(timerId);
    }

    static clearTimerPlayer() {
        for (let i = 0; i < PostUtil.timers.length; i++) {
            clearTimeout(PostUtil.timers[i]);
        }
    }

    static containsKorean(inputString) {
        const koreanRegex = /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7A3]+/;
        return koreanRegex.test(inputString);
    }

    static findOptimalWidthIdx(text, orgWidth, last, normWidth) {
        const norm = normWidth || normWidth === 0  ? normWidth : this.$txtareaWrapper.parent()[0].getBoundingClientRect().width;

        let start = 0;
        let end = last;
        let min = Infinity;
        let ans = 0;

        while (start <= end) {
            const mid = Math.floor((start + end) / 2);

            const tempString = text.slice(0, mid);
            const width = this.letterWidthConverter(tempString);

            if (Math.abs(orgWidth + width - norm) < min) {
                min = Math.abs(orgWidth + width - norm);
                ans = mid;
            }

            if  (orgWidth + width < norm) {
                start = mid + 1;
            } else {
                end = mid - 1;
            }
        }

        return ans;
    }

    static findOptimalLineIdx(lineHeight, target) {
        let start = 0;
        let end = this.lineList.length - 1;
        let min = Infinity;
        let ans = 0;

        while (start <= end) {
            const mid = Math.floor((start + end) / 2);

            if (Math.abs(lineHeight * mid - target) < min) {
                min = Math.abs(lineHeight * mid - target);
                ans = mid;
            }

            if  (lineHeight * mid < target) {
                start = mid + 1;
            } else {
                end = mid - 1;
            }
        }

        return ans;
    }

    static letterWidthConverter(targetChar) {
        if (!targetChar) return 0;

        const $targetSpan = this.$targetPre.find("span").first();

        // sync font-size
        const fontSize = $targetSpan.css("font-size");
        this.$draftSpan.css("font-size", fontSize);

        if (targetChar === ' ') {
            // default behavior is returning a single space width('&nbsp;')
            this.$draftSpan.html('&nbsp;')
        } else {
            this.$draftSpan.text(targetChar);
        }
        const width = this.$draftSpan[0].getBoundingClientRect().width;
        this.$draftSpan.text('');

        return width;
    }

    static pasteHandler() {
        // todo 복사하는데 시간이 걸리므로 dom 속성 변화 값을 감지해서 크기 값을 단일화하는 과정이 필요할거같음
        const $textarea = PostUtil.$txtareaWrapper.find("textarea").first();
        const $targetSpan = PostUtil.$targetPre.find("span").first();
        const textareaTxt = $textarea.val()

        let lines = textareaTxt.split('\n');

        // only line 0
        const line = lines[0];
        const chunkSize = 30
        let textWidth = 0;

        for (let i = 0; i < line.length; i += chunkSize) {
            const lineTxt = line.slice(i, i + chunkSize)
            textWidth += this.letterWidthConverter(lineTxt);
        }

        $targetSpan.text($targetSpan.text().slice(0, PostUtil.Index["cursor"]) + lines[0] + $targetSpan.text().slice(PostUtil.Index["cursor"]));
        this.lineList[this.Index["line"]].width += textWidth;
        this.lineList[this.Index["line"]].count += lines[0].length;

        this.chainedLineOverflowHandler(this.Index["line"])
    }

    static chainedLineOverflowHandler(lineIdx) {
        const coreWidth = this.$txtareaWrapper.parent()[0].getBoundingClientRect().width;
        const $targetSpan = this.$targetPre.find("span");
        const index = lineIdx;

        if (this.lineList[index].width > coreWidth) {
            // it means the current line overflows.. but the cursor isn't at the last letter of the line
            while (this.lineList[index].width > coreWidth) {
                const lastChar = $targetSpan.text()[this.lineList[index].firstIdx + this.lineList[index].count - 1];
                const letterWidth = this.letterWidthConverter(lastChar);

                this.lineList[index].width -= letterWidth;
                this.lineList[index].count -= 1;

                if (lastChar !== ' ') {
                    if (!this.lineList[index + 1]) { // when new line is needed
                        this.lineList.push(new LineObj(letterWidth, this.lineList[index].firstIdx + this.lineList[index].count, 1));
                    } else {
                        this.lineList[index + 1].firstIdx--;
                        this.lineList[index + 1].count += 1;
                        this.lineList[index + 1].width += letterWidth;
                    }
                }
            }
            this.lineList[index].status = "settle";

            this.chainedLineOverflowHandler(index + 1);
        } else {
            /* exit condition */
            this.lineList[index].status = "unsettle";
            return;
        }
    }

    static chainedLineDeletingLetterBottomUpHandler(lineIdx) {
        const coreWidth = this.$txtareaWrapper.parent()[0].getBoundingClientRect().width;
        const $targetSpan = this.$targetPre.find("span");

        // bottom-up
        if (this.lineList[lineIdx - 1] && this.lineList[lineIdx - 1].status === "unsettle") { // check previous line
            const status = this.lineList[lineIdx].status;
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

                if (this.lineList[lineIdx].count === 0)     { // the line's gone and it ends there
                    const before = this.lineList.slice(0, this.Index["line"]);
                    const after = this.lineList.slice(this.Index["line"]+1);
                    const mergedList = before.concat(after);

                    this.lineList = mergedList;

                    this.$cursor.css("left", parseFloat(this.$cursor.css("left")) + this.lineList[lineIdx - 1].width + "px"); this.$cursor.css("top", topValue + "px");
                    this.$txtareaWrapper.css("left", parseFloat(this.$txtareaWrapper.css("left")) + this.lineList[lineIdx - 1].width + "px"); this.$txtareaWrapper.css("top", topValue + "px");

                    this.Index["line"]--;
                } else { // line's been preserved, it doesn't end
                    this.lineList[lineIdx].width -= textWidth;
                    this.lineList[lineIdx].firstIdx += lastIdx - firstIdx;

                    this.$cursor.css("left", parseFloat(this.$cursor.css("left")) + this.lineList[lineIdx - 1].width + "px"); this.$cursor.css("top", topValue + "px");
                    this.$txtareaWrapper.css("left", parseFloat(this.$txtareaWrapper.css("left")) + this.lineList[lineIdx - 1].width + "px"); this.$txtareaWrapper.css("top", topValue + "px");

                    this.Index["line"]--;
                }

                this.lineList[lineIdx - 1].width += textWidth;
                this.lineList[lineIdx - 1].status = "settle";

                if (status === "unsettle") {
                    for (let i = lineIdx + 1; i < this.lineList.length; i++) {
                        this.lineList[i].firstIdx--;
                    }
                } else { // status === "settle"
                    this.lineList[lineIdx + 1].firstIdx = this.lineList[lineIdx].firstIdx + this.lineList[lineIdx].count;
                    console.log(lineIdx + 1)
                    console.log("org", this.lineList[lineIdx + 1].count);
                    return "02"; // executes recovery function
                }
                return "01"; // don't execute anything
            }
        }
        return "00" // executes chainedLineDeletingLetterTopDownHandler
    }

    /*
    * recursively reflects the letter deleting along the line
    * */
    static chainedLineDeletingLetterTopDownHandler(lineIdx) {
        const coreWidth = this.$txtareaWrapper.parent()[0].getBoundingClientRect().width;
        const $targetSpan = this.$targetPre.find("span");

        // top-down
        if (this.lineList[lineIdx]) {
            if (this.lineList[lineIdx].status === "unsettle") {
                for (let i = lineIdx + 1; i < this.lineList.length; i++) {
                    this.lineList[i].firstIdx--;
                }

                if (this.lineList[lineIdx + 1]) { // check if next line exists, O -> code Four
                    const firstIdx = this.lineList[lineIdx + 1].firstIdx;
                    let lastIdx = this.lineList[lineIdx + 1].firstIdx + this.lineList[lineIdx + 1].count;
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
                            const before = this.lineList.slice(0, lineIdx+1);
                            const after = this.lineList.slice(lineIdx+2);
                            const mergedList = before.concat(after);

                            this.lineList = mergedList;
                        } else {
                            this.lineList[lineIdx + 1].width -= textWidth;
                            this.lineList[lineIdx + 1].firstIdx += lastIdx - firstIdx;
                            this.recoveryChainedLineHandler(lineIdx + 1);
                        }
                    }
                }
            } else if (this.lineList[lineIdx].status === "settle") {
                if (this.lineList[lineIdx + 1]) { // check if next line exists
                    const firstChar = $targetSpan.text()[this.lineList[lineIdx + 1].firstIdx - 1]; // it's invoked after the targetSpan has changed
                    const firstLetterWidth = this.letterWidthConverter(firstChar);

                    if (this.lineList[lineIdx].width + firstLetterWidth < coreWidth) {
                        // normal case (settle)
                        this.lineList[lineIdx].width += firstLetterWidth;
                        this.lineList[lineIdx].count += 1;

                        /* subtract width value first */
                        this.lineList[lineIdx + 1].width -= firstLetterWidth;
                        this.lineList[lineIdx + 1].count -= 1;

                        if (this.lineList[lineIdx + 1].count === 0) {
                            /* if the count hits zero, we delete the LineObj object*/
                            const before = this.lineList.slice(0, lineIdx+1);
                            const after = this.lineList.slice(lineIdx+2);
                            const mergedList = before.concat(after);

                            this.lineList = mergedList;
                            return;
                        }

                        this.chainedLineDeletingLetterTopDownHandler(lineIdx + 1);
                    } else {
                        this.lineList[lineIdx + 1].firstIdx--;
                    }
                } else {
                    this.lineList[lineIdx].status = "unsettle";
                }
            }
        }

       return;
    }

    static recoveryChainedLineHandler(lineIdx) {
        if (this.lineList[lineIdx + 1]) {
            const $targetSpan = this.$targetPre.find("span");
            const orgWidth = this.lineList[lineIdx].width;

            const nxtFirstIdx = this.lineList[lineIdx + 1].firstIdx;
            const nxtLastIdx = this.lineList[lineIdx + 1].firstIdx + this.lineList[lineIdx + 1].count;
            const nxtText = $targetSpan.text().slice(nxtFirstIdx, nxtLastIdx + 1);

            const optimalIdx = this.findOptimalWidthIdx(nxtText, orgWidth, nxtText.length - 1)
            const optimalWidth = this.letterWidthConverter(nxtText.slice(0, optimalIdx + 1));

            this.lineList[lineIdx].width += optimalWidth;
            this.lineList[lineIdx].count += optimalIdx + 1;

            this.lineList[lineIdx + 1].width -= optimalWidth;
            this.lineList[lineIdx + 1].count -= optimalIdx + 1;

            if (!this.lineList[lineIdx + 1].count) {
                const before = this.lineList.slice(0, lineIdx + 1);
                const after = this.lineList.slice(lineIdx + 2);
                const mergedList = before.concat(after);

                this.lineList = mergedList;
                return;
            }

            if (this.lineList[lineIdx + 1].status === "unsettle") { return; }

            this.recoveryChainedLineHandler(lineIdx + 1);
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
                    this.lineList[this.Index["line"]].width += width;
                    this.chainedLineOverflowHandler(this.Index["line"]);
                    this.lineList[this.Index["line"]].count++;
                    for (let i = this.Index["line"] + 1; i < this.lineList.length; i++) {
                        this.lineList[i].firstIdx++;
                    }
                }

                this.$cursor.css("left", width + "px"); this.$cursor.css("top", topValue + "px");
                this.$txtareaWrapper.css("left", width + "px"); this.$txtareaWrapper.css("top", topValue + "px");
                this.lineList[this.Index["line"]].status = "settle";

                this.Index["line"]++;
            }
        } else if (leftValue <= 0) { // delete current line & go to previous line
            if ((kind === "backspace" && this.Index["line"] === 0) || (kind === "arrowLeft" && parseFloat(this.$cursor.css("left")) > 1)) { // originally zero but 1 is an allowable error
                this.$cursor.css("left", leftValue + "px");
                this.$txtareaWrapper.css("left", leftValue + "px");
                PostUtil.Index["cursor"]--;

                if (kind === "backspace") {
                    this.lineList[0].count--;

                    if (this.lineList[0].count === 0) {
                        const before = this.lineList.slice(0, this.Index["line"]);
                        const after = this.lineList.slice(this.Index["line"]+1);
                        const mergedList = before.concat(after);

                        this.lineList = mergedList;

                        if (this.lineList.length === 0) {
                            /*
                            * textarea's empty
                            * */
                            const $targetSpan = this.$targetPre.find("span");
                            const $wpText = $("<span class='wp-txt'>&ZeroWidthSpace;</span>");
                            $targetSpan.append($wpText);
                        }
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
                    const returnCode = this.chainedLineDeletingLetterBottomUpHandler(this.Index["line"]);

                    if (returnCode === "00") {
                        this.chainedLineDeletingLetterTopDownHandler(this.Index["line"]);
                    } else if (returnCode === "02") {
                        this.recoveryChainedLineHandler(this.Index["line"] + 1);
                    }
                }
            }
        }

        if (width > 0) {
            PostUtil.Index["cursor"]++;
        } else if (width < 0) {
            PostUtil.Index["cursor"]--;
        }

        if (PostUtil.Index["cursor"] - PostUtil.Index["origin"] - PostUtil.Index["text"] === 2) {
            PostUtil.Index["text"]++;
        }
    }

    static moveCursorOneStepVertically(kind) {
        const lineHeight = parseFloat(this.$targetPre.css("line-height"));
        const $targetSpan = this.$targetPre.find("span");
        const currentWidth = this.letterWidthConverter($targetSpan.text().slice(this.lineList[this.Index["line"]].firstIdx, this.Index["cursor"]));

        if (kind === "arrowUp") {
            const lineObj = this.lineList[this.Index["line"] - 1];

            const topValue = parseFloat(this.$cursor.css("top")) - lineHeight;
            const txt = $targetSpan.text().slice(lineObj.firstIdx, lineObj.firstIdx + lineObj.count);

            const optimalIdx = this.findOptimalWidthIdx(txt, 0, txt.length, currentWidth);
            const upWidth = this.letterWidthConverter($targetSpan.text().slice(lineObj.firstIdx, lineObj.firstIdx + optimalIdx));

            this.$cursor.css("top", topValue + "px"); this.$cursor.css("left", upWidth + "px");
            this.$txtareaWrapper.css("top", topValue + "px"); this.$txtareaWrapper.css("left", upWidth + "px");

            this.Index["cursor"] = lineObj.firstIdx + optimalIdx;
            this.Index["origin"] = lineObj.firstIdx + optimalIdx;
            this.Index["line"]--;
        } else if (kind === "arrowDown") {
            const lineObj = this.lineList[this.Index["line"] + 1];

            const topValue = parseFloat(this.$cursor.css("top")) + lineHeight;
            const txt = $targetSpan.text().slice(lineObj.firstIdx, lineObj.firstIdx + lineObj.count);

            const optimalIdx = this.findOptimalWidthIdx(txt, 0, txt.length, currentWidth);
            const downWidth = this.letterWidthConverter($targetSpan.text().slice(lineObj.firstIdx, lineObj.firstIdx + optimalIdx));

            this.$cursor.css("top", topValue + "px"); this.$cursor.css("left", downWidth + "px");
            this.$txtareaWrapper.css("top", topValue + "px"); this.$txtareaWrapper.css("left", downWidth + "px");

            this.Index["cursor"] = lineObj.firstIdx + optimalIdx;
            this.Index["origin"] = lineObj.firstIdx + optimalIdx;
            this.Index["line"]++;
        }
    }

    /*
    * initialize mouse cursor when it's clicked based on whole text area
    * */
    static mouseClickCursorInitializer(offsetY) {
        if (!this.lineList.length) return; // no line

        if (offsetY > 0) {
            const $targetSpan = this.$targetPre.find("span");
            const lineHeight = parseFloat(this.$targetPre.css("line-height"));

            this.Index["line"] = this.lineList.length - 1

            const lastLineObj = this.lineList[this.Index["line"]];

            const text = $targetSpan.text().slice(lastLineObj.firstIdx, lastLineObj.firstIdx + lastLineObj.count);
            const width = this.letterWidthConverter(text);

            this.$cursor.css("left",  width + "px"); this.$cursor.css("top", lineHeight * this.Index["line"] + "px");
            this.$txtareaWrapper.css("left",  width + "px"); this.$txtareaWrapper.css("top", lineHeight * this.Index["line"] + "px");

            this.Index["cursor"] = lastLineObj.firstIdx + lastLineObj.count
            this.Index["origin"] = lastLineObj.firstIdx + lastLineObj.count
        }
    }

    /*
    * move mouse cursor whenever you click the line
    * */
    static mouseClickCursorMoveHandler(offsetX, offsetY) {
        if (!this.lineList.length) return;

        const $targetSpan = this.$targetPre.find("span");
        const lineHeight = parseFloat(this.$targetPre.css("line-height"));
        const lineIdx = this.findOptimalLineIdx(lineHeight, offsetY);

        this.Index["line"] = lineIdx

        const targetLineObj = this.lineList[lineIdx];

        const text = $targetSpan.text().slice(targetLineObj.firstIdx, targetLineObj.firstIdx + targetLineObj.count);

        const optimalIdx = this.findOptimalWidthIdx(text, 0, text.length, offsetX);
        const optimalWidth = this.letterWidthConverter($targetSpan.text().slice(targetLineObj.firstIdx, targetLineObj.firstIdx + optimalIdx));

        this.$cursor.css("top", lineHeight * lineIdx + "px"); this.$cursor.css("left", optimalWidth + "px");
        this.$txtareaWrapper.css("top", lineHeight * lineIdx + "px"); this.$txtareaWrapper.css("left", optimalWidth + "px");

        this.Index["cursor"] = targetLineObj.firstIdx + optimalIdx;
        this.Index["origin"] = targetLineObj.firstIdx + optimalIdx;
    }
}