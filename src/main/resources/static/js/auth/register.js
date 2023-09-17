$(() => {
    $(".registerBtn").on("click", (e) => {
        e.preventDefault();

        $.ajax({
            url: "/api/auth/join.json",
            type: "POST",
            data: $("#joinForm").serialize(),
            dataType: "json",
            success: (res) => {
                alert("회원 가입에 성공했습니다.");
                location.href = "/login";
            },
            error: (error) => {
                alert("회원 가입에 실패했습니다.");
                console.error(error.code);
                location.href = "/register";
            }
        });
    })
})