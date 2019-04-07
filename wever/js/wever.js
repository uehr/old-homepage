$(function () {
  setInterval(() => {
    const parentWidth = parseInt($("#before-after-example").parent().css("width"))
    $("#before-after-example").css("width", parentWidth)
    $("#image-preview").css("width", parentWidth * 0.7)

  }, 100)

  const personMosaicURL = "http://localhost/personMosaic"

  const imageToBase64 = (imgTagId, mimeType) => {
    const img = document.getElementById(imgTagId);

    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);

    alert(img.height + " " + img.width)

    const base64 = canvas.toDataURL(mimeType).split(",")[1]

    return base64
  }

  const isValidFile = file => {
    if (file.type.indexOf("image") < 0) {
      alert("画像ファイルを指定してください。")
      return false
    }

    return true
  }

  const showFileUploader = () => {
    $("#file-upload").hide().fadeIn(2000)
    $("#file-select").hide()
  }

  const uploadImagePreview = src => {
    $("#file-select-input").attr("value", "")
    $("#image-preview").attr("src", src)
    $("#upload-image").attr("src", src)
    showFileUploader()
  }

  const showFileSelecter = () => {
    $("#file-upload").hide()
    $("#file-select").hide().fadeIn(2000)
  }

  const personMosaic = base64Img => {
    const json = { "base64Img": base64Img }
    const body = JSON.stringify(json)
    const method = "POST";
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    return fetch(personMosaicURL, { method, headers, body })
  }

  $("#back-button").click(() => {
    showFileSelecter()
  })

  $("#upload-button").click(() => {
    const base64Img = imageToBase64("upload-image", "image/jpg")

    personMosaic(base64Img).then(res => {
      if (res.status !== 200) {
        alert("処理に失敗しました")
      } else {
        res.json().then(processed => {
          $("#upload-image").attr("src", processed.base64Img)
        })
      }
    }).catch(error => {
      alert("処理に失敗しました")
    })
  })

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

  droppable.bind("drop", handleDroppedFile)
})