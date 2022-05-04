import CROPS from './crops';
import { farmListDom,farmCountDom, farmReadytDom, farmStartedDom, regex, selectAllFarmsDom } from './consts';
import { timerCalculate, updateFarmCount } from './misc';

export function findFarm(id, arr) {
    let farm = null;
    arr.forEach((item, index) => {
        if (id == item.number) {
            farm = {
                farm: item,
                i: index
            }
            return;
        }
    });
    return farm;
}



export function openFarm(farmNumber) {
    window.open(`https://play.pixels.online/farm${farmNumber}`, "_blank");
}

export function updateFarmDom(farmToUpdate, data, farms) {
    let farm = farmToUpdate;
    let prevCrop = farm.crop;
    let farmColor = data.farmColor == 'null' ? null : data.farmColor;
    let farmDom = document.getElementById(farm.number);
    let nextDomE = farmDom.nextElementSibling;


    //update farm in the arr (type and startTimer)
    if (data.type != undefined) {
        farm.crop = CROPS[data.type];
        let cropTimer = farm.crop.sproutTime;
        farm.startTime = null;
        farm.timer = null;
    }

    farm.info.color = farmColor == null ? farm.info.color : farmColor;
    farm.info.notes = data.farmNotes;


    //save in local localStorage
    localStorage.setItem("farms", JSON.stringify(farms));

    //build dom tree
    farmDom.remove();
    farmListDom.insertBefore(createFarmNode(farm), nextDomE)

}


export function createFarmNode(farm) {
    var tag = document.createElement("div");
    tag.classList.add('farm');
    tag.setAttribute('id', farm.number);
    tag.setAttribute('data-id', farm.number);

    let cropName = farm.crop.name.toLowerCase();
    let cropTimer;

    let colorDom = farm.info.color == undefined || farm.info.color == null ? '' : `<div class="color" style="background-color: ${farm.info.color};"></div>`
    let notesDom = farm.info.notes == undefined || farm.info.notes == '' ? '' : ` <div class="info"><svg fill="#000000" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="24px" height="24px">    <path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 11 7 L 11 9 L 13 9 L 13 7 L 11 7 z M 11 11 L 11 17 L 13 17 L 13 11 L 11 11 z"/></svg><div class="content"><p>${farm.info.notes}</p></div></div>`
    // console.log(farm);

    // if crop timer was started, use it

    if (farm.startTime != undefined && farm.startTime != null) {
        cropTimer = {
            hours: '',
            minutes: '',
            seconds: ''
        }

    } else {
        cropTimer = farm.crop.sproutTime;
    }

    tag.innerHTML = `<input type="checkbox" id="check-${farm.number}" name="select-farm" class="select-farm">
        <label for="check-${farm.number}"><h4>Farm ${farm.number}</h4></label>
        <div class="crop-type ${cropName}"></div>
        <div class="timer">${cropTimer.hours == 0 ? '00' : cropTimer.hours}:${cropTimer.minutes == 0 ? '00' : cropTimer.minutes}:${cropTimer.seconds == 0 ? '00' : cropTimer.seconds}</div>

        <div class="notes">
            ${colorDom}
            ${notesDom}
        </div>

        <div class="ui">
            <button class="delete-farm btn-icon" title="Delete Farm">
                <img src="/assets/images/icons/trash.png" alt="Delete Farm">
            </button>
            <button class="edit-farm btn-icon" title="Edit Farm">
                <img src="/assets/images/icons/edit.png" alt="Edit Farm">
            </button>
            <button class="open-farm btn-icon" title="Open Farm">
                <img src="/assets/images/icons/link.png" alt="Open Farm">
            </button>
            <button class="start-farm btn-icon" title="Start Farm">
                <img src="/assets/images/icons/stopwatch.png" alt="Start Farm">
            </button>
        </div>`;

    return tag;

}


export function continueFarmTimer(farm) {
    let farmDom = document.getElementById(farm.number);
    let timerDom = farmDom.querySelector('.timer');
    let now = Date();

    let farmTimer = timerCalculate(now, farm.startTime, farm.crop.sproutTime);

    //saving timer pointer in farm
    if (
        (Math.sign(farmTimer.hours) == 0 || Math.sign(farmTimer.hours) == -1) &&
        (Math.sign(farmTimer.minutes) == 0 || Math.sign(farmTimer.minutes) == -1) &&
        (Math.sign(farmTimer.seconds) == 0 || Math.sign(farmTimer.seconds) == -1)
    ) {
        farmDom.classList.add('completed');
        timerDom.innerHTML = '00:00:00';
        return
    }

    let timer = new easytimer.Timer();
    farm.timer = timer;
    farmDom.querySelector('.start-farm').disabled = true;

    // timer.start({ countdown: true, startValues: {seconds: 10} });
    timer.start({ countdown: true, startValues: farmTimer });

    timer.addEventListener('secondsUpdated', function (e) {
        timerDom.innerHTML = timer.getTimeValues().toString();
    });

    farmDom.classList.add('started');

    timer.addEventListener('targetAchieved', function (e) {
        farmDom.querySelector('.start-farm').disabled = false;
        farmDom.classList.add('completed');
        farmDom.classList.remove('started');
    });
}

export function addFarm(form, farms, dev = false) {

    let crop = CROPS[form.type]

    var match = regex.exec(form.farmNumber);
    let number = match == null ? form.farmNumber : match[0];

    //errOr handling
    if (isNaN(number * 1)) {
        return showError('Invalid Farm');
    } else if ((number * 1) > 5000 || (number * 1) < 0) {
        return showError('Invalid Farm');
    } else if (farms.length > 0 && findFarm(number, farms) != null) {
        return showError('Farm already exists');
    }

    //regex url

    let farm = {
        number: number,
        crop: crop,
        timer: null,
        startTime: null,
        info: {
            color: form.farmColor == 'null' ? null : form.farmColor,
            notes: form.farmNotes
        }
    }

    farms.push(farm);
    updateFarmCount(farms);

    //reset form fields
    document.getElementById('farmNumber').value = ''
    document.getElementById('farm-notes').value = ''
    document.getElementById('farmNumber').focus

    if (farms.length > 1) {
        selectAllFarmsDom.disabled = false;
    }

    localStorage.setItem("farms", JSON.stringify(farms));

    if (dev) {
        console.log('farms after add: ', farms);
    }

    //create dom element and add it
    farmListDom.appendChild(createFarmNode(farm));
}
