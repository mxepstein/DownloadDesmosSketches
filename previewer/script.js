// initialize state variables
let page = 0;
let counter = -1;
let wall = -1;
let isOn = false;
let loaded = false;

// get home elements to update
const variableImg = document.getElementById("image1");
const backgroundImg = document.getElementById("image2");
const navPages = document.getElementsByClassName("nav-container");
const slideshow = document.getElementById("slideshow");
const gallery = document.getElementById("gallery");
let galleryImgs = [];

const openSlideshow = () => {
  navPages[0].className = "nav-container active";
  navPages[1].className = "nav-container";
  gallery.className = "hidden";
  slideshow.className = "";
  page = 0;
};

const openGallery = () => {
  navPages[0].className = "nav-container";
  navPages[1].className = "nav-container active";
  gallery.className = "";
  slideshow.className = "hidden";
  page = 1;
};

// toggle visibility of the background image (og.png)
const onOff = () => {
  isOn = !isOn;
  const visibility = isOn ? "" : "hidden";
  backgroundImg.className = visibility;
};

// increments the counter state and updates the image
const incrementCounter = () => {
  counter++;
  const imagePath = "images/image-" + counter + ".png";
  variableImg.src = imagePath;
};

const decrementCounter = () => {
  if (counter > 0) counter--; // decrement the counter variable
  const imagePath = "images/image-" + counter + ".png";
  variableImg.src = imagePath;
};

const incrementGallery = () => {
  wall++;
  for (let i = 0; i < galleryImgs.length; i++) {
    const count = i + wall * galleryImgs.length;
    const imagePath = "images/image-" + count + ".png";
    galleryImgs[i].src = imagePath;
  }
};

const decrementGallery = () => {
  if (wall <= 0) return;
  wall--;
  for (let i = 0; i < galleryImgs.length; i++) {
    const count = i + wall * galleryImgs.length;
    const imagePath = "images/image-" + count + ".png";
    galleryImgs[i].src = imagePath;
  }
};

const initializeGallery = () => {
  const grid = document.getElementsByClassName("gallery-grid")[0];

  for (let i = 0; i < 18; i++) {
    const element = document.createElement("div");
    const image = document.createElement("img");
    element.className = "gallery-image-container";
    image.className = "gallery-image";
    galleryImgs.push(image);

    element.innerHTML = `<img class="gallery-source" src="og.png"/>`;
    grid.appendChild(element);
    element.appendChild(image);
  }
};

backgroundImg.src = "og.png";
initializeGallery();
incrementCounter();
incrementGallery();
openSlideshow();
onOff();
