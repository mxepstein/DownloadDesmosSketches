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
