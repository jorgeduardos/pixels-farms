import Sortable from 'sortablejs';
import { arrayMoveMutable } from 'array-move';
import {
    farmListDom, editPopUpDom, massEditPopUpDom, importPopUpDom, selectAllFarmsDom, exportAllFarms,
    filterFarmsDom, iframePop
} from './consts';
import CROPS from './crops';
import { openPop, closePop, clearCheckBoxes, download, secondsToHourFormat, handleTimerStart, 
    showError, importClean, updateFarmCount
} from './misc'
import { startFarm, deleteFarm, editSingleFarmForm, selectFarm, openFarmIframe } from './farm-events';
import {
    openFarm, editFarm, createFarmNode, updateFarmDom, findFarm,
    continueFarmTimer, addFarm
} from './farm-helpers';
import settingsHandler from './settings';


if(mainFarmKey == 'w3gfarms'){
    var localStoreCheck = JSON.parse(localStorage.getItem(mainFarmKey));

    if (localStoreCheck == null || localStoreCheck.length == 0){
        localStorage.setItem(mainFarmKey, JSON.stringify(w3gFarms));
    }
}


// is in dev mode to print console logs
var dev = false;

var storedFarms = JSON.parse(localStorage.getItem(mainFarmKey));
var FARMS = [];
var FARMStoUpdate = [];

//coming from w3gFarmsScript.twig
if(mainFarmKey == 'w3gfarms' && forceUpdate){
    storedFarms.forEach((farm, i) => {
        let exist = false;
        w3gFarms.forEach( w3gFarm => {
            if(farm.number == w3gFarm.number){
                exist = true;
                return
            }
        })
        if(!exist){
            w3gFarms.splice(i, 0, farm)
        }
    })

    storedFarms = w3gFarms;
    localStorage.setItem(mainFarmKey, JSON.stringify(storedFarms));
    showError('New W3G farms were added', 2)
}


// ************************************** //
//             GENERATE FARMS             //
// ************************************** //
// generate farms if there are farms saved

if (storedFarms != null) {

    FARMS = storedFarms;
    if (dev) {
        console.log('farms on load: ', FARMS);
    }
    FARMS.forEach(farm => {
        //build old farms with new structure
        if (farm.crop.sproutTimeSeconds == undefined) {
            CROPS.forEach(crop => {
                if (crop.id == farm.crop.id) {
                    farm.crop.sproutTimeSeconds = crop.sproutTimeSeconds;
                }
            })
        }
        if (farm.info == undefined) {
            farm.info = {};
        }

        if(typeof(farm.startTime) == 'string'){
            farm.startTime = new Date(farm.startTime).getTime()/1000;
        }

        farmListDom.appendChild(createFarmNode(farm));

        if (farm.startTime != undefined && farm.startTime != null) {
            // console.log('continuing farm timer')
            continueFarmTimer(farm)
        }
    });

    //update far counters after creating farm nodes
    updateFarmCount(FARMS);

    if (FARMS.length > 1) {
        selectAllFarmsDom.disabled = false;
    }
}


// ************************************** //
//                SORTABLE                //
// ************************************** //
var sortable = new Sortable(farmListDom, {
    animation: 150,
    ghostClass: 'ghost',
    onEnd: function (e) {
        arrayMoveMutable(FARMS, e.oldIndex, e.newIndex)
        localStorage.setItem(mainFarmKey, JSON.stringify(FARMS));
        if (dev) {
            console.log('farms after move: ', FARMS);
        }
    },
});

// ************************************** //
//             ADD FARM FORM             //
// ************************************** //
const addForm = document.getElementById('add-farm');
addForm.addEventListener('submit', function (e) {

    e.preventDefault();

    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);
    const formColorImput = e.target.querySelector('input[type=color]');

    e.target.querySelector('.farmNumber').focus();

    // console.log(e.target)
    formProps.farmColor = formColorImput.getAttribute('data-color');
    addFarm(e.target, formProps, FARMS, mainFarmKey, dev);
})


