import Sortable from 'sortablejs';
import { arrayMoveMutable } from 'array-move';

var dev = false;
const farmListDom = document.querySelector('.farm-list');
const farmInput = document.getElementById('farmNumber');
const editPopUpDom = document.getElementById('edit-pop-up');
const importPopUpDom = document.getElementById('import-pop-up');
const selectAllFarmsDom = document.getElementById('select-all-farms');
const errorDom = document.getElementById('error-handling');
const addColorInputDom = document.getElementById('farm-color');
const editColorInputDom = document.getElementById('farm-color-edit');
var farmCountDom = document.getElementById('farm-count');
var farmReadytDom = document.getElementById('farms-ready');
var farmStartedDom = document.getElementById('farms-started');

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
        if (farm.info == undefined) {
            farm.info = {};
        }
        farmListDom.appendChild(createFarmNode(farm));

        if (farm.startTime != undefined && farm.startTime != null) {
            continueFarmTimer(farm)
        }
    });

    updateFarmCount(FARMS);
    if (FARMS.length > 0) {
        selectAllFarmsDom.disabled = false;
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

    farmInput.focus();

    // console.log(addColorInputDom.getAttribute('data-color'))
    formProps.farmColor = addColorInputDom.getAttribute('data-color');
    addFarm(formProps);
})

document.querySelectorAll('.add-color').forEach(el => {
    el.addEventListener('click', e => {
        let button = e.target;
        let parent = button.parentElement;
        let colorInputDom = parent.querySelector('input');
    
        if(parent.classList.contains('show')){
            parent.classList.remove('show')
            colorInputDom.setAttribute('data-color', null)
        }else{
            parent.classList.add('show')
            colorInputDom.click();
            colorInputDom.setAttribute('data-color', colorInputDom.value)
        }

        // console.log(colorInputDom.getAttribute('data-color'))
    })
})

document.querySelectorAll('.farm-color-input').forEach(el => {
    el.addEventListener('change', (e)=>{
        let imput = e.target;
        imput.setAttribute('data-color', imput.value)
        // console.log(imput.getAttribute('data-color'))
    })
})


