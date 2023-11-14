$(() => {
    init();
    initObserver();

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
        const $focusCtrArea = $(".wp > textarea");
        const $textarea = PostUtil.$txtareaWrapper.find("textarea").first();
        let $targetSpan = PostUtil.$targetPre.find("span").first();

        if (PostUtil.isActive) {
            if (event.key === "ArrowLeft") { // press ArrowLeft keyboard btn -> one step move cursor to left
                if (PostUtil.Index["cursor"] < 1) return;
                $textarea.val('');
                if (event.originalEvent.isComposing) {
                    // for the mac OS korean processing system
                    $focusCtrArea.focus();
                    return;
                }

                let leftChar = $targetSpan.text().charAt(PostUtil.Index["cursor"] - 1);
                const width = PostUtil.letterWidthConverter(leftChar);
                PostUtil.moveCursorOneStepHorizontally("arrowLeft", leftChar, width*(-1));
                PostUtil.Index["origin"] = PostUtil.Index["cursor"];
                PostUtil.Index["text"] = 0;
            } else if (event.key === "ArrowRight") { // press ArrowRight keyboard btn -> one step move cursor to right
                if (PostUtil.Index["cursor"] >= $targetSpan.text().length) return;
                $textarea.val('');

                let rightChar = $targetSpan.text().charAt(PostUtil.Index["cursor"]);
                const width = PostUtil.letterWidthConverter(rightChar);
                PostUtil.moveCursorOneStepHorizontally("arrowRight", rightChar, width);
                PostUtil.Index["origin"] = PostUtil.Index["cursor"];
                PostUtil.Index["text"] = 0;
            } else if (event.key === "ArrowUp") {
                if (PostUtil.Index["line"]  < 1) return;
                $textarea.val('');
                PostUtil.Index["text"] = 0;

                PostUtil.moveCursorOneStepVertically("arrowUp");
            } else if (event.key === "ArrowDown") {
                if (PostUtil.Index["line"]  >= PostUtil.lineList.length - 1) return;
                $textarea.val('');
                PostUtil.Index["text"] = 0;

                PostUtil.moveCursorOneStepVertically("arrowDown");
            } else if (event.key === "Backspace" && $textarea.val().length === 0) { // press backspace keyboard btn when textarea is empty
                if (PostUtil.Index["cursor"] < 1) return;

                const targetChar = $targetSpan.text().charAt(PostUtil.Index["cursor"] - 1);

                $targetSpan.text($targetSpan.text().slice(0, PostUtil.Index["cursor"] - 1) + $targetSpan.text().slice(PostUtil.Index["cursor"]));

                const width = PostUtil.letterWidthConverter(targetChar);
                PostUtil.moveCursorOneStepHorizontally("backspace", targetChar, width*(-1));
                PostUtil.Index["origin"] = PostUtil.Index["cursor"];
            } else if (event.ctrlKey && (event.key === 'c' || event.code === 'KeyC')) { // press Ctrl + C btn

            } else if (event.ctrlKey && (event.key === 'v' || event.code === 'KeyV')) { // press Ctrl + V btn
                $textarea.val('');
                PostUtil.Index["text"] = 0;

                PostUtil.Flag["paste"] = true;
            }
        }
    });

    $(".wp > textarea").on("keydown",function (event) {
        PostUtil.timerPlayer();
        PostUtil.isActive = true;

        const $textarea = PostUtil.$txtareaWrapper.find("textarea");
        $textarea.focus();
        $(this).val('');
    })

    $(".wp-textarea-wrapper textarea").on("input", (event) => {
        const $wpText = $(".wp-txt");
        if ($wpText[0]) {
            $wpText.remove();
        }

        const $textarea = PostUtil.$txtareaWrapper.find("textarea");
        let $targetSpan = PostUtil.$targetPre.find("span");

        let lastChar = $textarea.val().charAt($textarea.val().length - 1);
        const lastCharwidth = PostUtil.letterWidthConverter(lastChar);

        /*
        * when the paste flag is on this if statement takes action
        * */
        if (PostUtil.Flag["paste"] && $textarea.val()) {
            PostUtil.pasteHandler()

            PostUtil.Flag["paste"] = false;
            return;
        }

        if (PostUtil.Index["origin"] + $textarea.val().length <= PostUtil.Index["origin"] + PostUtil.Index["text"]) {
            /*
            * usual backspace keyboard btn pressed event is processed here
            * */
            if (PostUtil.Index["cursor"] < 1) return;

            let width;
            const innerSpans = PostUtil.$targetPre.find("span");
            if (innerSpans.length > 1) {
                /*
                * if there's multiple spans, it means space has been typed right before this event happened
                * so we're going to delete span element instead
                * */
                PostUtil.$targetPre.children().last().remove();
                width = PostUtil.letterWidthConverter(' ');
                PostUtil.moveCursorOneStepHorizontally("backspace", ' ', width*(-1));
            } else {
                const targetChar = $targetSpan.text().charAt(PostUtil.Index["cursor"] - 1);

                width = PostUtil.letterWidthConverter(targetChar);
                $targetSpan.text($targetSpan.text().slice(0, PostUtil.Index["cursor"] - 1) + $targetSpan.text().slice(PostUtil.Index["cursor"]));
                PostUtil.moveCursorOneStepHorizontally("backspace", targetChar, width*(-1));
            }

            if (PostUtil.Index["origin"] + $textarea.val().length !== PostUtil.Index["origin"] + PostUtil.Index["text"]) {
                /*
                * this if statement is used when the backspace keyboard btn is pressed
                * there's some specific weird cases(korean) when the event can't recognize if the backspace btn is pressed
                * this if statement is used for this case
                * */
                PostUtil.Index["text"]--;
            }

            return;
        }

        /*
        * if the last character of the textarea is space, then we are gonna process space
        * */
        if (lastChar == ' ') {

            const secondLastChar = $targetSpan.text().charAt(PostUtil.Index["cursor"] - 1);
            let innerSpans = PostUtil.$targetPre.find("span");
            /*
            * space bar keyboard btn pressed event is processed here
            * */
            if (innerSpans.length > 1) {
                /*
                * when space bar is pressed more than twice
                * */
                let $newLine = null;
                const lastOne = PostUtil.$targetPre.find(".new-line");

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

                PostUtil.$targetPre.append($newLine);

                const width = PostUtil.letterWidthConverter(' ');

                PostUtil.moveCursorOneStepHorizontally("add", ' ', width);
            } else if (secondLastChar && secondLastChar == ' ') {
                /*
                * when space bar is pressed twice
                * */
                const spareStr = $targetSpan.text().slice(PostUtil.Index["cursor"]).trimStart();

                $targetSpan.text($targetSpan.text().slice(0, PostUtil.Index["cursor"]).trimEnd());
                const $spaceA = $("<span class='space-a'> </span>");
                const $newLine = $("<span>&nbsp;</span>");

                $newLine.addClass("new-line");
                PostUtil.$targetPre.append($spaceA);
                PostUtil.$targetPre.append($newLine);

                if (spareStr) {
                    const $spare = $(`<span>${spareStr}</span>`);
                    PostUtil.$targetPre.append($spare);

                    innerSpans = PostUtil.$targetPre.find("span");

                    const spanList = [];
                    innerSpans.each((index, span) => {
                        spanList.push($(span).text());
                    });

                    const combinedSpan = spanList.join("");

                    PostUtil.$targetPre.empty();
                    $targetSpan = $(`<span>${combinedSpan}</span>`);
                    PostUtil.$targetPre.append($targetSpan);
                }

                const width = PostUtil.letterWidthConverter(' ');
                PostUtil.moveCursorOneStepHorizontally("add", ' ', width);
            } else {
                const width = PostUtil.letterWidthConverter(' ')
                $targetSpan.text($targetSpan.text().slice(0, PostUtil.Index["cursor"]) + ' ' + $targetSpan.text().slice(PostUtil.Index["cursor"]));
                PostUtil.moveCursorOneStepHorizontally("add", ' ', width);
            }

            PostUtil.Index["text"] = PostUtil.Index["cursor"] - PostUtil.Index["origin"];

            return;
        }

        /*
        * the lastChar cannot be a space anymore from here
        * */
        const innerSpans = PostUtil.$targetPre.find("span");

        if (innerSpans.length > 1) {
            let spanList = [];
            innerSpans.each((index, span) => {
                if (index === innerSpans.length - 1) {
                    /* the last one gotta be just a normal space.. */
                    spanList.push(' ');
                } else {
                    spanList.push($(span).text());
                }
            });

            const combinedSpan = spanList.join("");

            PostUtil.$targetPre.empty();
            $targetSpan = $(`<span>${combinedSpan}</span>`);
            PostUtil.$targetPre.append($targetSpan);
        }

        if (PostUtil.containsKorean(lastChar)) {

            if (PostUtil.Index["origin"] + $textarea.val().length - PostUtil.Index["cursor"]) {
                $targetSpan.text($targetSpan.text().slice(0, PostUtil.Index["origin"] + PostUtil.Index["text"]) + $textarea.val().slice(PostUtil.Index["text"]) + $targetSpan.text().slice(PostUtil.Index["cursor"]));

                PostUtil.moveCursorOneStepHorizontally("add", lastChar, lastCharwidth);
            } else {
                $targetSpan.text($targetSpan.text().slice(0, PostUtil.Index["origin"] + PostUtil.Index["text"]) + $textarea.val().slice(PostUtil.Index["text"]) + $targetSpan.text().slice(PostUtil.Index["origin"] + PostUtil.Index["text"] + 1));
            }
        } else {
            $targetSpan.text($targetSpan.text().slice(0, PostUtil.Index["cursor"])  + lastChar + $targetSpan.text().slice(PostUtil.Index["cursor"]));

            PostUtil.moveCursorOneStepHorizontally("add", lastChar, lastCharwidth);
            PostUtil.Index["text"]++;
        }
    });

    $(".wp-textarea-wrapper textarea").on("blur", function (event) {
        PostUtil.clearTimerPlayer();
        $(".wp .cursors").removeClass("cursor-visible");
        PostUtil.isActive = false;

        const $textarea = PostUtil.$txtareaWrapper.find("textarea").first();
        $textarea.val("")
        PostUtil.Index["text"] = 0

        if (PostUtil.lineList.length === 0) {
            $(".wp-placeholder").show();
        }
    });

    $(".wp-sizer").on("click", event => {
        event.stopPropagation();
        const $placeholder = $(".wp-placeholder");
        if ($placeholder[0]) {
            $placeholder.hide();
        }

        PostUtil.mouseClickCursorMoveHandler(event.offsetX, event.offsetY)

        PostUtil.timerPlayer();
        PostUtil.isActive = true;

        const $textarea = PostUtil.$txtareaWrapper.find("textarea");
        $textarea.focus();
    })

    $(".wp-core").on("click", (event) => {
        const $placeholder = $(".wp-placeholder");
        if ($placeholder[0]) {
            $placeholder.hide();
        }

        PostUtil.mouseClickCursorInitializer(event.offsetY)

        PostUtil.timerPlayer();
        PostUtil.isActive = true;

        const $textarea = PostUtil.$txtareaWrapper.find("textarea");
        $textarea.focus();
    })


})

const init = () => {
    PostUtil.init($(".wp-textarea-wrapper"), $(".wp-code-draft span"), $(".wp-code .wp-line"), $(".wp-core .cursors .cursor"))

    const workplaceWidth = document.querySelector(".workplace-wrapper").offsetWidth;
    document.querySelector(".publish-footer").style.width = workplaceWidth + 'px';

    // initialize cursor size
    const lineHeight = parseFloat($(".wp-placeholder").css("line-height"));
    PostUtil.$cursor.css("height", lineHeight + "px");
    PostUtil.$txtareaWrapper.css("top", $(".wp-textarea-wrapper").height() + "px");
}

const initObserver = () => {
    const targetNode = document.querySelector('.wp-code-draft span');
    const config = { attributes: true, attributeOldValue: true }

    const callback = function (mutationList, observer) {
        for (let mutation of mutationList) {
            if (mutation.type === "attributes") {
                console.log("속성이 변경되었습니다.", mutation.attributeName);
                break;
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
}