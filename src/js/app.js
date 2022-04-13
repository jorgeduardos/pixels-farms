import Sortable from 'sortablejs';
import { arrayMoveMutable } from 'array-move';

var dev = false;
const farmListDom = document.querySelector('.farm-list');
const farmInput = document.getElementById('farmNumber');
const editPopUpDom = document.getElementById('edit-pop-up');
const importPopUpDom = document.getElementById('import-pop-up');
const selectAllFarmsDom = document.getElementById('select-all-farms');
var farmCountDom = document.getElementById('farm-count');

var storedFarms = JSON.parse(localStorage.getItem("farms"));
var FARMS = [];
var FARMStoUpdate = [];

// generate farms if there are farms saved
// console.log(storedFarms)
if (storedFarms != null) {

    FARMS = storedFarms;
    if (dev) {
        console.log('farms on load: ', FARMS);
    }
    FARMS.forEach(farm => {
        if (farm.crop.sproutTime.seconds == undefined) {
            farm.crop.sproutTime.seconds = 0;
        }
        createFarmNode(farm);
        if (farm.startTime != undefined && farm.startTime != null) {
            continueFarmTimer(farm)
        }
    });

    updateFarmCount(FARMS);
    if (FARMS.length > 0) {
        selectAllFarmsDom.classList.add('show');
    }
}


const regex = /(?<=farm)[^/\s]*/i;

const crops = [
    {
        id: 0,
        name: 'Popberry',
        sproutTime: {
            hours: 2,
            minutes: 0,
            seconds: 0
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
        arrayMoveMutable(FARMS, e.oldIndex, e.newIndex)
        localStorage.setItem("farms", JSON.stringify(FARMS));
        if (dev) {
            console.log('farms after move: ', FARMS);
        }
    },
});

//form submission
let form = document.getElementById('add-farm');
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

    FARMS.push(farm);
    updateFarmCount(FARMS);
    selectAllFarmsDom.classList.add('show');

    localStorage.setItem("farms", JSON.stringify(FARMS));

    if (dev) {
        console.log('farms after add: ', FARMS);
    }

    return farm;
}

// start and delete farm function
farmListDom.addEventListener('click', function (e) {
    //start farm
    if (e.target.classList.contains('start-farm')) {

        let target = e.target;
        target.disabled = true;

        let farmDom = e.target.parentElement.parentElement;
        farmDom.classList.remove('completed');
        let farm = findFarm(farmDom.id, FARMS).farm;

        let timerDom = farmDom.querySelector('.timer');
        let timer = new easytimer.Timer();

        //saving timer pointer in farm
        farm.timer = timer;
        farm.startTime = Date();

        //saving farm in localStorage
        localStorage.setItem("farms", JSON.stringify(FARMS));

        // timer.start({ countdown: true, startValues: {seconds: 10} });
        timer.start({ countdown: true, startValues: farm.crop.sproutTime });

        timer.addEventListener('secondsUpdated', handleTimerStart(timerDom, timer));

        timer.addEventListener('targetAchieved', function (e) {
            target.disabled = false;
            farmDom.classList.add('completed');
        });

        openFarm(farm.number);

    } else if (e.target.classList.contains('delete-farm')) {

        let farmDom = e.target.parentElement.parentElement;
        let farm = findFarm(farmDom.id, FARMS);

        if (dev) {
            console.log('deleting farms ...')
            console.log('farm node to be deleted: ', farmDom);
            console.log('farm to be deleted: ', farm)
        }

        FARMS.splice(farm.i, 1);
        updateFarmCount(FARMS);

        if (FARMS.length == 0) {
            selectAllFarmsDom.classList.remove('show');
        }

        if (dev) {
            console.log('farms after delete: ', FARMS);
        }

        localStorage.setItem("farms", JSON.stringify(FARMS));
        farmDom.remove();

    } else if (e.target.classList.contains('open-farm')) {

        let farmDom = e.target.parentElement.parentElement;
        openFarm(farmDom.id);

    } else if (e.target.classList.contains('edit-farm')) {

        let farmDom = e.target.parentElement.parentElement;
        let h2 = editPopUpDom.querySelector('h2');
        h2.innerHTML = `Edit Farm ${farmDom.id}`;
        h2.setAttribute('data-farm', farmDom.id);
        h2.setAttribute('data-objtype', 'obj');
        editPopUpDom.classList.add('open');

    } else if (e.target.classList.contains('select-farm')) {

        let farmDom = e.target.parentElement;

        if (e.target.checked == true) {
            // add farm to FARMStoUpdate
            let farm = findFarm(farmDom.id, FARMS);
            FARMStoUpdate.push(farm.farm);

            console.log('adding farm to FARMStoUpdate: ', FARMStoUpdate)

        } else {
            // remove farm from FARMStoUpdate
            let farm = findFarm(farmDom.id, FARMStoUpdate);
            FARMStoUpdate.splice(farm.i, 1);

            console.log('removing farm to FARMStoUpdate: ', FARMStoUpdate)
        }

        if (FARMStoUpdate.length > 1) {
            document.querySelector('.mass-edit-container .extra-buttons').classList.add('show');
        } else {
            document.querySelector('.mass-edit-container .extra-buttons').classList.remove('show');
        }

    }
})

