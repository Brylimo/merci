$(() => {
    $(".modal-close").on("click", () => {
        $(".modal").removeClass("modal-show");
        $(".modal").addClass("modal-none");
    })

    $(".modal-close2").on("click", () => {
        $(".modal-wrapper2").removeClass("modal-show");
        $(".modal-wrapper2").addClass("modal-none");
    })
});