(() => {
 
  "use strict"; // Strict mode prevents you from using undeclared variables
  let prevZoom; // Declare the current zoom status


  // Get the resize window message to reset zoom back to the original
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    throw new Error("ggg");
    if (request.message !== "resize")
      return;
    chrome.tabs.setZoom(prevZoom);
  });


  //Do the stuff
  document.getElementById("greenButton").addEventListener("click", () => {
    
    // Zoom in
    chrome.tabs.getZoom().then((zoom) => {
      prevZoom = zoom; // Get the current zoom status
      chrome.tabs.setZoom(5); // Increase the zoom to enhance quality
    });

    // Fetch the active tabs
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, (tabs) => {
      //Execute the JSZip library and download.js
      chrome.scripting.executeScript({
        target: {
          tabId: tabs[0].id,
          allFrames: false
        },
        files: [`jszip.min.js`, `download.js`],
      });
    });

    //Close the window immediately after clicking
    window.close();
  });


})();