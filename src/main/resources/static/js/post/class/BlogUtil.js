class BlogUtil {
    static timers = [];
    static isActive = false;
    static lastLineWidth = 0;

    // index
    static cursorIndex = 0; // cursor index
    static textIndex = 0; // text index
    static originIndex = 0; // origin index

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

        if (coreWidth < leftValue) { // move to new line
            const lineHeight = parseFloat($targetPre.css("line-height"));
            const topValue = parseFloat($cursor.css("top")) + lineHeight;
            this.lastLineWidth = parseFloat($cursor.css("left"));

            $cursor.css("left", width + "px"); $cursor.css("top", topValue + "px");
            $wpWrapper.css("left", width + "px"); $wpWrapper.css("top", topValue + "px");
        } else if (leftValue <= 0) { // delete current line & go to previous line
            if ($targetPre.find("span").text().length === 0) {
                $cursor.css("left", leftValue + "px");
                $wpWrapper.css("left", leftValue + "px");
                BlogUtil.cursorIndex--;
                return;
            }

            const lineHeight = parseFloat($targetPre.css("line-height"));
            const topValue = parseFloat($cursor.css("top")) - lineHeight;

            $cursor.css("left", this.lastLineWidth + "px"); $cursor.css("top", topValue + "px");
            $wpWrapper.css("left", this.lastLineWidth + "px"); $wpWrapper.css("top", topValue + "px");
        } else { // normal case
            $cursor.css("left", leftValue + "px");
            $wpWrapper.css("left", leftValue + "px");
        }

        if (width > 0) {
            BlogUtil.cursorIndex++;
        } else if (width < 0) {
            BlogUtil.cursorIndex--;
        }

        if (BlogUtil.cursorIndex - BlogUtil.originIndex - BlogUtil.textIndex === 2) {
            BlogUtil.textIndex++;
        }
    }
}