// **************************************  //
//             ADD COLOR                   //
// ************************************** //
document.querySelectorAll('.farm-color-input').forEach(el => {
    el.addEventListener('input', e => {
        document.querySelectorAll('.colors-grid input[type=radio]').forEach(radio => {
            radio.checked = false;
        })

        let input = e.target;
        let indicator = input.parentElement.parentElement.parentElement.querySelector('.color-indicator div');

        input.setAttribute('data-color', e.target.value)
        indicator.style.background = e.target.value;

    })
})

document.querySelectorAll('.colors-grid input[type=radio]').forEach(el => {
    el.addEventListener('click', (e) => {


        let value = e.target.value;
        let indicator = e.target.parentElement.parentElement.parentElement.querySelector('.color-indicator div');
        let input = e.target.parentElement.parentElement.querySelector('.farm-color-input');


        indicator.style.background = e.target.value;
        input.setAttribute('data-color', e.target.value)
        input.value = value;
    })
})

document.querySelectorAll('.remove-color').forEach(el => {
    el.addEventListener('click', (e) => {

        document.querySelectorAll('.colors-grid input[type=radio]').forEach(radio => {
            radio.checked = false;
        })

        let input = e.target.parentElement.parentElement.querySelector('.farm-color-input');
        let indicator = e.target.parentElement.parentElement.querySelector('.color-indicator div');

        input.setAttribute('data-color', '')
        indicator.style.background = '';

    })
})



// ************************************** //
//          FARM EVENT LISTENERS          //
// ************************************** //
farmListDom.addEventListener('click', function (e) {

    //start farm
    if (e.target.classList.contains('start-farm')) {

        //start farm from farm-events.js
        startFarm(e.target, FARMS, mainFarmKey)

    } else if (e.target.classList.contains('delete-farm')) {

        //delete frm from farm-events.js
        deleteFarm(e.target, FARMS, mainFarmKey, dev)

    } else if (e.target.classList.contains('edit-farm')) {

        editSingleFarmForm(e.target, FARMS);

    }else if (e.target.classList.contains('open-farm')) {

        if(localStorage.getItem('open-iframe') == 'false'){
            e.preventDefault()
            let farmDom = e.target.parentElement.parentElement;
            // openFarm(farmDom.id);
            openFarmIframe(e.target.getAttribute('href'));
        }

    } else if (e.target.classList.contains('select-farm')) {

        selectFarm(e.target, FARMStoUpdate, FARMS, dev);

    } else if (e.target.classList.contains('reset-farm')) {

        let farmDom = e.target.parentElement.parentElement;
        let farm = findFarm(farmDom.id, FARMS).farm;
        let nextDomE = farmDom.nextElementSibling;

        farm.startTime = null;
        farm.timer = null;
        
        //remove farm
        farmDom.remove();

        //build dom el
        farmListDom.insertBefore(createFarmNode(farm), nextDomE)

        updateFarmCount(FARMS);
        showError(`Farm ${farm.number} reseted`, 2);

        //save farms
        localStorage.setItem(mainFarmKey, JSON.stringify(FARMS));

    }
})

document.getElementById('general-store').addEventListener('click', (e)=>{
    if(localStorage.getItem('open-iframe') == 'false'){
        e.preventDefault()
        openFarmIframe(e.currentTarget.getAttribute('href'));
    }
})

// ************************************** //
//                SETTINGS                //
// ************************************** //
const settingInputs = document.querySelectorAll('.setting-input');

settingInputs.forEach(element => {

    if(localStorage.getItem(element.name) == null){
        localStorage.setItem(element.name, 'false');
    }

    var settingValue = localStorage.getItem(element.name) == 'true' ? true : false;
    element.checked = settingValue;

    element.addEventListener('change', (e) => {
        settingsHandler(e.target)
    })
})


// ************************************** //
//               POP UPS                  //
// ************************************** //

