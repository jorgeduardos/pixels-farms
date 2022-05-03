// import findFarm, updateFarmCount, openFarm, Timer
import './utils/easytimer.min';
import {findFarm, updateFarmCount, openFarm, handleTimerStart} from './helper-functions';


export function startFarm(button, farms){
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