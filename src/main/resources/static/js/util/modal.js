$(() => {
    $(".modal-close").on("click", () => {
        $(".modal").removeClass("modal-show");
        $(".modal").addClass("modal-none");
    })

});