//add farm to list
function addFarm(form) {

    let crop = crops[form.type]

    var match = regex.exec(form.farmNumber);
    let number = match == null ? form.farmNumber : match[0];

    //errpr handling
    if(isNaN(number*1)){
        return showError('Invalid Farm');
    }else if((number*1) > 5000 || (number*1) < 0){
        return showError('Invalid Farm');
    }else if(FARMS.length > 0 && findFarm(number, FARMS) != null){
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

    FARMS.push(farm);
    updateFarmCount(FARMS);
    document.getElementById('farmNumber').value = ''
    document.getElementById('farm-notes').value = ''
    document.getElementById('farmNumber').focus

    if(FARMS.length > 1 ){
        selectAllFarmsDom.disabled = false;
    }

    localStorage.setItem("farms", JSON.stringify(FARMS));

    if (dev) {
        console.log('farms after add: ', FARMS);
    }

    farmListDom.appendChild(createFarmNode(farm));
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
        farmDom.classList.add('started');

        timer.addEventListener('targetAchieved', function (e) {
            target.disabled = false;
            farmDom.classList.add('completed');
            farmDom.classList.remove('started');
            updateFarmCount(FARMS);
        });

        updateFarmCount(FARMS);
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

        if (FARMS.length == 0) {
            selectAllFarmsDom.disabled = true;
        }

        if (dev) {
            console.log('farms after delete: ', FARMS);
        }

        localStorage.setItem("farms", JSON.stringify(FARMS));
        farmDom.remove();
        updateFarmCount(FARMS);

    } else if (e.target.classList.contains('open-farm')) {

        let farmDom = e.target.parentElement.parentElement;
        openFarm(farmDom.id);

    } else if (e.target.classList.contains('edit-farm')) {

        let farmDom = e.target.parentElement.parentElement;
        let farm = findFarm(farmDom.id, FARMS).farm;

        let h2 = editPopUpDom.querySelector('h2');
        let textarea = editPopUpDom.querySelector('textarea');
        let colorPickerButton = editPopUpDom.querySelector('.add-color');
        let colorParent = colorPickerButton.parentElement;
        let colorInputDom = colorParent.querySelector('input');
        
        h2.innerHTML = `Edit Farm ${farmDom.id}`;
        h2.setAttribute('data-farm', farmDom.id);
        h2.setAttribute('data-objtype', 'obj');

        textarea.value = farm.info.notes;

        if(farm.info.color != null){
            colorParent.classList.add('show')
            // colorInputDom.click();
            colorInputDom.value = farm.info.color
            colorInputDom.setAttribute('data-color', colorInputDom.value)
        }else{
            colorParent.classList.remove('show')
            colorInputDom.setAttribute('data-color', null)
        }

        // console.log(farm)

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

//create dom element
function createFarmNode(farm) {
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
                <img src="/dist/images/icons/trash.png" alt="Delete Farm">
            </button>
            <button class="edit-farm btn-icon" title="Edit Farm">
                <img src="/dist/images/icons/edit.png" alt="Edit Farm">
            </button>
            <button class="open-farm btn-icon" title="Open Farm">
                <img src="/dist/images/icons/link.png" alt="Open Farm">
            </button>
            <button class="start-farm btn-icon" title="Start Farm">
                <img src="/dist/images/icons/stopwatch.png" alt="Start Farm">
            </button>
        </div>`;

    return tag;

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

    farmDom.classList.add('started');

    timer.addEventListener('targetAchieved', function (e) {
        farmDom.querySelector('.start-farm').disabled = false;
        farmDom.classList.add('completed');
        farmDom.classList.remove('started');
    });
}

//set farm counts
function updateFarmCount(arr) {
    let farmCount = arr.length;
    let farmsDom = farmListDom.querySelectorAll('.farm');
    let readyFarms = 0;
    let startedFarms = 0;

    farmCountDom.innerHTML = farmCount;

    farmsDom.forEach(farm => {
        if(farm.classList.contains('started')){
            startedFarms++;
        }else if(farm.classList.contains('completed')){
            readyFarms++;
        }
    })

    // console.log(readyFarms);

    farmReadytDom.innerHTML = readyFarms;
    farmStartedDom.innerHTML = startedFarms;

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
    // let crop = crops[formProps.type];

    formProps.farmColor = editColorInputDom.getAttribute('data-color');

    let typeOfEdit = editPopUpDom.querySelector('h2').getAttribute('data-objtype');

    if (typeOfEdit == 'obj') {

        let farmId = editPopUpDom.querySelector('h2').getAttribute('data-farm');
        let farm = findFarm(farmId, FARMS).farm;
        // editFarm(farm, crop);
        editFarm(farm, formProps);

    } else if (typeOfEdit == 'arr') {

        editFarm(FARMStoUpdate, formProps);
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
                farmToDeleteDom.remove();
            }
        }
    }

    FARMStoUpdate = [];

    document.querySelector('.mass-edit-container .extra-buttons').classList.remove('show');
    

    if (FARMS.length == 0) {
        selectAllFarmsDom.disabled = true;
        selectAllFarmsDom.classList.remove('all-selected');
        selectAllFarmsDom.innerHTML = 'Select All';
    }

    localStorage.setItem("farms", JSON.stringify(FARMS));
    updateFarmCount(FARMS);
})

// mass editing
document.getElementById('edit-all-farms').addEventListener('click', function (e) {
    let h2 = editPopUpDom.querySelector('h2');
    let textarea = editPopUpDom.querySelector('textarea');
    let colorPickerButton = editPopUpDom.querySelector('.add-color');
    let colorParent = colorPickerButton.parentElement;
    let colorInputDom = colorParent.querySelector('input');

    h2.innerHTML = `Edit Farms`;
    h2.setAttribute('data-objtype', 'arr');

    textarea.value = '';

    colorParent.classList.remove('show')
    colorInputDom.setAttribute('data-color', null)


    openPop(editPopUpDom);
})

//mass starting
document.getElementById('start-all-farms').addEventListener('click', function (e) {

    FARMStoUpdate.forEach(farm => {
        let farmDom = document.getElementById(farm.number);

        if (!farmDom.classList.contains('started')) {
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

            farmDom.classList.add('started');

            timer.addEventListener('targetAchieved', function (e) {
                startButton.disabled = false;
                farmDom.classList.add('completed');
                farmDom.classList.remove('started');
                updateFarmCount(FARMS);
            });

            updateFarmCount(FARMS);
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
        document.querySelector('.mass-edit-container .extra-buttons').classList.remove('show');
        button.classList.remove('all-selected');
        button.innerHTML = 'Select All';
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
function editFarm(obj, data) {

    if (Array.isArray(obj)) {
        console.log('type array');
        let farmArr = obj;

        farmArr.forEach(farm => {
            updateFarmDom(farm, data);
        });

        FARMStoUpdate = [];

    } else {
        // console.log(data)
        updateFarmDom(obj, data);
    }
    closePop(editPopUpDom);
}

function updateFarmDom(farmToUpdate, data) {
    let farm = farmToUpdate;
    let prevCrop = farm.crop;
    let farmColor = data.farmColor == 'null' ? null : data.farmColor;
    let farmDom = document.getElementById(farm.number);
    let nextDomE = farmDom.nextElementSibling;


    //update farm in the arr (type and startTimer)
    if( data.type != undefined){
        farm.crop = crops[data.type];
        let cropTimer = farm.crop.sproutTime;
        farm.startTime = null;
        farm.timer = null;
    }

    farm.info.color = farmColor == null ? farm.info.color : farmColor;
    farm.info.notes = data.farmNotes;


    //save in local localStorage
    localStorage.setItem("farms", JSON.stringify(FARMS));

    //build dom tree
    farmDom.remove();
    farmListDom.insertBefore(createFarmNode(farm), nextDomE)

    // farmDom.classList.remove('completed');
    // farmDom.querySelector('.start-farm').disabled = false;
    // farmDom.querySelector('.crop-type').classList.remove(prevCrop.name.toLowerCase());
    // farmDom.querySelector('.crop-type').classList.add(farm.crop.name.toLowerCase());
    // farmDom.querySelector('.timer').innerHTML = `${cropTimer.hours == 0 ? '00' : cropTimer.hours}:${cropTimer.minutes == 0 ? '00' : cropTimer.minutes}:${cropTimer.seconds == 0 ? '00' : cropTimer.seconds}`
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

//mass import farm type
var examplePlaceholder = '[{"number":"3084","crop":{"id":2,"name":"Scarrot","sproutTime":{"hours":5,"minutes":20,"seconds":0}},"timer":null,"startTime":null},{"number":"3223","crop":{"id":2,"name":"Scarrot","sproutTime":{"hours":5,"minutes":20,"seconds":0}},"timer":null,"startTime":null}';
var examplePlaceholder2 = 'https://play.pixels.online/farm1688\nhttps://play.pixels.online/farm2766\nhttps://play.pixels.online/farm2130\nhttps://play.pixels.online/farm3535';
var importTextArea = document.getElementById('import-data');
document.querySelector(".file-type-container").addEventListener('click', function (event) {
    if (event.target && event.target.matches("input[type='radio']")) {
        if(event.target.value == 'exported'){
            importTextArea.setAttribute('placeholder', examplePlaceholder)
        }else{
            importTextArea.setAttribute('placeholder', examplePlaceholder2)
        }
    }
});

//mass import event
document.getElementById('import-form').addEventListener('submit', function (e) {
    e.preventDefault();
    let formData = new FormData(e.target);
    let formProps = Object.fromEntries(formData);
    let textarea = e.target.querySelector('textarea');

    textarea.value = '';

    importClean(formProps.farms, formProps.file);

    // window.location.reload();
})

//reset farms
document.getElementById('reset').addEventListener('click', function (e) {

    if(FARMS.length > 0){

        FARMS.forEach(farm => {
            farm.startTime = null;
            farm.timer = null;
        })

        localStorage.setItem("farms", JSON.stringify(FARMS));
        window.location.reload();
    }
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

function importClean(data, fileType){
    let farmsToClean = [];
    let sameFarms = [];

    //chekc if data is of type string or array
    if(fileType == 'exported'){
        try {
            JSON.parse(data);
        } catch (e) {
            return showError('Invalid data');
        }

        farmsToClean = JSON.parse(data);

        if(FARMS == 0){
            localStorage.setItem("farms", JSON.stringify(farmsToClean));
            window.location.reload();
        }

        for(var i = farmsToClean.length -1; i >= 0 ; i--){
            if(findFarm(farmsToClean[i].number, FARMS) != null){
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

    }else{
        data.split(/\r?\n/).forEach(link => {
            var match = regex.exec(link);
            if(match != null){
                let farm = {
                    number: match[0],
                    crop: crops[0],
                    timer: null,
                    startTime: null,
                }  
                
                farmsToClean.push(farm);
            }
            
        })

        if(FARMS == 0){
            localStorage.setItem("farms", JSON.stringify(farmsToClean));
            window.location.reload();
        }

        for(var i = farmsToClean.length -1; i >= 0 ; i--){
            if(findFarm(farmsToClean[i].number, FARMS) != null){
                sameFarms.push(farmsToClean[i]);
                farmsToClean.splice(i, 1);
            }
        }

        FARMS = FARMS.concat(farmsToClean)
        localStorage.setItem("farms", JSON.stringify(FARMS));
        window.location.reload();
    }

}


function showError(errorMessage, errorCode){
    errorDom.querySelector('p').innerHTML = errorMessage;

    if(errorCode == 0){
        errorDom.classList.add('show', 'error');
    }else if(errorCode == 1){
        errorDom.classList.add('show', 'warning');
    }else{

        errorDom.classList.add('show', 'error');
    }

    setTimeout(function(){
        errorDom.classList.remove('show', 'error', 'warning');
    }, 5000)
}





