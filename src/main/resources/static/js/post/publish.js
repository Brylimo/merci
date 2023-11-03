$(() => {
    init();

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
        const $textarea = BlogUtil.$txtareaWrapper.find("textarea").first();
        let $targetSpan = BlogUtil.$targetPre.find("span").first();

        if (BlogUtil.isActive) {
            if (event.key === "ArrowLeft") { // press ArrowLeft keyboard btn -> one step move cursor to left
                if (BlogUtil.Index["cursor"] < 1) return;
                $textarea.val('');

                let leftChar = $targetSpan.text().charAt(BlogUtil.Index["cursor"] - 1);
                const width = BlogUtil.letterWidthConverter(leftChar);
                BlogUtil.moveCursorOneStepHorizontally("arrowLeft", leftChar, width*(-1));
                BlogUtil.Index["origin"] = BlogUtil.Index["cursor"];
                BlogUtil.Index["text"] = 0;
            } else if (event.key === "ArrowRight") { // press ArrowRight keyboard btn -> one step move cursor to right
                if (BlogUtil.Index["cursor"] >= $targetSpan.text().length) return;
                $textarea.val('');

                let rightChar = $targetSpan.text().charAt(BlogUtil.Index["cursor"]);
                const width = BlogUtil.letterWidthConverter(rightChar);
                BlogUtil.moveCursorOneStepHorizontally("arrowRight", rightChar, width);
                BlogUtil.Index["origin"] = BlogUtil.Index["cursor"];
                BlogUtil.Index["text"] = 0;
            } else if (event.key === "ArrowUp") {
                /*BlogUtil.moveCursorOneStepVertically("arrowRight", $targetSpan.parent(), $cursor, $wpWrapper, 3);*/
            } else if (event.key === "Backspace" && $textarea.val().length === 0) { // press backspace keyboard btn when textarea is empty
                if (BlogUtil.Index["cursor"] < 1) return;

                const targetChar = $targetSpan.text().charAt(BlogUtil.Index["cursor"] - 1);

                $targetSpan.text($targetSpan.text().slice(0, BlogUtil.Index["cursor"] - 1) + $targetSpan.text().slice(BlogUtil.Index["cursor"]));

                const width = BlogUtil.letterWidthConverter(targetChar);
                BlogUtil.moveCursorOneStepHorizontally("backspace", targetChar, width*(-1));
                BlogUtil.Index["origin"] = BlogUtil.Index["cursor"];
            }

            /*if (event.keyCode === 13) { // enter
                const $wpCodeLine = $("<pre class='wp-line'><span></span></pre>");
                $(".wp-code").append($wpCodeLine);
            }*/
        }
    });

    $(".wp-textarea-wrapper textarea").on("input", (event) => {
        const $wpText = $(".wp-txt");
        if ($wpText[0]) {
            $wpText.remove();
        }

        const $textarea = BlogUtil.$txtareaWrapper.find("textarea");
        let $targetSpan = BlogUtil.$targetPre.find("span");

        let lastChar = $textarea.val().charAt($textarea.val().length - 1);
        const lastCharwidth = BlogUtil.letterWidthConverter(lastChar);

        if (BlogUtil.Index["origin"] + $textarea.val().length <= BlogUtil.Index["origin"] + BlogUtil.Index["text"]) {
            /*
            * usual backspace keyboard btn pressed event is processed here
            * */
            if (BlogUtil.Index["cursor"] < 1) return;

            let width;
            const innerSpans = BlogUtil.$targetPre.find("span");
            if (innerSpans.length > 1) {
                /*
                * if there's multiple spans, it means space has been typed right before this event happened
                * so we're going to delete span element instead
                * */
                BlogUtil.$targetPre.children().last().remove();
                width = BlogUtil.letterWidthConverter(' ');
                BlogUtil.moveCursorOneStepHorizontally("backspace", ' ', width*(-1));
            } else {
                const targetChar = $targetSpan.text().charAt(BlogUtil.Index["cursor"] - 1);

                width = BlogUtil.letterWidthConverter(targetChar);
                $targetSpan.text($targetSpan.text().slice(0, BlogUtil.Index["cursor"] - 1) + $targetSpan.text().slice(BlogUtil.Index["cursor"]));
                BlogUtil.moveCursorOneStepHorizontally("backspace", targetChar, width*(-1));
            }

            if (BlogUtil.Index["origin"] + $textarea.val().length !== BlogUtil.Index["origin"] + BlogUtil.Index["text"]) {
                /*
                * this if statement is used when the backspace keyboard btn is pressed
                * there's some specific weird cases(korean) when the event can't recognize if the backspace btn is pressed
                * this if statement is used for this case
                * */
                BlogUtil.Index["text"]--;
            }

            return;
        }

        /*
        * if the last character of the textarea is space, then we are gonna process space
        * */
        if (lastChar == ' ') {

            const secondLastChar = $targetSpan.val().charAt($textarea.val().length - 2);
            let innerSpans = BlogUtil.$targetPre.find("span");

            /*
            * space bar keyboard btn pressed event is processed here
            * */
            if (innerSpans.length > 1) {
                /*
                * when space bar is pressed more than twice
                * */
                let $newLine = null;
                const lastOne = BlogUtil.$targetPre.find(".new-line");

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

                BlogUtil.$targetPre.append($newLine);

                const width = BlogUtil.letterWidthConverter(' ');

                BlogUtil.moveCursorOneStepHorizontally("add", ' ', width);
            } else if (secondLastChar && secondLastChar == ' ') {
                /*
                * when space bar is pressed twice
                * */
                const spareStr = $targetSpan.text().slice(BlogUtil.Index["cursor"]).trimStart();

                $targetSpan.text($targetSpan.text().slice(0, BlogUtil.Index["cursor"]).trimEnd());
                const $spaceA = $("<span class='space-a'> </span>");
                const $newLine = $("<span>&nbsp;</span>");

                $newLine.addClass("new-line");
                BlogUtil.$targetPre.append($spaceA);
                BlogUtil.$targetPre.append($newLine);

                if (spareStr) {
                    const $spare = $(`<span>${spareStr}</span>`);
                    BlogUtil.$targetPre.append($spare);

                    innerSpans = BlogUtil.$targetPre.find("span");

                    const spanList = [];
                    innerSpans.each((index, span) => {
                        spanList.push($(span).text());
                    });

                    const combinedSpan = spanList.join("");

                    BlogUtil.$targetPre.empty();
                    $targetSpan = $(`<span>${combinedSpan}</span>`);
                    BlogUtil.$targetPre.append($targetSpan);
                }

                const width = BlogUtil.letterWidthConverter(' ');
                BlogUtil.moveCursorOneStepHorizontally("add", ' ', width);
            } else {
                const width = BlogUtil.letterWidthConverter(' ')
                $targetSpan.text($targetSpan.text().slice(0, BlogUtil.Index["cursor"]) + ' ' + $targetSpan.text().slice(BlogUtil.Index["cursor"]));
                BlogUtil.moveCursorOneStepHorizontally("add", ' ', width);
            }

            BlogUtil.Index["text"] = BlogUtil.Index["cursor"] - BlogUtil.Index["origin"];

            return;
        }

        /*
        * the lastChar cannot be a space anymore from here
        * */
        const innerSpans = BlogUtil.$targetPre.find("span");

        if (innerSpans.length > 1) {
            let spanList = [];
            innerSpans.each((index, span) => {
                spanList.push($(span).text());
            });

            const combinedSpan = spanList.join("");

            BlogUtil.$targetPre.empty();
            $targetSpan = $(`<span>${combinedSpan}</span>`);
            BlogUtil.$targetPre.append($targetSpan);
        }

        if (BlogUtil.containsKorean(lastChar)) {
            if (BlogUtil.isCodeTypeChanged === 0) {
                BlogUtil.isCodeTypeChanged = 2;
            } else if (BlogUtil.isCodeTypeChanged === 1 || BlogUtil.isCodeTypeChanged === 4) {
                BlogUtil.isCodeTypeChanged = 3;
            }

            if (BlogUtil.Index["origin"] + $textarea.val().length - BlogUtil.Index["cursor"]) {
                $targetSpan.text($targetSpan.text().slice(0, BlogUtil.Index["origin"] + BlogUtil.Index["text"]) + $textarea.val().slice(BlogUtil.Index["text"]) + $targetSpan.text().slice(BlogUtil.Index["cursor"]));

                BlogUtil.moveCursorOneStepHorizontally("add", lastChar, lastCharwidth);
            } else {
                $targetSpan.text($targetSpan.text().slice(0, BlogUtil.Index["origin"] + BlogUtil.Index["text"]) + $textarea.val().slice(BlogUtil.Index["text"]) + $targetSpan.text().slice(BlogUtil.Index["origin"] + BlogUtil.Index["text"] + 1));
            }
        } else {
            if (BlogUtil.isCodeTypeChanged === 0) {
                BlogUtil.isCodeTypeChanged = 1;
            } else if (BlogUtil.isCodeTypeChanged === 2 || BlogUtil.isCodeTypeChanged === 3) {
                BlogUtil.isCodeTypeChanged = 4;
            }
            $targetSpan.text($targetSpan.text().slice(0, BlogUtil.Index["cursor"])  + lastChar + $targetSpan.text().slice(BlogUtil.Index["cursor"]));

            BlogUtil.moveCursorOneStepHorizontally("add", lastChar, lastCharwidth);
            BlogUtil.Index["text"]++;
        }
    });

    $(".wp-textarea-wrapper textarea").on("blur", function (event) {
        BlogUtil.clearTimerPlayer();
        $(".wp .cursors").removeClass("cursor-visible");
        BlogUtil.isActive = false;

        if (BlogUtil.lineList.length === 0) {
            $(".wp-placeholder").show();
        }
    });

    $(".wp").on("click", (event) => {
        const $placeholder = $(".wp-placeholder");
        if ($placeholder[0]) {
            $placeholder.hide();
        }

        BlogUtil.timerPlayer();
        BlogUtil.isActive = true;

        const $textarea = $(".wp-textarea-wrapper textarea");
        $textarea.focus();
    })
})

const init = () => {
    BlogUtil.init($(".wp-textarea-wrapper"), $(".wp-code-draft span"), $(".wp-code .wp-line"), $(".wp-core .cursors .cursor"))

    const workplaceWidth = document.querySelector(".workplace-wrapper").offsetWidth;
    document.querySelector(".publish-footer").style.width = workplaceWidth + 'px';

    // initialize cursor size
    const lineHeight = parseFloat($(".wp-placeholder").css("line-height"));
    BlogUtil.$cursor.css("height", lineHeight + "px");
    BlogUtil.$txtareaWrapper.css("top", $(".wp-textarea-wrapper").height() + "px");
}