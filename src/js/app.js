import Sortable from 'sortablejs';
import { arrayMoveMutable } from 'array-move';

var dev = false;
const farmListDom = document.querySelector('.farm-list');
const farmInput = document.getElementById('farmNumber');

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
    });
}


const regex = /(?<=farm)[^/\s]*/i;

const crops = [
    {
        id: 0,
        name: 'Popberry',
        sproutTime: {
            hours: 2,
            minutes: 0
        }, // in hours
    },
    {
        id: 1,
        name: 'Grumpkin',
        sproutTime: {
            hours: 4,
            minutes: 0
        },  // in hours
    },
    {
        id: 2,
        name: 'Scarrot',
        sproutTime: {
            hours: 5,
            minutes: 20
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
    }

    farms.push(farm);
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

    tag.innerHTML = `<h4>Farm ${farm.number}</h4>
        <div class="crop-type ${cropName}"></div>
        <div class="timer">${farm.crop.sproutTime.hours}:${farm.crop.sproutTime.minutes == 0 ? '00' : farm.crop.sproutTime.minutes}</div>

        <div class="ui">
            <button class="delete-farm">Delete</button>
            <button class="start-farm">Start</button>
        </div>`;

    farmListDom.appendChild(tag);

}

/// helpers




