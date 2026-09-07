(function () {
  var input = document.getElementById("qr-url");
  var preview = document.getElementById("qr-preview");
  var download = document.getElementById("qr-download");
  var blobUrl = "";

  function normalize(raw) {
    var s = raw.trim();
    if (!s) return "";
    try {
      return new URL(s).href;
    } catch (e) {
      try {
        return new URL("https://" + s).href;
      } catch (e2) {
        return s;
      }
    }
  }

  function filename(value) {
    try {
      var host = new URL(value).hostname.replace(/^www\./, "");
      return host ? host + ".svg" : "qr.svg";
    } catch (e) {
      return "qr.svg";
    }
  }

  function clear() {
    preview.replaceChildren();
    preview.hidden = true;
    download.hidden = true;
    download.removeAttribute("href");
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      blobUrl = "";
    }
  }

  function render() {
    var value = normalize(input.value);
    if (!value) {
      clear();
      return;
    }

    QRCode.toString(
      value,
      {
        type: "svg",
        errorCorrectionLevel: "H",
        margin: 2,
        width: 1024,
        color: { dark: "#000000", light: "#ffffff" },
      },
      function (err, svg) {
        if (err || !svg) {
          clear();
          return;
        }

        preview.innerHTML = svg;
        preview.hidden = false;

        if (blobUrl) URL.revokeObjectURL(blobUrl);
        blobUrl = URL.createObjectURL(
          new Blob([svg], { type: "image/svg+xml;charset=utf-8" })
        );
        download.href = blobUrl;
        download.download = filename(value);
        download.hidden = false;
      }
    );
  }

  input.addEventListener("input", render);
  input.addEventListener("paste", function () {
    requestAnimationFrame(render);
  });
})();
