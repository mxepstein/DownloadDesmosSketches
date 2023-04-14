  const sendMessageButton = document.getElementById("greenButton");
  sendMessageButton.onclick = async function(e) {
      let queryOptions = { active: true, currentWindow: true };
      let tab = await chrome.tabs.query(queryOptions);
      var prevZoom;


      // Zoom in
      chrome.tabs.getZoom().then((zoom) => {
          prevZoom = zoom; // Get the current zoom status
          chrome.tabs.setZoom(5).then(() => {


            //////////////////////////////////
               chrome.tabs.sendMessage(
                  tab[0].id, {
                      message: "doStuff",
                  },
                  function(response) {
                      chrome.tabs.setZoom(0.1);
                  }
              );
              ////////////////////////////////


          });
      });




     
      //Could the message just be sent here instead?

      //window.close();

  };