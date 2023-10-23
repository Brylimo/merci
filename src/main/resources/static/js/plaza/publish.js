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
            const $textarea = $(".wp-textarea-wrapper textarea");
            const $targetSpan = $(".wp-code .wp-line span");

            if (event.keyCode === 13) { // enter
                const $wpCodeLine = $("<pre class='wp-line'><span></span></pre>");
                $(".wp-code").append($wpCodeLine);
            } else if (event.keyCode === 37) { // left arrow

            } else if (event.keyCode === 39) { // right arrow

            } else if (event.keyCode === 38) { // up arrow

            } else if (event.keyCode === 40) { // down arrow

            } else {
                $textarea.focus();
            }
        }
    });

    $(".wp-textarea-wrapper textarea").on("keydown", (event) => {
        const $textarea = $(".wp-textarea-wrapper textarea");
        const $targetSpan = $(".wp-code .wp-line span");
        const $wpWrapper = $(".wp-textarea-wrapper");
        const $wpDraftSpan = $(".wp-code-draft span");
        const $cursor = $(".wp-core .cursors .cursor")

        if (event.key === "Backspace") {

        }
    });

    $(".wp-textarea-wrapper textarea").on("input", (event) => {
        const $textarea = $(".wp-textarea-wrapper textarea");
        const $targetSpan = $(".wp-code .wp-line span");
        const $wpWrapper = $(".wp-textarea-wrapper");
        const $wpDraftSpan = $(".wp-code-draft span");
        const $cursor = $(".wp-core .cursors .cursor")

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

            $wpWrapper.css("left", parseInt($cursor.css("left"), 10) - width + "px");
            $cursor.css("left", parseInt($cursor.css("left"), 10) - width + "px");
        } else if (event.keyCode === 32) { // space bar
            if (BlogUtil.spaceCd === '01') {
                BlogUtil.spaceCd = '02';
                $targetSpan.text($textarea.val().trim());
                const $spaceA = $("<span class='space-a'> </span>");
                const $newLine = $("<span>&nbsp;</span>");

                $newLine.addClass("new-line");
                $targetSpan.parent().append($spaceA);
                $targetSpan.parent().append($newLine);

                let width = null;

                $wpDraftSpan.html('&nbsp;');
                width = $wpDraftSpan.get(0).offsetWidth;
                $wpDraftSpan.text('');

                $cursor.css("left", parseInt($cursor.css("left"), 10) + width + "px");

            } else if (BlogUtil.spaceCd === '02') {
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

                let width = null;

                $wpDraftSpan.html('&nbsp;');
                width = $wpDraftSpan.get(0).offsetWidth;
                $wpDraftSpan.text('');

                $cursor.css("left", parseInt($cursor.css("left"), 10) + width + "px");
            } else {
                if (BlogUtil.spaceCd === '02') {
                    
                }

                BlogUtil.spaceCd = '01';
                const fontSize = $targetSpan.css("font-size");
                $wpDraftSpan.css("font-size", fontSize);
                let width = null;

                $wpDraftSpan.html('&nbsp;');
                width = $wpDraftSpan.get(0).offsetWidth;

                $wpDraftSpan.text('');

                $targetSpan.text($textarea.val().charAt(BlogUtil.tIndex));
                BlogUtil.tIndex++;

                $cursor.css("left", parseInt($cursor.css("left"), 10) + width + "px");
                $wpWrapper.css("left", parseInt($cursor.css("left"), 10) + width + "px");
            }
        } else {
            BlogUtil.spaceCd = '00';
            let lastChar = $textarea.val().charAt($textarea.val().length - 1);
            const fontSize = $targetSpan.css("font-size");
            $wpDraftSpan.css("font-size", fontSize);

            $wpDraftSpan.text(lastChar);
            let width = $wpDraftSpan[0].getBoundingClientRect().width;
            $wpDraftSpan.text('');

            if (BlogUtil.containsKorean(lastChar)) {
                if ($textarea.val().length - BlogUtil.cIndex) {
                    $targetSpan.text($targetSpan.text().slice(0, BlogUtil.tIndex) + $textarea.val().slice(BlogUtil.tIndex));

                    $cursor.css("left", parseFloat($cursor.css("left")) + width + "px");
                    $wpWrapper.css("left", parseFloat($wpWrapper.css("left")) + width + "px");
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

                $cursor.css("left", parseFloat($cursor.css("left")) + width + "px");
                $wpWrapper.css("left", parseFloat($wpWrapper.css("left")) + width + "px");
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
    })

    init();
})

const init = () => {
    const workplaceWidth = document.querySelector(".workplace-wrapper").offsetWidth;
    document.querySelector(".publish-footer").style.width = workplaceWidth + 'px';

    const $wpWrapper = $(".wp-textarea-wrapper");
    $wpWrapper.css("top", $(".wp-textarea-wrapper").height() + "px");
}