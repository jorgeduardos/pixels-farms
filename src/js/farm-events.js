import './vendors/easytimer.min';
import { handleTimerStart, openPop, secondsToHourFormat, updateFarmCount} from './misc';
import { findFarm, openFarm } from './farm-helpers';
import { selectAllFarmsDom, editPopUpDom, iframePop, mainGameUrl, farmUrl } from './consts';


export function startFarm(button, farms, localStorageKey) {
    // console.log('clicking start');
    let target = button;
    target.disabled = true;

    let farmDom = target.parentElement.parentElement;
    farmDom.classList.remove('completed');
    let farmFromArr = findFarm(farmDom.id, farms);
    let farm = farmFromArr.farm;

    let timerDom = farmDom.querySelector('.timer');
    let timer = new easytimer.Timer();

    //saving timer pointer in farm
    farm.timer = timer;
    farm.startTime = new Date().getTime()/1000;

    

    //saving farm in localStorage
    localStorage.setItem(localStorageKey, JSON.stringify(farms));

    let hourFormat = secondsToHourFormat(farm.crop.sproutTimeSeconds);

    // // timer.start({ countdown: true, startValues: {seconds: 10} });
    timer.start({ countdown: true, startValues: {hours: hourFormat[0], minutes: hourFormat[1], seconds: hourFormat[2]}});

    timer.addEventListener('secondsUpdated', handleTimerStart(timerDom, timer));
    farmDom.classList.add('started');

    timer.addEventListener('targetAchieved', function (e) {
        target.disabled = false;
        farmDom.classList.add('completed');
        farmDom.classList.remove('started');
        updateFarmCount(farms);
    });

    updateFarmCount(farms);

    return {
        farm: farm,
        farmDom: farmDom,
        farmIndex: farmFromArr.i
    }
}

export function deleteFarm(button, farms, localStorageKey, dev = false) {
    let target = button;
    let farmDom = target.parentElement.parentElement;
    let farm = findFarm(farmDom.id, farms);

    if (dev) {
        console.log('deleting farms ...')
        console.log('farm node to be deleted: ', farmDom);
        console.log('farm to be deleted: ', farm)
    }

    //remove farm from FARMS array
    farms.splice(farm.i, 1);

    if (farms.length == 0) {
        selectAllFarmsDom.disabled = true;
    }

    if (dev) {
        console.log('farms after delete: ', farms);
    }

    localStorage.setItem(localStorageKey, JSON.stringify(farms));
    farmDom.remove();
    updateFarmCount(farms);
}

export function editSingleFarmForm(button, farms, dev = false) {
    let target = button;
    let farmDom = target.parentElement.parentElement;
    let farm = findFarm(farmDom.id, farms).farm;

    let popToOpen = target.getAttribute('data-poptoopen');
    let popUp = document.getElementById(popToOpen);

    let h2 = popUp.querySelector('h2');
    let farmInput = popUp.querySelector('.farmInput');
    let cropDom = popUp.querySelector('.crop-info img');
    let timerDom = popUp.querySelector('.time p');
    let textarea = popUp.querySelector('textarea');

    let colorIndicator = popUp.querySelector('.color-indicator div');
    let colorInputDom = popUp.querySelector('input[type=color]');

    popUp.querySelectorAll('.crop-radio input').forEach(e => {
        e.checked = false;
    })


    h2.innerHTML = `Farm ${farmDom.id}`;
    farmInput.value = farmDom.id;
    cropDom.setAttribute('src', `/assets/images/crops/${farm.crop.name.toLowerCase()}.png`)

    let hourFormat = secondsToHourFormat(farm.crop.sproutTimeSeconds);
    timerDom.innerHTML = `${hourFormat[0]}:${hourFormat[1]}:${hourFormat[2]}`

    textarea.value = farm.info.notes;

    if (farm.info.color != null) {
        colorIndicator.style.background = farm.info.color;
        // colorInputDom.click();
        colorInputDom.value = farm.info.color
        colorInputDom.setAttribute('data-color', farm.info.color)
    } else {
        colorInputDom.setAttribute('data-color', '')
    }

    openPop(popUp);
}

export function selectFarm(button, farmsToUpdate, farms, dev = false){
    let target = button;
    let farmDom = target.parentElement.parentElement;

    if (target.checked == true) {
        // add farm to FARMStoUpdate
        let farm = findFarm(farmDom.id, farms);
        farmsToUpdate.push(farm.farm);

        if(farmsToUpdate.length > 1){
            document.querySelector('.bulk-actions').style.display = 'inline-flex';
        }

        if(farmsToUpdate.length == farms.length){
            selectAllFarmsDom.checked = true;
        }

        if(dev){
            console.log('adding farm to FARMStoUpdate: ', farmsToUpdate)
        }

    } else {
        // remove farm from FARMStoUpdate
        let farm = findFarm(farmDom.id, farmsToUpdate);
        farmsToUpdate.splice(farm.i, 1);

        if(farmsToUpdate.length < 2){
            document.querySelector('.bulk-actions').style.display = 'none';
        }

        if(farmsToUpdate.length < farms.length){
            selectAllFarmsDom.checked = false;
        }

        if(dev){
            console.log('removing farm to FARMStoUpdate: ', farmsToUpdate)
        }
    }

    // console.log('fars to update', farmsToUpdate)
    // if (farmsToUpdate.length > 1) {
    //     document.querySelector('.mass-edit-container .extra-buttons').classList.add('show');
    // } else {
    //     document.querySelector('.mass-edit-container .extra-buttons').classList.remove('show');
    // }
}

export function openFarmIframe(url, nextFarm){
    let iframe = iframePop.querySelector('.main-i');
    let iframeS = iframePop.querySelector('.second-i');
    iframe.classList.add('active')
    iframe.setAttribute('src', url);

    if(nextFarm != null){
        iframeS.setAttribute('src', `${mainGameUrl}${farmUrl}${nextFarm.id}`);
    }

    iframePop.classList.add('open');

}