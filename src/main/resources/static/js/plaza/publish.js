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

    $(".wp-textarea-wrapper textarea").on("keyup", (event) => {
        const $textarea = $(".wp-textarea-wrapper textarea");
        const $targetSpan = $(".wp-code .wp-line span");
        const $wpWrapper = $(".wp-textarea-wrapper");
        const $cursor = $(".wp-core .cursors .cursor")

        if (event.keyCode === 37) {
            $targetSpan.val().slice(0, -1);
        } else {
            $targetSpan.text($textarea.val());
        }

        $wpWrapper.css("left", $targetSpan.width() + "px");
        $cursor.css("left", $targetSpan.width() + "px");
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