import { farmListDom, farmCountDom, farmReadytDom, farmStartedDom } from './consts';

export function timerCalculate(fDate, oDate, sproutTimer) {
    // get total seconds between the times
    let futureDate = new Date(fDate);
    let oldDate = new Date(oDate);

    var delta = Math.abs(futureDate - oldDate) / 1000;

    // calculate (and subtract) whole hours
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    var seconds = delta % 60;  // in theory the modulus is not required

    //create date with sprout timer
    var sproutDate = new Date(1994, 4, 20, sproutTimer.hours, sproutTimer.minutes, sproutTimer.seconds, 0);
    //create date with time that has passes since start
    var startDate = new Date(1994, 4, 20, hours, minutes, seconds, 0);

    var newTimer = sproutDate.getTime() - startDate.getTime();

    var nseconds = ~~(newTimer / 1000);
    var nhour = ~~(nseconds / 60 / 60);
    var nmin = ~~((nseconds - 60 * 60 * nhour) / 60);
    nseconds = ~~(((nseconds - 60 * 60 * nhour) - nmin * 60));

    return {
        hours: nhour,
        minutes: nmin,
        seconds: nseconds
    }
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

export function clearCheckBoxes(arr, selectButton) {
    arr.forEach(element => {
        element.checked = false
    });

    document.querySelector('.mass-edit-container .extra-buttons').classList.remove('show');
    selectButton.classList.remove('all-selected');
    selectButton.innerHTML = 'Select All';
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

export function importClean(data, fileType) {
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

        if (FARMS == 0) {
            localStorage.setItem("farms", JSON.stringify(farmsToClean));
            window.location.reload();
        }

        for (var i = farmsToClean.length - 1; i >= 0; i--) {
            if (findFarm(farmsToClean[i].number, FARMS) != null) {
                sameFarms.push(farmsToClean[i]);
                farmsToClean.splice(i, 1);
            }
        }

        FARMS = FARMS.concat(farmsToClean)

        // if(sameFarms.length > 0){
        //     showError('Duplicated farms were ommited', 1);
        // }

        localStorage.setItem("farms", JSON.stringify(FARMS));
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

        if (FARMS == 0) {
            localStorage.setItem("farms", JSON.stringify(farmsToClean));
            window.location.reload();
        }

        for (var i = farmsToClean.length - 1; i >= 0; i--) {
            if (findFarm(farmsToClean[i].number, FARMS) != null) {
                sameFarms.push(farmsToClean[i]);
                farmsToClean.splice(i, 1);
            }
        }

        FARMS = FARMS.concat(farmsToClean)
        localStorage.setItem("farms", JSON.stringify(FARMS));
        window.location.reload();
    }

}

export function cleanEditForm(form) {
    let textarea = form.querySelector('textarea');
    let colorPickerButton = form.querySelector('.add-color');
    let colorParent = colorPickerButton.parentElement;
    let colorInputDom = colorParent.querySelector('input');

    textarea.value = '';

    colorParent.classList.remove('show')
    colorInputDom.setAttribute('data-color', null)
}