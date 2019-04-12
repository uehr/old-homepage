$(function () {
  setInterval(() => {
    const parentWidth = parseInt($("#before-after-example").parent().css("width"))
    const parentHeight = parseInt($("#before-after-example").parent().css("height"))
    $("#before-after-example").css("width", parentWidth)
    $("#image-preview").css("width", parentWidth)
  }, 100)

  $("#download-link").css("display", "none")
  $("#image-process-ui").hide()

  const personMosaicURL = "http://localhost/personMosaic"
  var selectedFileName = ""

  const imageToBase64 = (imgTagId, mimeType) => {
    const img = document.getElementById(imgTagId);

    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);

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
    $("#file-upload").hide().fadeIn(1000)
    $("#file-select").hide()
  }

  const uploadImagePreview = src => {
    $("#file-select-input").attr("value", "")
    $("#image-preview").attr("src", src)
    $("#upload-image").attr("src", src)
    showFileUploader()
    $("html,body").animate({ scrollTop: $(document).height() }, 1000);
    $("#download-link").css("display", "none")
    $("#image-process-ui").show()

    setTimeout(() => {
      $("#image-size").text($("#upload-image").height() + " × " + $("#upload-image").width())
    }, 100)
  }

  const showFileSelecter = () => {
    $("#file-upload").hide()
    $("#image-process-ui").hide()
    $("#file-select").hide().fadeIn(1000)
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


  const dataURIToBlob = (dataURI) => {
    var binStr = atob(dataURI.split(',')[1]),
      len = binStr.length,
      arr = new Uint8Array(len),
      mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    for (var i = 0; i < len; i++) {
      arr[i] = binStr.charCodeAt(i);
    }

    return new Blob([arr], {
      type: mimeString
    });
  }


  $("#upload-button").click(() => {
    const base64Img = imageToBase64("upload-image", "image/jpg")

    personMosaic(base64Img).then(res => {
      if (res.status !== 200) {
        alert("処理に失敗しました")
      } else {
        res.json().then(processed => {
          const downloadFileName = selectedFileName.replace(".jpg", "-mosaic.jpg").replace(".jpeg", "-mosaic.jpeg")
          const src = "data:image/jpg;base64," + processed.base64Img
          const blob = dataURIToBlob(src);
          const objUrl = URL.createObjectURL(blob);

          $("#image-preview").attr("src", src)
          $("#processed-image").attr("src", src)
          $("#download-link").attr("href", objUrl)

          $("#download-link").attr("download", downloadFileName)
          $("#download-link").css("display", "inline-block")
        })
      }
    }).catch(error => {
      alert("処理に失敗しました")
    })
  })

  $("input[type=file]").change(function () {
    const file = this.files[0]
    const fr = new FileReader()
    selectedFileName = file.name

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