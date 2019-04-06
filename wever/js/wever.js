$(function () {
    setInterval(() => {
        const parentWidth = parseInt($("#before-after-example").parent().css("width"))
        $("#before-after-example").css("width", parentWidth)
    }, 100)
})