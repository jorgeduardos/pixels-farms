import CROPS from './crops';
import { farmListDom,farmCountDom, farmReadytDom, farmStartedDom, regex, selectAllFarmsDom, iframeInfo } from './consts';
import { updateFarmCount, showError, secondsToHourFormat } from './misc';

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

export function farmIframeInfo(farm, index, farms){
    iframeInfo.style.display = 'flex';
    iframeInfo.querySelector('.farm-number span').innerHTML = farm.number;
    iframeInfo.querySelector('.crop-type').classList.remove('scarrot', 'popberry', 'grumpkin');
    iframeInfo.querySelector('.crop-type').classList.add(farm.crop.name.toLowerCase()); 
    iframeInfo.querySelector('.arr-length').innerHTML = farms.length;
    iframeInfo.querySelector('.index').innerHTML = index + 1;
}

export function openFarm(farmNumber) {
    window.open(`https://play.pixels.online/farm${farmNumber}`, "_blank");
}

export function updateFarmDom(farmToUpdate, data, farms, localStorageKey) {

    let farm = farmToUpdate;
    let prevCrop = farm.crop;
    let farmColor = data.farmColor == 'null' ? null : data.farmColor;
    let farmDom = document.getElementById(farm.number);
    let nextDomE = farmDom.nextElementSibling;


    //update farm in the arr (type and startTimer)
    if (data.type != undefined) {
        farm.crop = CROPS[data.type];
        // let cropTimer = farm.crop.sproutTimeSeconds;
        farm.startTime = null;
        farm.timer = null;
    }

    farm.info.color = farmColor == null ? farm.info.color : farmColor;

    if(data.objtype == 'obj'){
        farm.info.notes = data.farmNotes == undefined ? '' : data.farmNotes;
    }

    if(data.objtype == 'arr'){
        document.querySelector('.bulk-actions').style.display = 'none';
    }


    //save in local localStorage
    localStorage.setItem(localStorageKey, JSON.stringify(farms));

    //build dom tree
    farmDom.remove();
    farmListDom.insertBefore(createFarmNode(farm), nextDomE)

}


