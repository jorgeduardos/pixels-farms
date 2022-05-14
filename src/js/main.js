import Sortable from 'sortablejs';
import Dropzone from "dropzone";
import { arrayMoveMutable } from 'array-move';
import {
    farmListDom, editPopUpDom, massEditPopUpDom, importPopUpDom, selectAllFarmsDom, exportAllFarms
} from './consts';
import CROPS from './crops';
import { openPop, closePop, clearCheckBoxes, download, secondsToHourFormat, handleTimerStart, showError } from './misc'
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
        if (farm.crop.sproutTimeSeconds == undefined) {
            CROPS.forEach(crop => {
                if(crop.id == farm.crop.id)
                farm.crop.sproutTimeSeconds = crop.sproutTimeSeconds;
            })
        }
        if (farm.info == undefined) {
            farm.info = {};
        }

        farmListDom.appendChild(createFarmNode(farm));

        if (farm.startTime != undefined && farm.startTime != null) {
            // console.log('continuing farm timer')
            continueFarmTimer(farm)
        }
    });

    //update far counters after creating farm nodes
    // updateFarmCount(FARMS);

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
    const formColorImput = e.target.querySelector('input[type=color]');

    e.target.querySelector('.farmNumber').focus();

    // console.log(e.target)
    formProps.farmColor = formColorImput.getAttribute('data-color');
    addFarm(e.target, formProps, FARMS, dev);
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
        // if (popUpType == 'edit') {
        //     cleanEditForm(popUp.querySelector('form'))
        // }
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

            clearCheckBoxes(checkBoxes);
            selectAllFarmsDom.checked = false

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

    selectAllFarmsDom.checked = false;
    document.querySelector('.bulk-actions').style.display = 'none';


    localStorage.setItem("farms", JSON.stringify(FARMS));
    // updateFarmCount(FARMS);
})


// ************************************** //
//             MASS STARTING              //
// ************************************** //
document.getElementById('start-all-farms').addEventListener('click', function (e) {
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
            farm.startTime = new Date().getTime()/1000;
    
        
            let hourFormat = secondsToHourFormat(farm.crop.sproutTimeSeconds);
        
            // // timer.start({ countdown: true, startValues: {seconds: 10} });
            timer.start({ countdown: true, startValues: {hours: hourFormat[0], minutes: hourFormat[1], seconds: hourFormat[2]}});
        
            timer.addEventListener('secondsUpdated', handleTimerStart(timerDom, timer));
            farmDom.classList.add('started');
        
            timer.addEventListener('targetAchieved', function (e) {
                startButton.disabled = false;
                farmDom.classList.add('completed');
                farmDom.classList.remove('started');
                // updateFarmCount(farms);
            });
        
            // updateFarmCount(farms);
            openFarm(farm.number);
        }else{
            farmsStarted += 1;
        }
    });

    let checkBoxes = farmListDom.querySelectorAll('.select-farm');
    selectAllFarmsDom.checked = false;
    document.querySelector('.bulk-actions').style.display = 'none';

    clearCheckBoxes(checkBoxes);

    localStorage.setItem("farms", JSON.stringify(FARMS));

    if(farmsStarted == FARMStoUpdate.length){
        showError('All timers are currently running', 1);
    }

    console.log(farmsStarted, FARMStoUpdate.length)

    FARMStoUpdate = [];
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

        if(FARMStoUpdate.length > 1){
            document.querySelector('.bulk-actions').style.display = 'inline-flex';
        }

    }

})

// ************************************** //
//             EXPORT FARMS               //
// ************************************** //
exportAllFarms.addEventListener('click', function (e) {
    if (FARMS.length > 0) {
        let farmsToExport = localStorage.getItem("farms");
        download('exported-farms', farmsToExport)
    }
})


// ************************************** //
//             MASS IMPORT FARMS          //
// ************************************** //
let importForm = document.getElementById('import-farms');
let myDropzone = new Dropzone("#import-farms", {
    autoProcessQueue: false,
    uploadMultiple: false,
    clickable: true,
    acceptedFiles: '.txt, .xml, .doc',
    // disablePreviews: true,

    init: function() {
        var myDropzone = this;
    
        // First change the button to actually tell Dropzone to process the queue.
        this.element.querySelector("button[type=submit]").addEventListener("click", function(e) {
          // Make sure that the form isn't actually being sent.
          e.preventDefault();
          e.stopPropagation();
        //   myDropzone.processQueue();
        });
    
        // Listen to the sendingmultiple event. In this case, it's the sendingmultiple event instead
        // of the sending event because uploadMultiple is set to true.
        this.on("sendingmultiple", function() {
          // Gets triggered when the form is actually being sent.
          // Hide the success button or the complete form.
        });
        this.on("successmultiple", function(files, response) {
          // Gets triggered when the files have successfully been sent.
          // Redirect user or notify of success.
        });
        this.on("errormultiple", function(files, response) {
          // Gets triggered when there was an error sending the files.
          // Maybe show form again, and notify user of error
        });
    }
});

myDropzone.on("addedfile", file => {
    console.log(file)
    importForm.querySelector('button').disabled = false
    if(file.accepted){
        importForm.querySelector('p').innerHTML = `<span class="blue">${file.name}</span>`
    }else{
        importForm.querySelector('p').innerHTML = `File not permitted <br>please add another one`;
    }
});





// var examplePlaceholder = '[{"number":"3084","crop":{"id":2,"name":"Scarrot","sproutTime":{"hours":5,"minutes":20,"seconds":0}},"timer":null,"startTime":null},{"number":"3223","crop":{"id":2,"name":"Scarrot","sproutTime":{"hours":5,"minutes":20,"seconds":0}},"timer":null,"startTime":null}';
// var examplePlaceholder2 = 'https://play.pixels.online/farm1688\nhttps://play.pixels.online/farm2766\nhttps://play.pixels.online/farm2130\nhttps://play.pixels.online/farm3535';
// var importTextArea = document.getElementById('import-data');
// document.querySelector(".file-type-container").addEventListener('click', function (event) {
//     if (event.target && event.target.matches("input[type='radio']")) {
//         if (event.target.value == 'exported') {
//             importTextArea.setAttribute('placeholder', examplePlaceholder)
//         } else {
//             importTextArea.setAttribute('placeholder', examplePlaceholder2)
//         }
//     }
// });

//mass import event

// document.getElementById('import-form').addEventListener('submit', function (e) {
//     e.preventDefault();
//     let formData = new FormData(e.target);
//     let formProps = Object.fromEntries(formData);
//     let textarea = e.target.querySelector('textarea');

//     textarea.value = '';

//     importClean(formProps.farms, formProps.file);

//     // window.location.reload();
// })

// ************************************** //
//             RESET FARMS                //
// ************************************** //
// document.getElementById('reset').addEventListener('click', function (e) {

//     if (FARMS.length > 0) {

//         FARMS.forEach(farm => {
//             farm.startTime = null;
//             farm.timer = null;
//         })

//         localStorage.setItem("farms", JSON.stringify(FARMS));
//         window.location.reload();
//     }
// })

// ************************************** //
//              ERROR HANDLING            //
// ************************************** //


