(function () {
  "use strict";

  const startImages = () => {
    const zip = new JSZip();
    const images = zip.folder("images");
    const canvases = document.getElementsByClassName("sketch-surface");

    if (canvases.length == 0) return;
    for (let i = 0; i < canvases.length; i++) {
      images.file(`image-${i}.png`, ctoi(canvases[i]));
    }

    zip.file(
      "index.html",
      `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Two Images on Top of Each Other BRUH</title>
        <link rel="stylesheet" href="index.css" />
      </head>
      <body>
        <img id="image1">
        <img id="image2">
        <div style="margin-bottom:665px"></div>
        <button style="margin-left:50px; padding:50px;"onclick="decrementCounter()">Previous</button>
        <button style="padding:50px;"onclick="onOff()">On/Off</button>
        <button style="padding:50px;"onclick="incrementCounter()">Next</button>
        <script src="script.js"></script>
      </body>
      </html>      
      `
    );

    zip.file(
      "index.css",
      `
      html {
        height: 100%;
        width: 100%;
      }
      
      #image1,
      #image2 {
        position: absolute;
        top: 15px;
        left: 25px;
        width: 650px;
        height: 650px;
      }
      
      #image2 {
        z-index: -1;
      }

      #image2.hidden {
        display: none;
      }
      `
    );

    zip.file(
      "script.js",
      `
      let counter = 2; // initialize the counter variable
      let isOn = false;
      document.getElementById("image2").src = "og.png";
  
      function onOff() {
        if (isOn == false) {
          isOn = true;
          document.getElementById("image2").className = "";
        } else {
          isOn = false;
          document.getElementById("image2").className = "hidden";
        }
      }
      function incrementCounter() {
        counter++; // increment the counter variable
        var imagePath1 = "images/image-" + counter + ".png";
        document.getElementById("image1").src = imagePath1;
      }
  
      function decrementCounter() {
        if (counter > 0) counter--; // decrement the counter variable
        var imagePath1 = "images/image-" + counter + ".png";
        document.getElementById("image1").src = imagePath1;
      }
  
      decrementCounter();
      onOff();
      `
    );

    var div = document.getElementsByClassName("image-background-div")[0];
    var computedStyle = window.getComputedStyle(div);
    var backgroundImage = computedStyle.backgroundImage;

    var imageUrl = backgroundImage
      .replace(/^url\(["']?/, "")
      .replace(/["']?\)$/, "");

    const files = [[imageUrl, "og.png"]];
    let requests = [];

    files.forEach(([url, fileName]) => {
      requests.push(
        fetch(url)
          .then((response) => response.blob())
          .then((blob) => zip.file(fileName, blob))
      );
    });

    Promise.all(requests).then(() => {
      zip.generateAsync({ type: "blob" }).then((content) => {
        console.log(3);
        var downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(content);
        downloadLink.download = "canvases.zip";
        downloadLink.click();
      });
    });

    console.log(2);
  };

  // canvas to image
  const ctoi = (canvas) => {
    const dataURL = canvas.toDataURL("image/png");
    const byteCharacters = atob(dataURL.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/png" });
    return blob;
  };
  startImages();
})();
