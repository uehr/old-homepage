$(function () {
  setInterval(() => {
    const parentWidth = parseInt($("#before-after-example").parent().css("width"))
    $("#before-after-example").css("width", parentWidth)
    $("#upload-image-preview").css("width", parentWidth)
  }, 100)

  const isValidFile = file => {
    if (file.type.indexOf("image") < 0) {
      alert("画像ファイルを指定してください。")
      return false
    }

    return true
  }

  const uploadImagePreview = src => {
    $("#upload-image-preview").attr("src", src)
    $("#upload-image-preview").hide().fadeIn(2000)
    $("#file-upload").css("display", "none")
  }

  $("input[type=file]").change(function () {
    const file = this.files[0]
    const fr = new FileReader()

    if (file == null || !isValidFile(file)) return false

    fr.onload = (function (file) {
      return function (e) { uploadImagePreview(e.target.result) }
    })(file)

    fr.readAsDataURL(file)
  })

  var droppable = $("#file-upload")

  if (!window.FileReader) {
    alert("File API がサポートされていません。")
    return false
  }

  var cancelEvent = function (event) {
    event.preventDefault()
    event.stopPropagation()
    return false
  }

  droppable.bind("dragenter", cancelEvent)
  droppable.bind("dragover", cancelEvent)

  var handleDroppedFile = function (event) {
    var file = event.originalEvent.dataTransfer.files[0]
    var fr = new FileReader()

    if (!isValidFile(file)) return false

    fr.onload = (function (file) {
      return function (e) { uploadImagePreview(e.target.result) }
    })(file)

    fr.readAsDataURL(file)

    cancelEvent(event)
    return false
  }

  // ドロップ時のイベントハンドラを設定します.
  droppable.bind("drop", handleDroppedFile)
})