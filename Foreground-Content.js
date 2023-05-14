// This script gets injected into any opened page
// whose URL matches the pattern defined in the manifest
// (see "content_script" key).
// Several foreground scripts can be declared
// and injected into the same or different pages.

chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
    if (request.message === "Please get the sketches and download the zip") {
        const start = performance.now();
        await runDoStuff();
        const end = performance.now();
        console.log(`runDoStuff() took ${end - start} milliseconds to complete.`);
        sendResponse({ status: "done" });
    }
});

async function runDoStuff() {

    "use strict"; // Strict mode prevents undeclared variables from being used

    //Initialize zip object and create images folder
    const zip = new JSZip(); // initialize   ip object (called in popup.js)
    const images = zip.folder("sketches");
    const backgrounds = zip.folder("backgrounds");

    //Get the sketches and create files
    const canvases = document.getElementsByClassName("sketch-surface");
    if (canvases.length == 0) return { status: "failure", message: "No sketches on this page" };;
    for (let i = 0; i < canvases.length; i++) {
        images.file(`sketch-${i}.png`, ctoi(canvases[i]));
    }


    // Get the background images
    const divs = document.getElementsByClassName("image-background-div");
    const imageUrls = []; // Array to store all image URLs
    for (let div of divs) {
        const computedStyle = window.getComputedStyle(div);
        const backgroundImage = computedStyle.backgroundImage;
        const imageUrl = backgroundImage
            .replace(/^url\(["']?/, "")
            .replace(/["']?\)$/, "");
        imageUrls.push(imageUrl); // Add each image URL to the array
    }


    //Save the number of canvases so that the gallery can know how many to show
    var tinyScript = "var numberOfImages=" + canvases.length + ";";
    var tinyBlob = new Blob([tinyScript], { type: 'text/javascript' });
    zip.file('/other/numberOfImages.js', tinyBlob);

    //Prepare gallery template and the background image
    const files = [
        [chrome.runtime.getURL("galleryTemplate/index.html"), "index.html"],
        [chrome.runtime.getURL("galleryTemplate/script.js"), "other/script.js"],
        [chrome.runtime.getURL("galleryTemplate/style.css"), "other/style.css"],
    ];


    // Iterate over each image URL and create a file entry for it
    for (let i = 0; i < imageUrls.length; i++) {
        files.push([imageUrls[i], `backgrounds/background-${i}.png`]);
    }


    let requests = [];
    files.forEach(([url, fileName]) => {
        requests.push(
            fetch(url)
            .then((response) => response.blob())
            .then((blob) => zip.file(fileName, blob))
        );
    });

    await Promise.all(requests); //Wait for all requests to complete

    //Generate the zip file and download it
    const content = await zip.generateAsync({ type: "blob" });
    var downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(content);
    downloadLink.download = "Desmos-Sketches-Gallery.zip";
    downloadLink.click();

    return { status: "success", message: "Zip file generated and downloaded" };
}


// canvas to image helper function
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