export function createFarmNode(farm) {
    var tag = document.createElement("div");
    tag.classList.add('farm', 'row');
    tag.setAttribute('id', farm.number);
    tag.setAttribute('data-id', farm.number);

    let cropName = farm.crop.name.toLowerCase();
    let cropTimer;

    let colorDom = farm.info.color == undefined || farm.info.color == null ? '<div class="color"></div>' : `<div class="color" style="background-color: ${farm.info.color}; border-color: ${farm.info.color}"></div>`
    let notesDom = farm.info.notes == undefined || farm.info.notes == '' ? '' : ` <div class="notes"><div class="info"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.99996 18.3334C14.6023 18.3334 18.3333 14.6024 18.3333 10C18.3333 5.39765 14.6023 1.66669 9.99996 1.66669C5.39759 1.66669 1.66663 5.39765 1.66663 10C1.66663 14.6024 5.39759 18.3334 9.99996 18.3334Z" stroke="#B0B7C3" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 13.3333V10" stroke="#B0B7C3" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 6.66669H10.0083" stroke="#B0B7C3" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/></svg><div class="content"><p>${farm.info.notes}</p></div></div></div>`


    // if crop timer was started, use it
    if (farm.startTime != undefined && farm.startTime != null) {
        cropTimer = {
            hours: '',
            minutes: '',
            seconds: ''
        }

    } else {
        let hourFormat = secondsToHourFormat(farm.crop.sproutTimeSeconds);
        cropTimer = {
            hours:  hourFormat[0],
            minutes: hourFormat[1],
            seconds: hourFormat[2]
        }
    }

    tag.innerHTML = `  <div class="container input">
            <input type="checkbox" name="select-farm" class="select-farm" id="check-${farm.number}">
        </div>
        <div class="container crop">
            <div class="crop-type ${cropName}"></div>
        </div>
        <div class="container number farm-header">
            <div>
                ${colorDom}
                <label for="check-${farm.number}"><p>Farm ${farm.number}</p></label>
                ${notesDom}
            </div>
            <button class="delete-farm btn-icon" title="Delete Farm">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.88384 0.0666682L7.7968 0.0665819C7.38672 0.0659695 7.02679 0.0654321 6.70608 0.191566C6.42565 0.301858 6.1774 0.480789 5.98409 0.711951C5.76301 0.976316 5.6497 1.31794 5.5206 1.70717L5.49316 1.78977L5.2342 2.56667H2.33332H0.66665C0.33528 2.56667 0.0666504 2.8353 0.0666504 3.16667C0.0666504 3.49804 0.33528 3.76667 0.66665 3.76667H1.76757L2.2842 12.5492L2.2857 12.5747C2.33431 13.4013 2.37289 14.0572 2.4464 14.5855C2.52166 15.1264 2.63911 15.5824 2.87192 15.9963C3.25038 16.6691 3.82481 17.2107 4.51873 17.549C4.94559 17.7571 5.40765 17.8476 5.95205 17.891C6.48373 17.9333 7.14081 17.9333 7.96879 17.9333H7.99433H10.0056H10.0312C10.8592 17.9333 11.5162 17.9333 12.0479 17.891C12.5923 17.8476 13.0544 17.7571 13.4812 17.549C14.1752 17.2107 14.7496 16.6691 15.128 15.9963C15.3609 15.5824 15.4783 15.1264 15.5536 14.5855C15.6271 14.0572 15.6657 13.4013 15.7143 12.5747L15.7158 12.5492L16.2324 3.76667H17.3333C17.6647 3.76667 17.9333 3.49804 17.9333 3.16667C17.9333 2.8353 17.6647 2.56667 17.3333 2.56667H15.6667H12.7658L12.5068 1.78977L12.4794 1.70718C12.3503 1.31794 12.237 0.976316 12.0159 0.711951C11.8226 0.480789 11.5743 0.301858 11.2939 0.191566C10.9732 0.0654321 10.6132 0.0659695 10.2032 0.0665819L10.1161 0.0666682H7.88384ZM12.3193 3.76667C12.3286 3.76688 12.3378 3.76689 12.3471 3.76667H15.0303L14.5178 12.4788C14.4674 13.3365 14.4312 13.9447 14.365 14.4201C14.2999 14.8883 14.2114 15.1782 14.0821 15.408C13.8232 15.8683 13.4302 16.2389 12.9554 16.4704C12.7184 16.5859 12.4238 16.6572 11.9526 16.6948C11.4742 16.7329 10.8649 16.7333 10.0056 16.7333H7.99433C7.13511 16.7333 6.52579 16.7329 6.04735 16.6948C5.57618 16.6572 5.28153 16.5859 5.04459 16.4704C4.5698 16.2389 4.17677 15.8683 3.91782 15.408C3.7886 15.1782 3.70008 14.8883 3.63495 14.4201C3.5688 13.9447 3.53258 13.3365 3.48212 12.4788L2.96965 3.76667H5.65284C5.66213 3.76689 5.67139 3.76688 5.68063 3.76667H12.3193ZM11.5009 2.56667L11.3684 2.16925C11.1948 1.64859 11.1506 1.54789 11.0953 1.48176C11.0309 1.40471 10.9482 1.34506 10.8547 1.3083C10.7745 1.27675 10.6649 1.26667 10.1161 1.26667H7.88384C7.33502 1.26667 7.22551 1.27675 7.14529 1.3083C7.05181 1.34506 6.96906 1.40471 6.90463 1.48176C6.84933 1.54789 6.80513 1.64859 6.63158 2.16925L6.49911 2.56667H11.5009ZM7.93334 7.33333C7.93334 7.00196 7.66471 6.73333 7.33334 6.73333C7.00197 6.73333 6.73334 7.00196 6.73334 7.33333V13.1667C6.73334 13.498 7.00197 13.7667 7.33334 13.7667C7.66471 13.7667 7.93334 13.498 7.93334 13.1667V7.33333ZM10.6666 6.73333C10.998 6.73333 11.2667 7.00196 11.2667 7.33333V10.6667C11.2667 10.998 10.998 11.2667 10.6666 11.2667C10.3353 11.2667 10.0666 10.998 10.0666 10.6667V7.33333C10.0666 7.00196 10.3353 6.73333 10.6666 6.73333Z" fill="#2E2C34"/></svg>
            </button>
        </div>
        <div class="container time">
            <svg class="clock-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.3" fill-rule="evenodd" clip-rule="evenodd" d="M12 21C7.58172 21 4 17.4183 4 13C4 8.58172 7.58172 5 12 5C16.4183 5 20 8.58172 20 13C20 17.4183 16.4183 21 12 21Z" fill="black"/><path class="white" fill-rule="evenodd" clip-rule="evenodd" d="M13 5.06189V4H14C14.5523 4 15 3.55228 15 3C15 2.44772 14.5523 2 14 2H10C9.44772 2 9 2.44772 9 3C9 3.55228 9.44772 4 10 4H11V5.06189C11.3276 5.02104 11.6613 5 12 5C12.3387 5 12.6724 5.02104 13 5.06189Z" fill="black"/><path class="white" fill-rule="evenodd" clip-rule="evenodd" d="M18.1672 7.90393L18.9498 7.12132C19.3403 6.7308 19.3403 6.09763 18.9498 5.70711C18.5593 5.31658 17.9261 5.31658 17.5356 5.70711L16.71 6.53273C17.2511 6.9275 17.7408 7.38855 18.1672 7.90393Z" fill="black"/><path class="white" fill-rule="evenodd" clip-rule="evenodd" d="M11.4646 7.96165C11.4846 7.70115 11.7018 7.5 11.9631 7.5H12.0371C12.2984 7.5 12.5156 7.70115 12.5356 7.96165L12.9587 13.4617C12.981 13.752 12.7514 14 12.4602 14H11.54C11.2488 14 11.0192 13.752 11.0415 13.4617L11.4646 7.96165Z" fill="black"/></svg>

            <p class="timer">${cropTimer.hours == 0 ? '00' : cropTimer.hours}:${cropTimer.minutes == 0 ? '00' : cropTimer.minutes}:${cropTimer.seconds == 0 ? '00' : cropTimer.seconds}</p>


            <button class="start-farm btn-icon text" title="Start Farm">
                <svg class="play-svg" width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.97 0C5.44997 0 0.969971 4.48 0.969971 10C0.969971 15.52 5.44997 20 10.97 20C16.49 20 20.97 15.52 20.97 10C20.97 4.48 16.5 0 10.97 0ZM13.97 12.23L11.07 13.9C10.71 14.11 10.31 14.21 9.91997 14.21C9.51997 14.21 9.12997 14.11 8.76997 13.9C8.04997 13.48 7.61997 12.74 7.61997 11.9V8.55C7.61997 7.72 8.04997 6.97 8.76997 6.55C9.48997 6.13 10.35 6.13 11.08 6.55L13.98 8.22C14.7 8.64 15.13 9.38 15.13 10.22C15.13 11.06 14.7 11.81 13.97 12.23Z" fill="#4FBF67"/></svg>
                <svg class="completed-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z" fill="white"/></svg>
                start
            </button>
        </div>
        <div class="container action">
            <button class="reset-farm btn-icon" title="Reset Farm">
                <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 4.5L1.05806 4.94194L0.616116 4.5L1.05806 4.05806L1.5 4.5ZM4.625 12C4.27982 12 4 11.7202 4 11.375C4 11.0298 4.27982 10.75 4.625 10.75L4.625 12ZM4.18306 8.06694L1.05806 4.94194L1.94194 4.05806L5.06694 7.18306L4.18306 8.06694ZM1.05806 4.05806L4.18306 0.933058L5.06694 1.81694L1.94194 4.94194L1.05806 4.05806ZM1.5 3.875L8.0625 3.875L8.0625 5.125L1.5 5.125L1.5 3.875ZM8.0625 12L4.625 12L4.625 10.75L8.0625 10.75L8.0625 12ZM12.125 7.9375C12.125 10.1812 10.3062 12 8.0625 12L8.0625 10.75C9.6158 10.75 10.875 9.4908 10.875 7.9375L12.125 7.9375ZM8.0625 3.875C10.3062 3.875 12.125 5.69384 12.125 7.9375L10.875 7.9375C10.875 6.3842 9.6158 5.125 8.0625 5.125L8.0625 3.875Z" fill="#2E2C34"/></svg>
            </button>
            <button class="edit-farm btn-icon" title="Edit Farm" data-poptoopen="edit-pop-up">
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.2923 16.2831H10.2482C9.90317 16.2831 9.62317 16.0031 9.62317 15.6581C9.62317 15.3131 9.90317 15.0331 10.2482 15.0331H16.2923C16.6373 15.0331 16.9173 15.3131 16.9173 15.6581C16.9173 16.0031 16.6373 16.2831 16.2923 16.2831Z" fill="#2E2C34"/><mask id="mask0_35_2505" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="15" height="17"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.666992 0.50013H14.9841V16.2831H0.666992V0.50013Z" fill="white"/></mask><g mask="url(#mask0_35_2505)"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.92556 2.18067L2.07972 11.9932C1.93722 12.1715 1.88472 12.4015 1.93722 12.6223L2.50472 15.0265L5.03722 14.9948C5.27806 14.9923 5.50056 14.8848 5.64806 14.7015C8.32889 11.3473 13.4397 4.95233 13.5847 4.76483C13.7214 4.54317 13.7747 4.22983 13.7031 3.92817C13.6297 3.619 13.4372 3.3565 13.1597 3.189C13.1006 3.14817 11.6964 2.05817 11.6531 2.024C11.1247 1.60067 10.3539 1.674 9.92556 2.18067ZM2.01139 16.2832C1.72222 16.2832 1.47055 16.0848 1.40305 15.8023L0.720554 12.9098C0.579721 12.3107 0.719721 11.6923 1.10389 11.2123L8.95389 1.394C8.95722 1.39067 8.95972 1.3865 8.96305 1.38317C9.82389 0.353999 11.3806 0.202332 12.4306 1.04483C12.4722 1.07733 13.8664 2.16067 13.8664 2.16067C14.3731 2.46233 14.7689 3.0015 14.9189 3.63983C15.0681 4.2715 14.9597 4.92316 14.6122 5.474C14.5864 5.51483 14.5639 5.54983 6.62389 15.4832C6.24139 15.9598 5.66805 16.2373 5.05222 16.2448L2.01972 16.2832H2.01139Z" fill="#2E2C34"/></g><path fill-rule="evenodd" clip-rule="evenodd" d="M12.5196 7.73733C12.3863 7.73733 12.2529 7.69483 12.1388 7.60817L7.59543 4.11817C7.3221 3.90817 7.27043 3.5165 7.48043 3.2415C7.69126 2.96817 8.08293 2.91733 8.3571 3.12733L12.9013 6.6165C13.1746 6.8265 13.2263 7.219 13.0154 7.49317C12.8929 7.65317 12.7071 7.73733 12.5196 7.73733Z" fill="#2E2C34"/></svg>
            </button>
            <a href="https://play.pixels.online/farm${farm.number}" target="_blank" class="open-farm btn-icon text btn" title="Open Farm">
                <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="export"><path id="Vector" d="M7.58325 6.91666L12.3666 2.13333" stroke="#292D32" stroke-width="1.06944" stroke-linecap="round" stroke-linejoin="round"/><path id="Vector_2" d="M12.8332 4.46666V1.66666H10.0332" stroke="#292D32" stroke-width="1.06944" stroke-linecap="round" stroke-linejoin="round"/><path id="Vector_3" d="M6.41675 1.66666H5.25008C2.33341 1.66666 1.16675 2.83332 1.16675 5.74999V9.24999C1.16675 12.1667 2.33341 13.3333 5.25008 13.3333H8.75008C11.6667 13.3333 12.8334 12.1667 12.8334 9.24999V8.08332" stroke="#292D32" stroke-width="1.06944" stroke-linecap="round" stroke-linejoin="round"/></g></svg>
                Open Farm
            </a>
        </div>`;

    return tag;

}


