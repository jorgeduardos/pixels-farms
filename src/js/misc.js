import { farmListDom, farmCountDom, farmReadytDom, farmStartedDom, errorDom } from './consts';
import { findFarm } from './farm-helpers';

export function secondsToHourFormat(seconds){
    return new Date(seconds * 1000).toISOString().substr(11, 8).split(":");
}

export function handleTimerStart(timerDom, timer) {
    return function () {
        timerDom.innerHTML = timer.getTimeValues().toString();
    }
}

export function openPop(container) {
    container.classList.add('open');
}

export function closePop(container) {
    container.classList.remove('open');
}

export function updateFarmCount(arr) {
    let farmCount = arr.length;
    let farmsDom = farmListDom.querySelectorAll('.farm');
    let readyFarms = 0;
    let startedFarms = 0;

    farmCountDom.innerHTML = farmCount;

    farmsDom.forEach(farm => {
        if (farm.classList.contains('started')) {
            startedFarms++;
        } else if (farm.classList.contains('completed')) {
            readyFarms++;
        }
    })

    // console.log(readyFarms);

    farmReadytDom.innerHTML = readyFarms;
    farmStartedDom.innerHTML = startedFarms;

}

export function clearCheckBoxes(arr) {
    arr.forEach(element => {
        element.checked = false
    });

    // document.querySelector('.mass-edit-container .extra-buttons').classList.remove('show');
    // selectButton.classList.remove('all-selected');
    // selectButton.innerHTML = 'Select All';
}

export function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

export function importClean(data, fileType, farms) {
    let farmsToClean = [];
    let sameFarms = [];

    //chekc if data is of type string or array
    if (fileType == 'exported') {
        try {
            JSON.parse(data);
        } catch (e) {
            return showError('Invalid data');
        }

        farmsToClean = JSON.parse(data);

        if (farms == 0) {
            localStorage.setItem("farms", JSON.stringify(farmsToClean));
            window.location.reload();
        }

        for (var i = farmsToClean.length - 1; i >= 0; i--) {
            if (findFarm(farmsToClean[i].number, farms) != null) {
                sameFarms.push(farmsToClean[i]);
                farmsToClean.splice(i, 1);
            }
        }

        farms = farms.concat(farmsToClean)

        // if(sameFarms.length > 0){
        //     showError('Duplicated farms were ommited', 1);
        // }

        localStorage.setItem("farms", JSON.stringify(farms));
        window.location.reload();

    } else {
        data.split(/\r?\n/).forEach(link => {
            var match = regex.exec(link);
            if (match != null) {
                let farm = {
                    number: match[0],
                    crop: CROPS[0],
                    timer: null,
                    startTime: null,
                }

                farmsToClean.push(farm);
            }

        })

        if (farms == 0) {
            localStorage.setItem("farms", JSON.stringify(farmsToClean));
            window.location.reload();
        }

        for (var i = farmsToClean.length - 1; i >= 0; i--) {
            if (findFarm(farmsToClean[i].number, farms) != null) {
                sameFarms.push(farmsToClean[i]);
                farmsToClean.splice(i, 1);
            }
        }

        farms = farms.concat(farmsToClean)
        localStorage.setItem("farms", JSON.stringify(farms));
        window.location.reload();
    }

}

export function cleanEditForm(form) {
    // let textarea = form.querySelector('textarea');
    let colorPickerButton = form.querySelector('.add-color');

    let colorIndicator = form.querySelector('.color-indicator div');
    let colorInputDom = form.querySelector('input[type=color]');

    // textarea.value = '';

    colorInputDom.setAttribute('data-color', '')
}

export function showError(errorMessage, errorCode) {
    errorDom.querySelector('p').innerHTML = errorMessage;

    if (errorCode == 0) {
        errorDom.classList.add('show', 'error');
    } else if (errorCode == 1) {
        errorDom.classList.add('show', 'warning');
    } else {

        errorDom.classList.add('show', 'error');
    }

    setTimeout(function () {
        errorDom.classList.remove('show', 'error', 'warning');
    }, 5000)
}