import Sortable from 'sortablejs';
import { arrayMoveMutable } from 'array-move';
import {
    farmListDom, farmInput, editPopUpDom, massEditPopUpDom, importPopUpDom, selectAllFarmsDom,
    errorDom, addColorInputDom, editColorInputDom, regex,
    farmCountDom, farmReadytDom, farmStartedDom
} from './consts';
import CROPS from './crops';
import { openPop, closePop, updateFarmCount, clearCheckBoxes, download, importClean, cleanEditForm } from './misc'
import { startFarm, deleteFarm, editSingleFarmForm, selectFarm } from './farm-events';
import {
    openFarm, editFarm, createFarmNode, updateFarmDom, findFarm,
    continueFarmTimer, addFarm
} from './farm-helpers';

// is in dev mode to print console logs
var dev = false;

var storedFarms = JSON.parse(localStorage.getItem("farms"));
var FARMS = [];
var FARMStoUpdate = [];


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
        localStorage.setItem("farms", JSON.stringify(FARMS));
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

    farmInput.focus();

    // console.log(addColorInputDom.getAttribute('data-color'))
    formProps.farmColor = addColorInputDom.getAttribute('data-color');
    addFarm(formProps, FARMS, dev);
})


// **************************************  //
//             ADD COLOR                   //
// ************************************** //
document.querySelectorAll('.add-color').forEach(el => {
    el.addEventListener('click', e => {
        let button = e.target;
        let parent = button.parentElement;
        let colorInputDom = parent.querySelector('input');

        if (parent.classList.contains('show')) {
            parent.classList.remove('show')
            colorInputDom.setAttribute('data-color', null)
        } else {
            parent.classList.add('show')
            colorInputDom.click();
            colorInputDom.setAttribute('data-color', colorInputDom.value)
        }

        // console.log(colorInputDom.getAttribute('data-color'))
    })
})

document.querySelectorAll('.farm-color-input').forEach(el => {
    el.addEventListener('change', (e) => {
        let imput = e.target;
        imput.setAttribute('data-color', imput.value)
        // console.log(imput.getAttribute('data-color'))
    })
})



// ************************************** //
//          FARM EVENT LISTENERS          //
// ************************************** //
farmListDom.addEventListener('click', function (e) {

    //start farm
    if (e.target.classList.contains('start-farm')) {

        //start farm from farm-events.js
        startFarm(e.target, FARMS)

    } else if (e.target.classList.contains('delete-farm')) {

        //delete frm from farm-events.js
        deleteFarm(e.target, FARMS, dev)

    } else if (e.target.classList.contains('open-farm')) {

        let farmDom = e.target.parentElement.parentElement;
        openFarm(farmDom.id);

    } else if (e.target.classList.contains('edit-farm')) {

        editSingleFarmForm(e.target, FARMS);

    } else if (e.target.classList.contains('select-farm')) {

        selectFarm(e.target, FARMStoUpdate, FARMS, dev);

    }
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
        closePop(element);
    })

    //container propagation
    container.addEventListener('click', function (e) {
        e.stopPropagation();
    })

    screen.addEventListener('click', function (e) {
        closePop(element);
    })
})

const openPopButtons = document.querySelectorAll('.open-pop');
openPopButtons.forEach(element => {
    let popUp = document.getElementById(element.getAttribute('data-pop'));
    let popUpType = popUp.getAttribute('data-type');

    element.addEventListener('click', function () {
        // console.log(popUpType)
        if (popUpType == 'edit') {
            cleanEditForm(popUp.querySelector('form'))
        }
        openPop(popUp);
    })
})


// ************************************** //
//            EDIT FARM FORM              //
// ************************************** //
document.querySelectorAll('.edit-farms').forEach(form => {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let formData = new FormData(e.target);
        let formProps = Object.fromEntries(formData);

        formProps.farmColor = editColorInputDom.getAttribute('data-color');

        let typeOfEdit = formProps.objtype;

        if (dev) {
            console.log('type of Edit: ', typeOfEdit)
        }


        if (typeOfEdit == 'obj') {

            let farmId = formProps.farm;
            let farm = findFarm(farmId, FARMS).farm;

            updateFarmDom(farm, formProps, FARMS);

            closePop(editPopUpDom);

        } else if (typeOfEdit == 'arr') {

            let farmArr = FARMStoUpdate;

            farmArr.forEach(farm => {
                updateFarmDom(farm, formProps, FARMS);
            });

            FARMStoUpdate = [];

            let checkBoxes = farmListDom.querySelectorAll('.select-farm');
            let selectButton = document.getElementById('select-all-farms');

            clearCheckBoxes(checkBoxes, selectButton);

            closePop(massEditPopUpDom);
        }

    })
})



// ************************************** //
//             MASS DELETING              //
// ************************************** //
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


// ************************************** //
//             MASS STARTING              //
// ************************************** //
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

// ************************************** //
//             MASS SELECT                //
// ************************************** //
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

// ************************************** //
//             EXPORT FARMS               //
// ************************************** //
document.getElementById('export-farms').addEventListener('click', function (e) {
    if (FARMS.length > 0) {
        let farmsToExport = localStorage.getItem("farms");
        download('exported-farms', farmsToExport)
    }
})


// ************************************** //
//             MASS IMPORT FARMS          //
// ************************************** //
var examplePlaceholder = '[{"number":"3084","crop":{"id":2,"name":"Scarrot","sproutTime":{"hours":5,"minutes":20,"seconds":0}},"timer":null,"startTime":null},{"number":"3223","crop":{"id":2,"name":"Scarrot","sproutTime":{"hours":5,"minutes":20,"seconds":0}},"timer":null,"startTime":null}';
var examplePlaceholder2 = 'https://play.pixels.online/farm1688\nhttps://play.pixels.online/farm2766\nhttps://play.pixels.online/farm2130\nhttps://play.pixels.online/farm3535';
var importTextArea = document.getElementById('import-data');
document.querySelector(".file-type-container").addEventListener('click', function (event) {
    if (event.target && event.target.matches("input[type='radio']")) {
        if (event.target.value == 'exported') {
            importTextArea.setAttribute('placeholder', examplePlaceholder)
        } else {
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

// ************************************** //
//             RESET FARMS                //
// ************************************** //
document.getElementById('reset').addEventListener('click', function (e) {

    if (FARMS.length > 0) {

        FARMS.forEach(farm => {
            farm.startTime = null;
            farm.timer = null;
        })

        localStorage.setItem("farms", JSON.stringify(FARMS));
        window.location.reload();
    }
})

// ************************************** //
//              ERROR HANDLING            //
// ************************************** //

function showError(errorMessage, errorCode) {
    errorDom.querySelector('p').innerHTML = errorMessage;

    if (errorCode == 0) {
        errorDom.classList.add('show', 'error');
    } else if (errorCode == 1) {
        errorDom.classList.add('show', 'warning');
    } else {

        errorDom.classList.add('show', 'error');
    }

    setTimeout(function () {
        errorDom.classList.remove('show', 'error', 'warning');
    }, 5000)
}

