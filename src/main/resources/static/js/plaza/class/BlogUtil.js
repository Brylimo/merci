class BlogUtil {
    static timers = [];
    static isActive = false;
    static isOnDelete = false;
    static cIndex = 0; // cursor index
    static tIndex = 0; // text index
    static sIndex = 0; // spot index
    static spaceCd = "00";

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

    static moveCursorOneStepHorizontally($cursor, $wpWrapper, width) {
        $cursor.css("left", parseFloat($cursor.css("left")) + width + "px");
        $wpWrapper.css("left", parseFloat($wpWrapper.css("left")) + width + "px");
    }
}