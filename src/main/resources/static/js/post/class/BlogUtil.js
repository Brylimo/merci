document.write('<script src="/js/post/class/LineObj.js"></script>');

class BlogUtil {
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

    static letterWidthConverter($targetSpan, $draftSpan, targetChar) {

        // sync font-size
        const fontSize = $targetSpan.css("font-size");
        $draftSpan.css("font-size", fontSize);

        // use $wpDraftSpan to get a letter width

        if (!targetChar || targetChar === ' ') {
            // default behavior is returning a single space width('&nbsp;')
            $draftSpan.html('&nbsp;')
        } else {
            $draftSpan.text(targetChar);
        }
        const width = $draftSpan[0].getBoundingClientRect().width;
        $draftSpan.text('');

        return width;
    }

    static moveCursorOneStepHorizontally(kind, $targetPre, $cursor, $wpWrapper, width) {
        // todo need to extract maxWidth value to the parameter...
        const coreWidth = $wpWrapper.parent()[0].getBoundingClientRect().width;
        const leftValue = parseFloat($cursor.css("left")) + width;

        if ((kind === "arrowRight" && this.lineList[this.Index["line"]].width < leftValue) ||
            (kind === "add" && coreWidth < leftValue)) { // move to new line
            const lineHeight = parseFloat($targetPre.css("line-height"));
            const topValue = parseFloat($cursor.css("top")) + lineHeight;

            if (kind === "add" && BlogUtil.isCodeTypeChanged === 4) {
                // special case
                const selectedText = $targetPre.find("span").text().slice(0, this.Index["cursor"] + 1);
                let spaceCnt = 0;
                let initialValue = 0;

                for (let i = selectedText.length - 1; i>= 0; i--) {
                    const char = selectedText[i];
                    if (this.containsKorean(char)) {
                        if (selectedText[i+1] == '.') {
                            const $wpDraftSpan = $(".wp-code-draft span");

                            const width = this.letterWidthConverter($targetPre.find("span"), $wpDraftSpan, char);
                            initialValue = width;
                        }
                        break;
                    } else {
                        spaceCnt++;
                    }
                }

                this.lineList[this.Index["line"]].width = parseFloat($cursor.css("left")) - initialValue - (width * (spaceCnt - 1));

                $cursor.css("left", (initialValue + width * spaceCnt) + "px"); $cursor.css("top", topValue + "px");
                $wpWrapper.css("left", (initialValue + width * spaceCnt) + "px"); $wpWrapper.css("top", topValue + "px");

                this.Index["line"]++;
                this.lineList.splice(this.Index["line"], 0, new LineObj(initialValue + width * spaceCnt, 0));
            } else {
                if (kind === "add") {
                    this.lineList[this.Index["line"]].width = parseFloat($cursor.css("left"));
                }

                $cursor.css("left", width + "px"); $cursor.css("top", topValue + "px");
                $wpWrapper.css("left", width + "px"); $wpWrapper.css("top", topValue + "px");

                this.Index["line"]++;
                if (kind === "add") {
                    this.lineList.splice(this.Index["line"], 0, new LineObj(width, 0));
                }
            }

            this.isCodeTypeChanged = 0;
        } else if (leftValue <= 0) { // delete current line & go to previous line
            if ((kind === "backspace" && this.Index["line"] === 0) || (kind === "arrowLeft" && parseFloat($cursor.css("left")) > 0)) {
                $cursor.css("left", leftValue + "px");
                $wpWrapper.css("left", leftValue + "px");
                BlogUtil.Index["cursor"]--;

                if (kind === "backspace") {
                    const before = this.lineList.slice(0, this.Index["line"]);
                    const after = this.lineList.slice(this.Index["line"]+1);
                    const mergedList = before.concat(after);

                    this.lineList = mergedList;
                }
                return;
            }

            const lineHeight = parseFloat($targetPre.css("line-height"));
            const topValue = parseFloat($cursor.css("top")) - lineHeight;

            if (kind === "backspace") {
                $cursor.css("left", this.lineList[this.Index["line"] - 1].width + "px"); $cursor.css("top", topValue + "px");
                $wpWrapper.css("left", this.lineList[this.Index["line"] - 1].width + "px"); $wpWrapper.css("top", topValue + "px");

                const before = this.lineList.slice(0, this.Index["line"]);
                const after = this.lineList.slice(this.Index["line"]+1);
                const mergedList = before.concat(after);

                this.lineList = mergedList;
                this.Index["line"]--;
            } else if (kind === "arrowLeft") {
                $cursor.css("left", this.lineList[this.Index["line"] - 1].width + width + "px"); $cursor.css("top", topValue + "px");
                $wpWrapper.css("left", this.lineList[this.Index["line"] - 1].width + width + "px"); $wpWrapper.css("top", topValue + "px");
                this.Index["line"]--;
            }
        } else { // normal case
            $cursor.css("left", leftValue + "px");
            $wpWrapper.css("left", leftValue + "px");
            if (kind === "add" && this.lineList.length == 0) {
                // type first letter
                this.lineList[this.Index["line"]] = new LineObj(0, 0);
            }

            if (kind === "add" || kind === "backspace") {
                this.lineList[this.Index["line"]].width += width;
                if (this.lineList[this.Index["line"]].width > coreWidth) {
                    console.log("zz");
                }

                if (this.lineList[this.Index["line"]].width <= 0) {
                    this.lineList[this.Index["line"]].width = 0;
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