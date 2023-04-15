const backgroundGridContainer = document.querySelector('.background-container .grid-container');
const foregroundGridContainer = document.querySelector('.foreground-container .grid-container');
for (let i = 0; i < numberOfImages; i++) {
  const backgroundImg = document.createElement('img');
  backgroundImg.src = `background.png`;
  backgroundGridContainer.appendChild(backgroundImg);
  const foregroundImg = document.createElement('img');
  foregroundImg.src = `images/image-${i}.png`;
  foregroundGridContainer.appendChild(foregroundImg);

    }

const toggleButton = document.getElementById('toggle-background');
toggleButton.addEventListener('click', function() {
  if (backgroundGridContainer.style.display === 'none') {
    backgroundGridContainer.style.display = 'grid';
  } else {
    backgroundGridContainer.style.display = 'none';
  }
});

const slider = document.getElementById('slider');
slider.addEventListener('input', function() {
  const value = this.value;
  document.documentElement.style.setProperty('--slider-value', value + 'px');
});