// find farm in array, returns farm and index
function findFarm(id, arr) {
    let farm;
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

//create dom element
function createFarmNode(farm) {
    var tag = document.createElement("div");
    tag.classList.add('farm');
    tag.setAttribute('id', farm.number);
    tag.setAttribute('data-id', farm.number);

    let cropName = farm.crop.name.toLowerCase();
    let cropTimer;

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


    tag.innerHTML = `<input type="checkbox" name="select-farm" class="select-farm">
        <h4>Farm ${farm.number}</h4>
        <div class="crop-type ${cropName}"></div>
        <div class="timer">${cropTimer.hours == 0 ? '00' : cropTimer.hours}:${cropTimer.minutes == 0 ? '00' : cropTimer.minutes}:${cropTimer.seconds == 0 ? '00' : cropTimer.seconds}</div>

        <div class="ui">
            <button class="delete-farm">Delete</button>
            <button class="edit-farm">Edit</button>
            <button class="open-farm">Open</button>
            <button class="start-farm">Start</button>
        </div>`;

    farmListDom.appendChild(tag);

}

function openFarm(farmNumber) {
    window.open(`https://play.pixels.online/farm${farmNumber}`, "_blank");
}

function continueFarmTimer(farm) {
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
    nseconds = ~~(((nseconds - 60 * 60 * nhour) - nmin * 60));

    return {
        hours: nhour,
        minutes: nmin,
        seconds: nseconds
    }
}

// edit farm pop up
document.getElementById('close-pop').addEventListener('click', function (e) {
    editPopUpDom.classList.remove('open')
})
document.querySelector('#edit-pop-up .container').addEventListener('click', function (e) {
    e.stopPropagation();
})

document.querySelectorAll('.pop-up .screen').forEach(element => {
    element.addEventListener('click', function (e) {
        console.log( element.parentElement);
        element.parentElement.classList.remove('open')
    })
})


document.getElementById('edit-farm-form').addEventListener('submit', function (e) {
    e.preventDefault();
    let formData = new FormData(e.target);
    let formProps = Object.fromEntries(formData);
    let crop = crops[formProps.type];

    let typeOfEdit = editPopUpDom.querySelector('h2').getAttribute('data-objtype');
    if (typeOfEdit == 'obj') {

        let farmId = editPopUpDom.querySelector('h2').getAttribute('data-farm');
        let farm = findFarm(farmId, FARMS).farm;
        editFarm(farm, crop);

    } else if (typeOfEdit == 'arr') {
        editFarm(FARMStoUpdate, crop);
        let checkBoxes = farmListDom.querySelectorAll('.select-farm');
        let selectButton = document.getElementById('select-all-farms');

        clearCheckBoxes(checkBoxes, selectButton);
    }

})


// mass deleting
document.getElementById('delete-all-farms').addEventListener('click', function (e) {

    for (let i = 0; i < FARMStoUpdate.length; i++) {
        let farmToDelete = FARMStoUpdate[i].number;
        let farmToDeleteDom = document.getElementById(FARMStoUpdate[i].number);

        for (let f = 0; f < FARMS.length; f++) {
            let farm = FARMS[f];

            if (farm.number == farmToDelete) {
                FARMS.splice(f, 1);
                console.log('FARMS after splice: ', FARMS)
                farmToDeleteDom.remove();
            }

        }

    }

    FARMStoUpdate = [];
    console.log('FARMStoupdate after splice: ', FARMStoUpdate)

    updateFarmCount(FARMS);
    document.querySelector('.mass-edit-container .extra-buttons').classList.remove('show');

    if (FARMS.length == 0) {
        selectAllFarmsDom.classList.remove('show');
    }

    localStorage.setItem("farms", JSON.stringify(FARMS));
})

// mass editing
document.getElementById('edit-all-farms').addEventListener('click', function (e) {
    let h2 = editPopUpDom.querySelector('h2');
    h2.innerHTML = `Edit Farms`;
    h2.setAttribute('data-objtype', 'arr');
    openPop(editPopUpDom);
})

//mass starting
document.getElementById('start-all-farms').addEventListener('click', function (e) {

    FARMStoUpdate.forEach(farm => {
        let farmDom = document.getElementById(farm.number);

        if (farmDom.classList.contains('completed')) {
            let startButton = farmDom.querySelector('.start-farm');

            startButton.disabled = true
            farmDom.classList.remove('completed');

            let timerDom = farmDom.querySelector('.timer');
            let timer = new easytimer.Timer();
            farm.timer = timer;
            farm.startTime = Date();

            // timer.start({ countdown: true, startValues: {seconds: 10} });
            timer.start({ countdown: true, startValues: farm.crop.sproutTime });

            timer.addEventListener('secondsUpdated', function (e) {
                timerDom.innerHTML = timer.getTimeValues().toString();
            });

            timer.addEventListener('targetAchieved', function (e) {
                startButton.disabled = false;
                farmDom.classList.add('completed');
            });

            openFarm(farm.number);
        }
    });

    let checkBoxes = farmListDom.querySelectorAll('.select-farm');
    let selectButton = document.getElementById('select-all-farms');

    clearCheckBoxes(checkBoxes, selectButton);

    localStorage.setItem("farms", JSON.stringify(FARMS));


    FARMStoUpdate = [];
})

// mass select
selectAllFarmsDom.addEventListener('click', function (e) {
    let button = e.target;
    let checkBoxes = farmListDom.querySelectorAll('.select-farm');

    if (button.classList.contains('all-selected')) {
        //deselecting
        FARMStoUpdate = [];
        clearCheckBoxes(checkBoxes, button);
    } else {

        //selecting
        FARMStoUpdate = [...FARMS];

        checkBoxes.forEach(element => {
            element.checked = true
        });

        document.querySelector('.mass-edit-container .extra-buttons').classList.add('show');
        button.classList.add('all-selected');
        button.innerHTML = 'Deselect All';
    }

})

//edit farm function
function editFarm(obj, crop) {

    if (Array.isArray(obj)) {
        console.log('type array');
        let farmArr = obj;

        farmArr.forEach(farm => {
            updateFarmDom(farm, crop);
        });

        FARMStoUpdate = [];

    } else {
        updateFarmDom(obj, crop);
    }
    closePop(editPopUpDom);
}

function updateFarmDom(farmToUpdate, crop) {
    let farm = farmToUpdate;
    let prevCrop = farm.crop;

    //update farm in the arr (type and startTimer)
    farm.crop = crop;
    let cropTimer = farm.crop.sproutTime;

    farm.startTime = null;
    farm.timer = null;

    //save in local localStorage
    localStorage.setItem("farms", JSON.stringify(FARMS));

    //build dom tree
    let farmDom = document.getElementById(farm.number);

    farmDom.classList.remove('completed');
    farmDom.querySelector('.start-farm').disabled = false;
    farmDom.querySelector('.crop-type').classList.remove(prevCrop.name.toLowerCase());
    farmDom.querySelector('.crop-type').classList.add(farm.crop.name.toLowerCase());
    farmDom.querySelector('.timer').innerHTML = `${cropTimer.hours == 0 ? '00' : cropTimer.hours}:${cropTimer.minutes == 0 ? '00' : cropTimer.minutes}:${cropTimer.seconds == 0 ? '00' : cropTimer.seconds}`
}

function clearCheckBoxes(arr, selectButton) {
    arr.forEach(element => {
        element.checked = false
    });

    document.querySelector('.mass-edit-container .extra-buttons').classList.remove('show');
    selectButton.classList.remove('all-selected');
    selectButton.innerHTML = 'Select All';
}

function handleTimerStart(timerDom, timer) {
    return function () {
        timerDom.innerHTML = timer.getTimeValues().toString();
    }
}

//export import farms
document.getElementById('export-farms').addEventListener('click', function (e) {
    if(FARMS.length > 0){
        let farmsToExport = localStorage.getItem("farms");
        download('exported-farms', farmsToExport)
    }
})

document.getElementById('import-farms').addEventListener('click', function (e) {
    openPop(importPopUpDom);
})
document.getElementById('close-import-pop').addEventListener('click', function (e) {
    closePop(importPopUpDom);
})

document.getElementById('import-form').addEventListener('submit', function (e) {
    e.preventDefault();
    let formData = new FormData(e.target);
    let formProps = Object.fromEntries(formData);

    localStorage.setItem("farms", formProps.farms);

    window.location.reload();

})

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function openPop(container){
    container.classList.add('open');
}

function closePop(container){
    container.classList.remove('open');
}





