(() => {
  // Strict mode prevents undeclared variables from being used
  "use strict";

  // initialize JSZip object (called in popup.js)
  const zip = new JSZip();
  // create a folder called images in that zip
  const images = zip.folder("images");

  // find all elements of class "sketch-surface" (all of them are canvases)
  // and should be implied to have the canvas tag
  const canvases = document.getElementsByClassName("sketch-surface");

  // if there are no canvases, don't proceed
  if (canvases.length == 0) return;
  // for each canvas, create a file in the image folder using "ctoi"
  for (let i = 0; i < canvases.length; i++) {
    images.file(`image-${i}.png`, ctoi(canvases[i]));
  }
  
  // after finished scraping canvases, resize window  
  chrome.runtime.sendMessage({
      //SENDING THIS MESSAGE CAUSES AN ERROR "Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist."
      message: "resize",
  });

  // find the "original background" element and extract the URL source
  const div = document.getElementsByClassName("image-background-div")[0];
  const computedStyle = window.getComputedStyle(div);
  const backgroundImage = computedStyle.backgroundImage;

  const imageUrl = backgroundImage
    .replace(/^url\(["']?/, "")
    .replace(/["']?\)$/, "");

  // list of files to download and put in zip
  // :: new change: can import from other files using runtime.GetURL
  const files = [
    [imageUrl, "og.png"],
    [chrome.runtime.getURL("previewer/index.html"), "index.html"],
    [chrome.runtime.getURL("previewer/script.js"), "script.js"],
    [chrome.runtime.getURL("previewer/index.css"), "index.css"],
  ];

  // create a list of requests and push all the URL fetches to that
  let requests = [];

  files.forEach(([url, fileName]) => {
    // fetch the URL image and store its blob
    requests.push(
      fetch(url)
      .then((response) => response.blob())
      .then((blob) => zip.file(fileName, blob))
    );
  });

  // after all the requests are done...
  Promise.all(requests)
    .then(() => zip.generateAsync({
      type: "blob"
    }))
    .then((content) => {
      // create a download link and click it
      var downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(content);
      downloadLink.download = "canvases.zip";
      downloadLink.click();
    });

  // canvas to image
  function ctoi(canvas) {
    // converts canvas element to DataURL
    const dataURL = canvas.toDataURL("image/png");
    // separate character bytes and get the number associated
    const byteCharacters = atob(dataURL.split(",")[1]);
    const byteNumber = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumber[i] = byteCharacters.charCodeAt(i);
    }
    // turn that into a byte array and return it as a png blob
    const byteArray = new Uint8Array(byteNumber);
    const blob = new Blob([byteArray], {
      type: "image/png"
    });
    return blob;
  }
})();