export function continueFarmTimer(farm) {
    let farmDom = document.getElementById(farm.number);
    let timerDom = farmDom.querySelector('.timer');

    let now = new Date().getTime()/1000;
    let timePassed = now - farm.startTime;

    if(timePassed >= farm.crop.sproutTimeSeconds){
        farmDom.classList.add('completed');
        timerDom.innerHTML = '00:00:00';
        return
    }

    let timeLeftOnTimer = farm.crop.sproutTimeSeconds - timePassed;

    let timer = new easytimer.Timer();
    farm.timer = timer;
    farmDom.querySelector('.start-farm').disabled = true;

    let hourFormat = secondsToHourFormat(timeLeftOnTimer);

    // // timer.start({ countdown: true, startValues: {seconds: 10} });
    timer.start({ countdown: true, startValues: {hours: hourFormat[0], minutes: hourFormat[1], seconds: hourFormat[2]} });

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

export function addFarm(formDom, form, farms, localStorageKey, dev = false) {

    let crop = CROPS[form.type]

    var match = regex.exec(form.farmNumber);
    let number = match == null ? form.farmNumber : match[0];

    //errOr handling
    if (isNaN(number * 1)) {
        return showError('Invalid Farm');
    } else if ((number * 1) > 5000 || (number * 1) < 0) {
        return showError('Invalid Farm');
    } else if (farms.length > 0 && findFarm(number, farms) != null) {
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

    farms.push(farm);
    updateFarmCount(farms);

    //reset form fields
    formDom.querySelector('.farmNumber').value = ''
    formDom.querySelector('.farmNotes').value = ''
    formDom.querySelector('.farmNumber').focus

    // if (farms.length > 1) {
    //     selectAllFarmsDom.disabled = false;
    // }

    localStorage.setItem(localStorageKey, JSON.stringify(farms));

    if (dev) {
        console.log('farms after add: ', farms);
    }

    //create dom element and add it
    showError(`Farm ${number} added to the bottom`, 2);
    farmListDom.appendChild(createFarmNode(farm));
}
