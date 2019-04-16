$(function () {
  setInterval(() => {
    const parentWidth = parseInt($("#before-after-example").parent().css("width"))
    const parentHeight = parseInt($("#before-after-example").parent().css("height"))

    $("#before-after-example").css("width", parentWidth)
    $("#image-preview").css("width", parentWidth)
    $("#upload-ui").css("width", parentWidth)
  }, 100)

  $("#image-process-ui").hide()
  $("#processing-view").hide()

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
      alert("画像ファイルを選択してください")
      return false
    } else if (!file.name.match(".jpg|.jpeg|.png")) {
      alert("JPEG/PNG形式のファイルを選択してください")
      return false
    }

    return true
  }

  const showFileUploader = () => {
    $("#file-upload").hide().fadeIn(1000)
    $("#file-select").hide()
  }

  const showUploadImagePreview = src => {
    $("#file-select-input").attr("value", "")
    $("#image-preview").attr("src", src)
    $("#upload-image").attr("src", src)
    $("#download-button").hide()
    $("#upload-button").hide().fadeIn(500)

    showFileUploader()

    setTimeout(() => {
      $("html,body").animate({ scrollTop: $("#upload-ui").offset().top }, 1000);
    }, 100)
  }

  const showFileSelecter = () => {
    $("#file-upload").hide()
    $("#image-process-ui").hide()
    $("#file-select").hide().fadeIn(1000)
  }

  const startProcessingView = () => {
    $("#processing-view").show()
    $("#image-preview").css("opacity", 0.3)
  }

  const finishProcessingView = () => {
    $("#processing-view").hide()
    $("#image-preview").css("opacity", 1)
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

  const fileDownload = (src, name) => {
    const a = document.createElement('a');
    a.href = src;
    a.download = name;

    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  $("#download-button").click(() => {
    const src = $("#processed-image").attr("src")
    const blob = dataURIToBlob(src);
    const objUrl = URL.createObjectURL(blob);
    const downloadFileName = selectedFileName.replace(".jpg", "-mosaic.jpg").replace(".jpeg", "-mosaic.jpeg").replace(".png", "-mosaic.png")

    fileDownload(objUrl, downloadFileName)
  })

  $("#upload-button").click(() => {
    startProcessingView()

    const base64Img = imageToBase64("upload-image", "image/jpg")

    personMosaic(base64Img).then(res => {
      if (res.status !== 200) {
        alert("処理に失敗しました")
        finishProcessingView()
      } else {
        res.json().then(processed => {
          const src = "data:image/jpg;base64," + processed.base64Img

          $("#image-preview").attr("src", src)
          $("#processed-image").attr("src", src)
          $("#upload-button").hide()
          $("#download-button").hide().fadeIn(500)

          setTimeout(() => {
            finishProcessingView()
          }, 100)
        })
      }
    }).catch(error => {
      alert("処理に失敗しました")
      finishProcessingView()
    })
  })

  $("input[type=file]").change(function () {
    const file = this.files[0]
    const fr = new FileReader()
    selectedFileName = file.name

    if (file == null || !isValidFile(file)) return false

    fr.onload = (function (file) {
      return function (e) { showUploadImagePreview(e.target.result) }
    })(file)

    fr.readAsDataURL(file)
  })


  if (!window.FileReader) {
    alert("File API がサポートされていません。")
    return false
  }

  const cancelEvent = event => {
    event.preventDefault()
    event.stopPropagation()
    return false
  }

  const handleDroppedFile = event => {
    var file = event.originalEvent.dataTransfer.files[0]
    var fr = new FileReader()

    if (!isValidFile(file)) return false

    fr.onload = (function (file) {
      return function (e) { showUploadImagePreview(e.target.result) }
    })(file)

    fr.readAsDataURL(file)

    cancelEvent(event)
    return false
  }

  const droppable = $("#file-select")
  droppable.bind("dragenter", cancelEvent)
  droppable.bind("dragover", cancelEvent)
  droppable.bind("drop", handleDroppedFile)
})