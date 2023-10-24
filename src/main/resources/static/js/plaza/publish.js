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
        if (BlogUtil.isActive) {

            if (event.keyCode === 13) { // enter
                const $wpCodeLine = $("<pre class='wp-line'><span></span></pre>");
                $(".wp-code").append($wpCodeLine);
            }
        }
    });

    $(".wp-textarea-wrapper textarea").on("keydown", (event) => {
        const $textarea = $(".wp-textarea-wrapper textarea");
        const $targetSpan = $(".wp-code .wp-line span");
        const $wpWrapper = $(".wp-textarea-wrapper");
        const $wpDraftSpan = $(".wp-code-draft span");
        const $cursor = $(".wp-core .cursors .cursor");

        /*
        * usual backspace keyboard btn pressed event is processed here
        * */
        if (event.key === "Backspace" || event.keyCode == 8) {
            if (BlogUtil.cIndex <= 0) return;

            BlogUtil.cIndex--;
            BlogUtil.tIndex--;

            const targetChar = $targetSpan.text().charAt(BlogUtil.cIndex);

            const width = BlogUtil.letterWidthConverter($targetSpan, $wpDraftSpan, targetChar);

            $targetSpan.text($targetSpan.text().slice(0, BlogUtil.cIndex) + $textarea.val().slice(BlogUtil.cIndex + 1));

            BlogUtil.moveCursorOneStepHorizontally($cursor, $wpWrapper, width*(-1));

            BlogUtil.isOnDelete = true;
        }
    });

    $(".wp-textarea-wrapper textarea").on("keyup", (event) => {
        const $textarea = $(".wp-textarea-wrapper textarea");
        const $targetSpan = $(".wp-code .wp-line span");
        const $wpWrapper = $(".wp-textarea-wrapper");
        const $wpDraftSpan = $(".wp-code-draft span");
        const $cursor = $(".wp-core .cursors .cursor");

        if (event.key == " " || event.key == "Spacebar" || event.keyCode == 32) {
            /*
            * spacebar keyboard btn pressed event is processed here
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
                * when space bar is pressed more than two times
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
                BlogUtil.tIndex++;
                BlogUtil.cIndex++;

                BlogUtil.moveCursorOneStepHorizontally($cursor, $wpWrapper, width);
            }
        }
    });

    $(".wp-textarea-wrapper textarea").on("input", (event) => {
        const $textarea = $(".wp-textarea-wrapper textarea");
        const $targetSpan = $(".wp-code .wp-line span");
        const $wpWrapper = $(".wp-textarea-wrapper");
        const $wpDraftSpan = $(".wp-code-draft span");
        const $cursor = $(".wp-core .cursors .cursor")

        /*
        * if the backspace keyboard btn is pressed, and properly it is recognized as an event,
        *  we won't process any codes in this event
        * */
        if (BlogUtil.isOnDelete) {
            if (BlogUtil.isOnDelete) BlogUtil.isOnDelete = false;
            return;
        }

        if (event.keyCode === 37) {
            BlogUtil.cIndex += $textarea.val().length > 0 ? $textarea.val().length - 1 : 0;
            let lastChar = $targetSpan.text().charAt(BlogUtil.cIndex);
            console.log(lastChar);
            const fontSize = $targetSpan.css("font-size");
            console.log("f", fontSize)
            $wpDraftSpan.css("font-size", fontSize);
            BlogUtil.cIndex -= 1;

            console.log($targetSpan.text())
            if (lastChar === ' ') {
                $wpDraftSpan.html('&nbsp;');
            } else {
                $wpDraftSpan.text(lastChar);
            }

            let width = $wpDraftSpan.get(0).offsetWidth;
            $wpDraftSpan.text('');
            $textarea.val('');
            BlogUtil.tIndex = 0;

            BlogUtil.moveCursorOneStepHorizontally($cursor, $wpWrapper, width*(-1));
        } else { /* process normal keyword letter like alphabet or korean */

            /*
            * this if statement is used when the backspace keyboard btn is pressed
            * there's some specific weird cases(korean) when the event can't recognize if the backspace btn is pressed
            * this if statement is used for this case
            * */
            if (BlogUtil.sIndex + $textarea.val().length === BlogUtil.sIndex + BlogUtil.tIndex) {
                const targetChar = $targetSpan.text().charAt($targetSpan.text().length - 1);

                const width = BlogUtil.letterWidthConverter($targetSpan, $wpDraftSpan, targetChar);

                BlogUtil.moveCursorOneStepHorizontally($cursor, $wpWrapper, width*(-1));

                $targetSpan.text($targetSpan.text().slice(0, BlogUtil.tIndex) + $textarea.val().slice(BlogUtil.tIndex + 1));

                BlogUtil.cIndex--;

                return;
            }

            let lastChar = $textarea.val().charAt($textarea.val().length - 1);
            const width = BlogUtil.letterWidthConverter($targetSpan, $wpDraftSpan, lastChar);

            /*
            * if the last character of the textarea is space, then we don't process anything here
            * */
            if (lastChar == ' ') return;

            BlogUtil.spaceCd = '00'; // no space

            if (BlogUtil.containsKorean(lastChar)) {
                if ($textarea.val().length - BlogUtil.cIndex) {
                    $targetSpan.text($targetSpan.text().slice(0, BlogUtil.tIndex) + $textarea.val().slice(BlogUtil.tIndex));

                    BlogUtil.moveCursorOneStepHorizontally($cursor, $wpWrapper, width);
                    BlogUtil.cIndex++;
                } else {
                    $targetSpan.text($targetSpan.text().slice(0, BlogUtil.tIndex) + $textarea.val().slice(BlogUtil.tIndex));
                }

                if (BlogUtil.cIndex - BlogUtil.tIndex === 2) {
                    BlogUtil.tIndex++;
                }
            } else {
                $targetSpan.text($targetSpan.text() + lastChar);

                BlogUtil.tIndex++;
                BlogUtil.cIndex++;

                BlogUtil.moveCursorOneStepHorizontally($cursor, $wpWrapper, width);
            }
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