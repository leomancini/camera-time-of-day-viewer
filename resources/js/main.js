
function updateImages(images) {
    imageElementsWrapper.innerHTML = '';

    images.map((image) => {
        const imageElement = new Image();
        imageElement.src = image;
        imageElement.onerror = () => {
            imageElement.parentNode.removeChild(imageElement);
        }

        imageElementsWrapper.appendChild(imageElement);
    });

    imageElementsWrapper.classList.remove('loading');
    loadingSpinner.classList.remove('loading');
}

function getImagesForTimeOfDay() {
    let hour = zeroPad(parseInt(hourOutput.innerHTML), 2);
    let minute = zeroPad(parseInt(minuteOutput.innerHTML), 2);

    imageElementsWrapper.classList.add('loading');
    loadingSpinner.classList.add('loading');
    
    fetch(
        `getImagesForTimeOfDay.php?h=${hour}&m=${minute}`
    ).then(
        response => response.json()
    ).then(
        images => {
            updateImages(images);
        }
    ).catch((error) => {
        console.error('Error:', error);
    });

    updateTitle('time', { hour, minute });
}

function getImagesForSunTime(type) {
    imageElementsWrapper.classList.add('loading');
    loadingSpinner.classList.add('loading');
    sliders.classList.add('disabled');

    fetch(
        `getImagesForSunTime.php?type=${type}`
    ).then(
        response => response.json()
    ).then(
        images => {
            updateImages(images);
        }
    ).catch((error) => {
        console.error('Error:', error);
    });

    updateTitle('sun', { type });
}

function updateTitle(type, data) {
    const time = document.querySelector('#time');

    switch (type) {
        case 'time':
            document.title = `Every Day at ${data.hour}:${data.minute}`;

            time.innerHTML = `${data.hour}:${data.minute}`;
        break;
        case 'sun':
            document.title = `Every Day at ${data.type[0].toUpperCase()}${data.type.slice(1)}`;

            const label = document.querySelector(`button#${data.type}`).innerHTML;
            time.innerHTML = `${label.toUpperCase()}`;
        break;
    }
}

function zeroPad(num, places) {
    return String(num).padStart(places, '0'); // From https://stackoverflow.com/a/2998874
}

const imageElementsWrapper = document.querySelector('#images');
const loadingSpinner = document.querySelector('#spinner');

const sliders = document.querySelector('#sliders');
const hourSlider = document.querySelector('.slider#hour');
const minuteSlider = document.querySelector('.slider#minute');

const hourOutput = document.querySelector('.output#hour');
const minuteOutput = document.querySelector('.output#minute');

hourOutput.innerHTML = hourSlider.value;
minuteOutput.innerHTML = minuteSlider.value;

hourSlider.oninput = function() {
    hourOutput.innerHTML = this.value;

    getImagesForTimeOfDay();
}

minuteSlider.oninput = function() {
    minuteOutput.innerHTML = this.value;

    getImagesForTimeOfDay();
}

document.querySelector('button#sunrise').onclick = function() {
    getImagesForSunTime('sunrise');
}

document.querySelector('button#sunset').onclick = function() {
    getImagesForSunTime('sunset');
}

document.querySelector('button#solar_noon').onclick = function() {
    getImagesForSunTime('solar_noon');
}

document.querySelector('button#civil_twilight_begin').onclick = function() {
    getImagesForSunTime('civil_twilight_begin');
}

document.querySelector('button#civil_twilight_end').onclick = function() {
    getImagesForSunTime('civil_twilight_end');
}

sliders.onmouseover = function() {
    sliders.classList.remove('disabled');
}

getImagesForTimeOfDay();