const popUps = document.querySelectorAll('.pop-up');
popUps.forEach(element => {
    let closePopBtn = element.querySelector('.pop-close');
    let screen = element.querySelector('.screen');
    let container = element.querySelector('.container');

    //close button event
    closePopBtn.addEventListener('click', () => {
        if(element.classList.contains('game-pop')){
            iframePop.querySelector('iframe').setAttribute('src', '')
        }
        closePop(element);
    })

    //container propagation
    container.addEventListener('click', function (e) {
        e.stopPropagation();
    })

    screen.addEventListener('click', function (e) {
        if(element.classList.contains('game-pop')){
            iframePop.querySelector('iframe').setAttribute('src', '')
        }
        closePop(element);
    })
})

const openPopButtons = document.querySelectorAll('.open-pop');
openPopButtons.forEach(element => {
    let popUp = document.getElementById(element.getAttribute('data-pop'));
    // let popUpType = popUp.getAttribute('data-type');

    element.addEventListener('click', function () {
        openPop(popUp);
    })
})


// ************************************** //
//            EDIT FARM FORMS             //
// ************************************** //
document.querySelectorAll('.edit-farms').forEach(form => {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let formData = new FormData(e.target);
        let formProps = Object.fromEntries(formData);
        let colorInput = e.target.querySelector('input[type=color]')
        let typeOfEdit = formProps.objtype;


        if (dev) {
            console.log('type of Edit: ', typeOfEdit)
        }

        if (typeOfEdit == 'obj') {

            formProps.farmColor = colorInput.getAttribute('data-color');
            let farmId = formProps.farm;
            let farm = findFarm(farmId, FARMS).farm;

            updateFarmDom(farm, formProps, FARMS, mainFarmKey);

            closePop(editPopUpDom);

        } else if (typeOfEdit == 'arr') {

            let farmArr = FARMStoUpdate;

            farmArr.forEach(farm => {
                updateFarmDom(farm, formProps, FARMS, mainFarmKey);
            });

            FARMStoUpdate = [];

            let checkBoxes = farmListDom.querySelectorAll('.select-farm');
            let selectButton = document.getElementById('select-all-farms');

            clearCheckBoxes(checkBoxes);
            selectAllFarmsDom.checked = false

            closePop(massEditPopUpDom);
        }

    })
})

// ************************************** //
//             FILTER FARMS               //
// ************************************** //
filterFarmsDom.addEventListener('click', function (e) {
    let button = e.currentTarget;
    let label = button.querySelector('span');
    let filterType = button.getAttribute('data-filter');
    switch (filterType) {
        case 'completed':

            filterFarms(filterType)

            // console.log('filtering by completed')
            button.setAttribute('data-filter', 'started')
            label.innerHTML = capitalizeFirstLetter(filterType)
            break;
        case 'started':
            filterFarms(filterType)
            // console.log('filtering by started')
            button.setAttribute('data-filter', 'default')
            label.innerHTML = capitalizeFirstLetter(filterType)
            break;
        default:
            filterFarms('default')
            // console.log('filtering by default')
            button.setAttribute('data-filter', 'completed')
            label.innerHTML = capitalizeFirstLetter('default')
            break;
    }
})

