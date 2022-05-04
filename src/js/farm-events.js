// import findFarm, updateFarmCount, openFarm, Timer
import './vendors/easytimer.min';
import { handleTimerStart, openPop, updateFarmCount} from './misc';
import { findFarm, openFarm } from './farm-helpers';
import { selectAllFarmsDom, editPopUpDom } from './consts';


export function startFarm(button, farms) {
    let target = button;
    target.disabled = true;

    let farmDom = target.parentElement.parentElement;
    farmDom.classList.remove('completed');
    let farm = findFarm(farmDom.id, farms).farm;

    let timerDom = farmDom.querySelector('.timer');
    let timer = new easytimer.Timer();

    //saving timer pointer in farm
    farm.timer = timer;
    farm.startTime = Date();

    //saving farm in localStorage
    localStorage.setItem("farms", JSON.stringify(farms));

    // timer.start({ countdown: true, startValues: {seconds: 10} });
    timer.start({ countdown: true, startValues: farm.crop.sproutTime });

    timer.addEventListener('secondsUpdated', handleTimerStart(timerDom, timer));
    farmDom.classList.add('started');

    timer.addEventListener('targetAchieved', function (e) {
        target.disabled = false;
        farmDom.classList.add('completed');
        farmDom.classList.remove('started');
        updateFarmCount(farms);
    });

    updateFarmCount(farms);
    openFarm(farm.number);
}

export function deleteFarm(button, farms, dev = false) {
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

    localStorage.setItem("farms", JSON.stringify(farms));
    farmDom.remove();
    updateFarmCount(farms);
}

export function editSingleFarmForm(button, farms, dev = false) {
    let target = button;
    let farmDom = target.parentElement.parentElement;
    let farm = findFarm(farmDom.id, farms).farm;

    let h2 = editPopUpDom.querySelector('h2');
    let farmValueInput = editPopUpDom.querySelector('#farmValue');
    let textarea = editPopUpDom.querySelector('textarea');
    let colorPickerButton = editPopUpDom.querySelector('.add-color');
    let colorParent = colorPickerButton.parentElement;
    let colorInputDom = colorParent.querySelector('input');

    h2.innerHTML = `Edit Farm ${farmDom.id}`;
    farmValueInput.value = farmDom.id;

    textarea.value = farm.info.notes;

    if (farm.info.color != null) {
        colorParent.classList.add('show')
        // colorInputDom.click();
        colorInputDom.value = farm.info.color
        colorInputDom.setAttribute('data-color', colorInputDom.value)
    } else {
        colorParent.classList.remove('show')
        colorInputDom.setAttribute('data-color', null)
    }

    openPop(editPopUpDom)
}

export function selectFarm(button, farmsToUpdate, farms, dev = false){
    let target = button;
    let farmDom = target.parentElement;

    if (target.checked == true) {
        // add farm to FARMStoUpdate
        let farm = findFarm(farmDom.id, farms);
        farmsToUpdate.push(farm.farm);

        if(dev){
            console.log('adding farm to FARMStoUpdate: ', farmsToUpdate)
        }

    } else {
        // remove farm from FARMStoUpdate
        let farm = findFarm(farmDom.id, farmsToUpdate);
        farmsToUpdate.splice(farm.i, 1);

        if(dev){
            console.log('removing farm to FARMStoUpdate: ', farmsToUpdate)
        }
    }

    if (farmsToUpdate.length > 1) {
        document.querySelector('.mass-edit-container .extra-buttons').classList.add('show');
    } else {
        document.querySelector('.mass-edit-container .extra-buttons').classList.remove('show');
    }
}