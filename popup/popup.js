const sendMessageButton = document.getElementById("greenButton");

sendMessageButton.onclick = async function(e) {
    //Check if you are even on the right webpage
    let tabb = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = tabb[0].url;
    if (!url.match(/^https:\/\/teacher\.desmos\.com\/dashboard\//)) {
        //console.error("This is not a Desmos teacher dashboard page.");
        return;
    }



    //Zoom in and send a message to do the stuff
    let queryOptions = { active: true, currentWindow: true };
    let tab = await chrome.tabs.query(queryOptions);
    var prevZoom;
    await chrome.tabs.getZoom().then(async (zoom) => {
        prevZoom = zoom; // Get the current zoom status
        await chrome.tabs.setZoom(5).then(async () => {
            await chrome.tabs.sendMessage(
                tab[0].id, {
                    message: "Please get the sketches and download the zip",
                }
            ).then(async (response) => {
                await chrome.tabs.setZoom(prevZoom);
            });
        });
    });


    /*
        //Zoom in and send a message to do the stuff
        let queryOptions = { active: true, currentWindow: true };
        let tab = await chrome.tabs.query(queryOptions);
        var prevZoom;
        chrome.tabs.getZoom().then((zoom) => {
            prevZoom = zoom; // Get the current zoom status
            chrome.tabs.setZoom(5).then(() => {
                //////////////////////////////////
                chrome.tabs.sendMessage(
                    tab[0].id, {
                        message: "Please get the sketches and download the zip",
                    }
                ).then((response) => {
                    chrome.tabs.setZoom(prevZoom);
                    window.close();
                });
                ////////////////////////////////
            });
        });
    */

    /* old snippet
    //Zoom in and send a message to do the stuff
    let queryOptions = { active: true, currentWindow: true };
    let tab = await chrome.tabs.query(queryOptions);
    var prevZoom;
    chrome.tabs.getZoom().then((zoom) => {
        prevZoom = zoom; // Get the current zoom status
        chrome.tabs.setZoom(5).then(() => {
            //////////////////////////////////
            chrome.tabs.sendMessage(
                tab[0].id, {
                    message: "Please get the sketches and download the zip",
                },
                function(response) {
                    chrome.tabs.setZoom(0.1);
                    window.close();
                }
            )
            ////////////////////////////////
        });
    });
*/

};