function filterFarms(filterBy) {
    console.log(filterBy)
    if (filterBy == 'default') {
        FARMS.forEach(farm => {
            let dom = document.getElementById(farm.number);
            dom.classList.remove('hidden');
        })

        return
    }

    FARMS.forEach(farm => {
        let dom = document.getElementById(farm.number);
        console.log(dom.classList.contains(filterBy))
        if (!dom.classList.contains(filterBy)) {
            dom.classList.add('hidden');
        } else {
            dom.classList.remove('hidden');
        }
    })
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


// ************************************** //
//             MASS DELETING              //
// ************************************** //
document.getElementById('delete-all-farms').addEventListener('click', function (e) {

    let message = "Are you sure you want to delete the selected farms? This can't be undone";
    if (!confirm(message)) {
        return
    }

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

    selectAllFarmsDom.checked = false;
    document.querySelector('.bulk-actions').style.display = 'none';


    localStorage.setItem(mainFarmKey, JSON.stringify(FARMS));
    updateFarmCount(FARMS);
})


// ************************************** //
//             MASS STARTING              //
// ************************************** //
document.getElementById('start-all-farms').addEventListener('click', function (e) {

    if(localStorage.getItem('open-iframe') == 'false'){
        showError('Change your app settings', 1)
        return
    }
    
    let farmsStarted = 0;
    FARMStoUpdate.forEach(farm => {
        let farmDom = document.getElementById(farm.number);

        if (!farmDom.classList.contains('started')) {
            let startButton = farmDom.querySelector('.start-farm');

            startButton.disabled = true
            farmDom.classList.remove('completed');

            let timerDom = farmDom.querySelector('.timer');
            let timer = new easytimer.Timer();

            //saving timer pointer in farm
            farm.timer = timer;
            farm.startTime = new Date().getTime() / 1000;


            let hourFormat = secondsToHourFormat(farm.crop.sproutTimeSeconds);

            // // timer.start({ countdown: true, startValues: {seconds: 10} });
            timer.start({ countdown: true, startValues: { hours: hourFormat[0], minutes: hourFormat[1], seconds: hourFormat[2] } });

            timer.addEventListener('secondsUpdated', handleTimerStart(timerDom, timer));
            farmDom.classList.add('started');

            timer.addEventListener('targetAchieved', function (e) {
                startButton.disabled = false;
                farmDom.classList.add('completed');
                farmDom.classList.remove('started');
                updateFarmCount(FARMS);
            });

            updateFarmCount(FARMS);
            openFarm(farm.number);
        } else {
            farmsStarted += 1;
        }
    });

    let checkBoxes = farmListDom.querySelectorAll('.select-farm');
    selectAllFarmsDom.checked = false;
    document.querySelector('.bulk-actions').style.display = 'none';

    clearCheckBoxes(checkBoxes);

    localStorage.setItem(mainFarmKey, JSON.stringify(FARMS));

    if (farmsStarted == FARMStoUpdate.length) {
        showError('All timers are currently running', 1);
    }

    console.log(farmsStarted, FARMStoUpdate.length)

    FARMStoUpdate = [];
})

// ************************************** //
//           MASS RESET FARMS             //  add a method to check if farms are online
// ************************************** //
document.getElementById('reset-all-farms').addEventListener('click', function (e) {

    for (let i = 0; i < FARMStoUpdate.length; i++) {
        let farmToReset = FARMStoUpdate[i].number;
        let farmToResetDom = document.getElementById(FARMStoUpdate[i].number);
        let nextDomE = farmToResetDom.nextElementSibling;

        for (let f = 0; f < FARMS.length; f++) {
            let farm = FARMS[f];

            if (farm.number == farmToReset) {
                farm.startTime = null;
                farm.timer = null;

                //remove farm
                farmToResetDom.remove();

                //build dom el
                farmListDom.insertBefore(createFarmNode(farm), nextDomE)
            }
        }
    }

    updateFarmCount(FARMS);
    showError(`${FARMStoUpdate.length} farms reseted`, 2);

    FARMStoUpdate = [];
    document.querySelector('.bulk-actions').style.display = 'none';

    //save farms
    localStorage.setItem(mainFarmKey, JSON.stringify(FARMS));
})

// ************************************** //
//             MASS SELECT                //
// ************************************** //
selectAllFarmsDom.addEventListener('change', function (e) {
    let button = e.target;
    let checkBoxes = farmListDom.querySelectorAll('.select-farm');


    if (button.checked == false) {
        //deselecting
        FARMStoUpdate = [];
        clearCheckBoxes(checkBoxes);
        document.querySelector('.bulk-actions').style.display = 'none';
    } else {

        //selecting
        FARMStoUpdate = [...FARMS];

        checkBoxes.forEach(element => {
            element.checked = true
        });

        if (FARMStoUpdate.length > 1) {
            document.querySelector('.bulk-actions').style.display = 'inline-flex';
        }

    }

})

// ************************************** //
//             EXPORT FARMS               //
// ************************************** //
exportAllFarms.addEventListener('click', function (e) {
    if (FARMS.length > 0) {
        let farmsToExport = localStorage.getItem(mainFarmKey);
        download('exported-farms', farmsToExport)
    }
})


// ************************************** //
//             MASS IMPORT FARMS          //
// ************************************** //
let importForm = document.getElementById('import-farms');
let importContainer = importForm.querySelector('.file-upload');
let droppedFile;

importForm.addEventListener('dragover', function (e) {
    e.preventDefault();
    importContainer.classList.add('is-dragover');
}, false)
importForm.addEventListener('dragenter', function (e) {
    e.preventDefault();
    importContainer.classList.add('is-dragover');
}, false)
importForm.addEventListener('dragleave', function (e) {
    e.preventDefault();
    importContainer.classList.remove('is-dragover');
}, false)
importForm.addEventListener('dragend', function (e) {
    e.preventDefault();
    importContainer.classList.remove('is-dragover');
}, false)

importForm.addEventListener('drop', function (e) {
    e.preventDefault();
    importContainer.classList.remove('is-dragover');
    droppedFile = e.dataTransfer.files[0];

    //check file extension
    let ext = droppedFile.name.split('.')[1];
    console.log(ext);

    if (ext != 'txt') {
        droppedFile = null;
        importForm.querySelector('button').disabled = true;
        importForm.querySelector('p').innerHTML = `<span>Click here to upload </span> or drag and drop <br>txt file`;
        showError('Unsuported file extension');
        return
    }

    console.log('accepted file')
    importForm.querySelector('p').innerHTML = `<span>${droppedFile.name}</span>`;
    importForm.querySelector('button').disabled = false;


}, false)

document.getElementById('file')
    .addEventListener('change', function () {
        let ext = this.files[0].name.split('.')[1];
        let file = this.files[0];
        console.log()

        //check file extension
        if (ext != 'txt') {
            importForm.querySelector('button').disabled = true;
            importForm.querySelector('p').innerHTML = `<span>Click here to upload </span> or drag and drop <br>txt file`;
            showError('Unsuported file extension');
            return
        }


        console.log('accepted file')
        importForm.querySelector('p').innerHTML = `<span>${file.name}</span>`;
        importForm.querySelector('button').disabled = false;

        var fr = new FileReader();
        fr.readAsText(this.files[0]);
        fr.onload = function () {
            console.log(fr.result)
        }
    })


//mass import event

importForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let formData = new FormData(e.target);
    let formProps = Object.fromEntries(formData);

    var fr = new FileReader();
    fr.readAsText(droppedFile != undefined || droppedFile != null ? droppedFile : formProps.file);
    fr.onload = function () {
        // importForm.querySelector('p').innerHTML = `<span>Click here to upload </span> or drag and drop <br>txt file`;
        // importForm.querySelector('button').disabled = false;
        importClean(fr.result, FARMS, mainFarmKey);
    }
})

// ************************************** //
//              ACCOIRDIONS               //
// ************************************** //
let aboutPop = document.getElementById('about-pop-up')
let categoriesBtn = document.querySelectorAll('#about-pop-up .categories button');
let categoriesContainers = document.querySelectorAll('#about-pop-up .categories-content >div');
categoriesBtn.forEach(button => {
    button.addEventListener('click', function (e) {
        e.preventDefault();
        categoriesBtn.forEach(btn => {
            btn.classList.remove('active')
        })
        categoriesContainers.forEach(el => {
            el.classList.remove('active')
        })

        let container = document.getElementById(button.getAttribute('data-cat'));

        e.target.classList.add('active')
        container.classList.add('active')

    })
})

let accordionItems = document.querySelectorAll('#about-pop-up .acordion-item');
accordionItems.forEach(item => {
    item.addEventListener('click', function (e) {
        e.stopPropagation();
        var current = e.currentTarget;
        accordionItems.forEach(el => {
            if (el == current) {
                if (current.classList.contains('open')) {
                    current.classList.remove('open')
                } else {
                    current.classList.add('open')
                }
            } else {
                el.classList.remove('open')
            }
        })



    })
})

