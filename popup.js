(() => {
  // not sure what use strict does
  "use strict";

  // basic getbyID stuff and if clicked
  let prevZoom;
  
  // get the resize window message to bring it back to original
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message !== "resize") return;
    chrome.tabs.setZoom(prevZoom);
  });

  document
    .getElementById("desmosDashboardDownload")
    .addEventListener("click", () => {
      // get the zoom and then
      chrome.tabs.getZoom().then((zoom) => {
        prevZoom = zoom;
        // increase the zoom to enhance quality
        chrome.tabs.setZoom(5);
        // fetch the active tabs
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          // execute the JSZip library and download.js
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id, allFrames: false },
            files: ["/jszip.min.js", "/download.js"],
          });
        });
      });


      // and close the window immediately after clicking
      window.close();
    });
})();
