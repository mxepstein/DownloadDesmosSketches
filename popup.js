(function () {
  "use strict";
  document
    .getElementById("desmosDashboardDownload")
    .addEventListener("click", function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id, allFrames: false },
          files: ["/jszip.min.js", "/download.js"],
        });
      });
      window.close();
    });
})();
