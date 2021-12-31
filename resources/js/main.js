
function updateImages(images) {
    imageElementsWrapper.innerHTML = '';

    images.map((image) => {
        const thumbnailWrapper = document.createElement('div'); 
        thumbnailWrapper.classList.add('thumbnailWrapper');

        const label = document.createElement('label');
        const filename = image.split('/');
        let dateParts = filename[filename.length-1].split('.jpg').join('').split('-');
        let date = new Date(`${dateParts[0]}-${dateParts[1]}-${dateParts[2]}T${dateParts[3]}:${dateParts[4]}`);

        label.innerHTML = `${date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit' })}`;

        const imageElement = new Image();
        imageElement.src = image;
        imageElement.onload = () => {
            thumbnailWrapper.appendChild(label);
        }
        imageElement.onerror = () => {
            if (thumbnailWrapper) {
                thumbnailWrapper.parentNode.removeChild(thumbnailWrapper);
            }
        }
        thumbnailWrapper.appendChild(imageElement);

        imageElementsWrapper.appendChild(thumbnailWrapper);
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
            time.innerHTML = `${data.hour}:${data.minute}`;
            
            document.title = `Every Day at ${data.hour}:${data.minute}`;
        break;
        case 'sun':
            const label = document.querySelector(`button#${data.type}`).innerHTML;
            time.innerHTML = `${label.toUpperCase()}`;

            document.title = `Every Day at ${label[0].toUpperCase()}${label.slice(1)}`;
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

sliders.ontouchstart = function() {
    sliders.classList.remove('disabled');
}

getImagesForTimeOfDay();