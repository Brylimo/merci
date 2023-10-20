$(() => {
    window.addEventListener('resize', function () {
        console.log("zpzp");
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
    })

    $(".workplace-wrapper .workplace .wp textarea").on("keyup", function (event) {
        $(".preview-wrapper .workplace span").text(event.target.value);
    })
})