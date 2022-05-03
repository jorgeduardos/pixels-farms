import { farmListDom, farmInput, editPopUpDom, importPopUpDom, selectAllFarmsDom, 
    errorDom, addColorInputDom, editColorInputDom, regex,
    farmCountDom, farmReadytDom, farmStartedDom
} from './consts';

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

export function openFarm(farmNumber) {
    window.open(`https://play.pixels.online/farm${farmNumber}`, "_blank");
}

export function handleTimerStart(timerDom, timer) {
    return function () {
        timerDom.innerHTML = timer.getTimeValues().toString();
    }
}