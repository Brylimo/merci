$(() => {
    window.addEventListener('resize', function () {
        const workplaceWidth = document.querySelector(".workplace-wrapper").offsetWidth;
        document.querySelector(".publish-footer").style.width = workplaceWidth + 'px';
    })

    $(".hashtag input[name='hashtag-txt']").on("keyup", function(event){
        if (event.keyCode == 13) {
            const $hashTag = $("<div class='hashtg'></div>");
            $hashTag.text(`#${$(this).val()}`);

            $(".workplace-wrapper .hashtag input[name='hashtag-txt']").before($hashTag);
            $(this).val('');
        }
    });

    $(".workplace-wrapper .title input[name='title']").on("keyup", function (event) {
        $(".preview-wrapper .title span").text(event.target.value);
    });

    $(".publish-footer .out-btn").click(() => {
        window.history.back();
    });

    $(document).on("keydown", (event) => {
        const $textarea = $(".wp-textarea-wrapper textarea");
        const $wpWrapper = $(".wp-textarea-wrapper");
        const $wpDraftSpan = $(".wp-code-draft span");
        const $cursor = $(".wp-core .cursors .cursor");
        let $targetSpan = $(".wp-code .wp-line span");

        if (BlogUtil.isActive) {
            if (event.key === "ArrowLeft") { // press ArrowLeft keyboard btn -> one step move cursor to left
                if (BlogUtil.cursorIndex < 1) return;
                $textarea.val('');

                let leftChar = $targetSpan.text().charAt(BlogUtil.cursorIndex - 1);
                const width = BlogUtil.letterWidthConverter($targetSpan, $wpDraftSpan, leftChar);
                BlogUtil.moveCursorOneStepHorizontally($cursor, $wpWrapper, width*(-1));
                BlogUtil.textIndex = BlogUtil.cursorIndex;
            } else if (event.key === "ArrowRight") { // press ArrowRight keyboard btn -> one step move cursor to right
                if (BlogUtil.cursorIndex >= $targetSpan.text().length) return;
                $textarea.val('');

                let rightChar = $targetSpan.text().charAt(BlogUtil.cursorIndex);
                const width = BlogUtil.letterWidthConverter($targetSpan, $wpDraftSpan, rightChar);
                BlogUtil.moveCursorOneStepHorizontally($cursor, $wpWrapper, width);
                BlogUtil.textIndex = BlogUtil.cursorIndex;
            }

            /*if (event.keyCode === 13) { // enter
                const $wpCodeLine = $("<pre class='wp-line'><span></span></pre>");
                $(".wp-code").append($wpCodeLine);
            }*/
        }
    });

    $(".wp-textarea-wrapper textarea").on("input", (event) => {
        const $textarea = $(".wp-textarea-wrapper textarea");
        const $wpWrapper = $(".wp-textarea-wrapper");
        const $wpDraftSpan = $(".wp-code-draft span");
        const $cursor = $(".wp-core .cursors .cursor");
        let $targetSpan = $(".wp-code .wp-line span");

        let lastChar = $textarea.val().charAt($textarea.val().length - 1);
        const width = BlogUtil.letterWidthConverter($targetSpan, $wpDraftSpan, lastChar);

        /*
        * this if statement is used when the backspace keyboard btn is pressed
        * there's some specific weird cases(korean) when the event can't recognize if the backspace btn is pressed
        * this if statement is used for this case
        * */
        if (BlogUtil.sIndex + $textarea.val().length == BlogUtil.sIndex + BlogUtil.textIndex) {
            if (BlogUtil.cursorIndex < 1) return;

            const targetChar = $targetSpan.text().charAt($targetSpan.text().length - 1);

            const width = BlogUtil.letterWidthConverter($targetSpan, $wpDraftSpan, targetChar);

            BlogUtil.moveCursorOneStepHorizontally($cursor, $wpWrapper, width*(-1));

            $targetSpan.text($targetSpan.text().slice(0, BlogUtil.textIndex) + $textarea.val().slice(BlogUtil.textIndex + 1));

            return;
        } else if (BlogUtil.sIndex + $textarea.val().length < BlogUtil.sIndex + BlogUtil.textIndex) {
            /*
            * usual backspace keyboard btn pressed event is processed here
            * */
            if (BlogUtil.cursorIndex < 1) return;

            let width;
            const $parentPre = $targetSpan.parent();
            const innerSpans = $parentPre.find("span");
            if (innerSpans.length > 1) {
                /*
                * if there's multiple spans, it means space has been typed right before this event happened
                * so we're going to delete span element instead
                * */
                $parentPre.children().last().remove();
                width = BlogUtil.letterWidthConverter($targetSpan, $wpDraftSpan, ' ');
            } else {
                const targetChar = $targetSpan.text().charAt(BlogUtil.cursorIndex - 1);

                width = BlogUtil.letterWidthConverter($targetSpan, $wpDraftSpan, targetChar);
                $targetSpan.text($targetSpan.text().slice(0, BlogUtil.cursorIndex - 1) + $textarea.val().slice(BlogUtil.cursorIndex));
            }

            BlogUtil.moveCursorOneStepHorizontally($cursor, $wpWrapper, width*(-1));
            BlogUtil.textIndex--;

            return;
        }

        /*
        * if the last character of the textarea is space, then we are gonna process space
        * */
        if (lastChar == ' ') {

            /*
            * space bar keyboard btn pressed event is processed here
            * */
            if (BlogUtil.spaceCd === '01') {
                /*
                * when space bar is pressed twice
                * */

                BlogUtil.spaceCd = '02';
                $targetSpan.text($textarea.val().trim());
                const $spaceA = $("<span class='space-a'> </span>");
                const $newLine = $("<span>&nbsp;</span>");

                $newLine.addClass("new-line");
                $targetSpan.parent().append($spaceA);
                $targetSpan.parent().append($newLine);

                const width = BlogUtil.letterWidthConverter($targetSpan, $wpDraftSpan, ' ');
                BlogUtil.moveCursorOneStepHorizontally($cursor, $wpWrapper, width);

            } else if (BlogUtil.spaceCd === '02') {
                /*
                * when space bar is pressed more than twice
                * */
                let $newLine = null;
                const lastOne = $targetSpan.parent().find(".new-line");

                lastOne.removeClass("new-line");
                if (lastOne.html() === '&nbsp;') {
                    lastOne.addClass("space-b");
                    $newLine = $("<span> </span>");
                    $newLine.addClass("new-line");
                } else if (lastOne.html() === ' ') {
                    lastOne.addClass("space-a");
                    $newLine = $("<span>&nbsp;</span>");
                    $newLine.addClass("new-line");
                }

                $targetSpan.parent().append($newLine);

                const width = BlogUtil.letterWidthConverter($targetSpan, $wpDraftSpan, ' ')

                BlogUtil.moveCursorOneStepHorizontally($cursor, $wpWrapper, width);
            } else {
                /*
                * when it's just a normal space which has only one space
                * */
                BlogUtil.spaceCd = '01';

                const width = BlogUtil.letterWidthConverter($targetSpan, $wpDraftSpan, ' ')

                $targetSpan.text($targetSpan.text() + ' ');
                BlogUtil.moveCursorOneStepHorizontally($cursor, $wpWrapper, width);
            }

            BlogUtil.textIndex = BlogUtil.cursorIndex;

            return;
        }

        /*
        * the lastChar cannot be a space anymore from here
        * */
        if (BlogUtil.spaceCd === "02") {
            const $parentPre = $targetSpan.parent()
            const innerSpans = $parentPre.find("span");
            let spanList = [];
            innerSpans.each((index, span) => {
                spanList.push($(span).text());
            });

            const combinedSpan = spanList.join("");

            $parentPre.empty();
            $targetSpan = $(`<span>${combinedSpan}</span>`);
            $parentPre.append($targetSpan);
        }

        BlogUtil.spaceCd = '00'; // no space

        if (BlogUtil.containsKorean(lastChar)) {
            if ($textarea.val().length - BlogUtil.cursorIndex) {
                $targetSpan.text($targetSpan.text().slice(0, BlogUtil.textIndex) + $textarea.val().slice(BlogUtil.textIndex));

                BlogUtil.moveCursorOneStepHorizontally($cursor, $wpWrapper, width);
            } else {
                $targetSpan.text($targetSpan.text().slice(0, BlogUtil.textIndex) + $textarea.val().slice(BlogUtil.textIndex));
            }
        } else {
            $targetSpan.text($targetSpan.text() + lastChar);

            BlogUtil.textIndex++;

            BlogUtil.moveCursorOneStepHorizontally($cursor, $wpWrapper, width);
        }
    });

    $(".wp-textarea-wrapper textarea").on("blur", function (event) {
        BlogUtil.clearTimerPlayer();
        $(".wp .cursors").removeClass("cursor-visible");
        BlogUtil.isActive = false;
    });

    $(".wp").on("click", (event) => {
        BlogUtil.timerPlayer();
        BlogUtil.isActive = true;

        const $textarea = $(".wp-textarea-wrapper textarea");
        $textarea.focus();
    })

    init();
})

const init = () => {
    const workplaceWidth = document.querySelector(".workplace-wrapper").offsetWidth;
    document.querySelector(".publish-footer").style.width = workplaceWidth + 'px';

    const $wpWrapper = $(".wp-textarea-wrapper");
    $wpWrapper.css("top", $(".wp-textarea-wrapper").height() + "px");
}