import Sortable from 'sortablejs';
import { arrayMoveMutable } from 'array-move';

var dev = false;
const farmListDom = document.querySelector('.farm-list');
const farmInput = document.getElementById('farmNumber');
var farmCountDom = document.getElementById('farm-count');

var storedFarms = JSON.parse(localStorage.getItem("farms"));
var farms = [];

// generate farms if there are farms saved
// console.log(storedFarms)
if (storedFarms != null) {

    farms = storedFarms;
    if (dev) {
        console.log('farms on load: ', farms);
    }
    farms.forEach(farm => {
        createFarmNode(farm);
        if(farm.startTime != null){
            continueFarmTimer(farm)
        }
    });
    updateFarmCount(farms);
}


const regex = /(?<=farm)[^/\s]*/i;

const crops = [
    {
        id: 0,
        name: 'Popberry',
        sproutTime: {
            hours: 0,
            minutes: 0,
            seconds: 20
        }, // in hours
    },
    {
        id: 1,
        name: 'Grumpkin',
        sproutTime: {
            hours: 4,
            minutes: 0,
            seconds: 0
        },  // in hours
    },
    {
        id: 2,
        name: 'Scarrot',
        sproutTime: {
            hours: 5,
            minutes: 20,
            seconds: 0
        },  // in hours
    }
]

//sortab
var sortable = new Sortable(farmListDom, {
    animation: 150,
    ghostClass: 'ghost',
    onEnd: function (e) {
        arrayMoveMutable(farms, e.oldIndex, e.newIndex)
        localStorage.setItem("farms", JSON.stringify(farms));
        if (dev) {
            console.log('farms after move: ', farms);
        }
    },
});

//form submission
let form = document.querySelector('form');
form.addEventListener('submit', function (e) {

    e.preventDefault();

    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    farmInput.value = "";
    farmInput.focus();

    createFarmNode(addFarm(formProps));
})

//add farm to list
function addFarm(form) {

    let crop = crops[form.type]

    var match = regex.exec(form.farmNumber);
    let number = match == null ? form.farmNumber : match[0];
    //regex url

    let farm = {
        number: number,
        crop: crop,
        timer: null,
        startTime: null,
    }

    farms.push(farm);
    updateFarmCount(farms);

    localStorage.setItem("farms", JSON.stringify(farms));

    if (dev) {
        console.log('farms after add: ', farms);
    }

    return farm;
}

// start and delete farm function
farmListDom.addEventListener('click', function (e) {
    if (e.target.classList.contains('start-farm')) {

        let target = e.target;
        target.disabled = true;

        let farmDom = e.target.parentElement.parentElement;
        farmDom.classList.remove('completed');
        let farm = findFarm(farmDom.id).farm;

        let timerDom = farmDom.querySelector('.timer');
        let timer = new easytimer.Timer();

        //saving timer pointer in farm
        farm.timer = timer;
        farm.startTime = Date();

        //saving farm in localStorage
        localStorage.setItem("farms", JSON.stringify(farms));

        // timer.start({ countdown: true, startValues: {seconds: 10} });
        timer.start({ countdown: true, startValues: farm.crop.sproutTime });

        timer.addEventListener('secondsUpdated', function (e) {
            timerDom.innerHTML = timer.getTimeValues().toString();
        });

        timer.addEventListener('targetAchieved', function (e) {
            target.disabled = false;
            farmDom.classList.add('completed');
        });

        window.open(`https://play.pixels.online/farm${farm.number}`, "_blank");

    } else if (e.target.classList.contains('delete-farm')) {

        let farmDom = e.target.parentElement.parentElement;
        let farm = findFarm(farmDom.id);

        if (dev) {
            console.log('deleting farms ...')
            console.log('farm node to be deleted: ', farmDom);
            console.log('farm to be deleted: ', farm)
        }

        farms.splice(farm.i, 1);
        updateFarmCount(farms);

        if (dev) {
            console.log('farms after delete: ', farms);
        }

        localStorage.setItem("farms", JSON.stringify(farms));
        farmDom.remove();

    }
})

// find farm in array, returns farm and index
function findFarm(id) {
    let farm;
    farms.forEach((item, index) => {
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

//create dom element
function createFarmNode(farm) {
    var tag = document.createElement("div");
    tag.classList.add('farm');
    tag.setAttribute('id', farm.number);
    tag.setAttribute('data-id', farm.number);

    let cropName = farm.crop.name.toLowerCase();
    let cropTimer;

    // if crop timer was started, use it

    if (farm.startTime != null) {
        cropTimer = {
            hours: '',
            minutes: '',
            seconds: ''
        }

    } else {
        cropTimer = farm.crop.sproutTime;
    }


    tag.innerHTML = `<h4>Farm ${farm.number}</h4>
        <div class="crop-type ${cropName}"></div>
        <div class="timer">${cropTimer.hours}:${cropTimer.minutes}:${cropTimer.seconds}</div>

        <div class="ui">
            <button class="delete-farm">Delete</button>
            <button class="start-farm">Start</button>
        </div>`;

    farmListDom.appendChild(tag);

}

function continueFarmTimer(farm){
    let farmDom = document.getElementById(farm.number);
    let timerDom = farmDom.querySelector('.timer');
    let now = Date();

    let farmTimer = timerCalculate(now, farm.startTime, farm.crop.sproutTime);
    
    //saving timer pointer in farm
    if(
        (Math.sign(farmTimer.hours) == 0 || Math.sign(farmTimer.hours) == -1) && 
        (Math.sign(farmTimer.minutes) == 0 || Math.sign(farmTimer.minutes) == -1) && 
        (Math.sign(farmTimer.seconds) == 0 || Math.sign(farmTimer.seconds) == -1)
    ){
        farmDom.classList.add('completed');
        timerDom.innerHTML = '00:00:00';
        return
    }

    let timer = new easytimer.Timer();
    farm.timer = timer;
    farmDom.querySelector('.start-farm').disabled = true;

    // timer.start({ countdown: true, startValues: {seconds: 10} });
    timer.start({ countdown: true, startValues: farmTimer});

    timer.addEventListener('secondsUpdated', function (e) {
        timerDom.innerHTML = timer.getTimeValues().toString();
    });

    timer.addEventListener('targetAchieved', function (e) {
        farmDom.querySelector('.start-farm').disabled = false;
        farmDom.classList.add('completed');
    });
}

function updateFarmCount(arr) {
    let farmCount = arr.length;
    farmCountDom.innerHTML = farmCount;
}

function timerCalculate(fDate, oDate, sproutTimer) {
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
    nseconds = ~~(((nseconds - 60*60*nhour) - nmin*60));

    return {
        hours: nhour,
        minutes: nmin,
        seconds: nseconds
    }
}

/// helpers




