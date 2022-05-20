/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/consts.js":
/*!**************************!*\
  !*** ./src/js/consts.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "defaultFarmKey": () => (/* binding */ defaultFarmKey),
/* harmony export */   "editPopUpDom": () => (/* binding */ editPopUpDom),
/* harmony export */   "errorDom": () => (/* binding */ errorDom),
/* harmony export */   "exportAllFarms": () => (/* binding */ exportAllFarms),
/* harmony export */   "farmCountDom": () => (/* binding */ farmCountDom),
/* harmony export */   "farmListDom": () => (/* binding */ farmListDom),
/* harmony export */   "farmReadytDom": () => (/* binding */ farmReadytDom),
/* harmony export */   "farmStartedDom": () => (/* binding */ farmStartedDom),
/* harmony export */   "filterFarmsDom": () => (/* binding */ filterFarmsDom),
/* harmony export */   "importPopUpDom": () => (/* binding */ importPopUpDom),
/* harmony export */   "massEditPopUpDom": () => (/* binding */ massEditPopUpDom),
/* harmony export */   "regex": () => (/* binding */ regex),
/* harmony export */   "selectAllFarmsDom": () => (/* binding */ selectAllFarmsDom),
/* harmony export */   "w3gFarmKey": () => (/* binding */ w3gFarmKey)
/* harmony export */ });
var farmListDom = document.querySelector('.farm-list'); // export const farmInput = document.getElementById('farmNumber');

var editPopUpDom = document.getElementById('edit-pop-up');
var filterFarmsDom = document.getElementById('filter-farms');
var massEditPopUpDom = document.getElementById('mass-edit-pop-up');
var importPopUpDom = document.getElementById('import-pop-up');
var selectAllFarmsDom = document.getElementById('select-all-farms');
var exportAllFarms = document.getElementById('export-farms');
var errorDom = document.getElementById('error-handling'); // export const addColorInputDom = document.getElementById('farm-color');
// export const editColorInputDom = document.getElementById('farm-color-edit');

var farmCountDom = document.getElementById('farm-count');
var farmReadytDom = document.getElementById('farms-ready');
var farmStartedDom = document.getElementById('farms-started');
var defaultFarmKey = 'farms';
var w3gFarmKey = 'w3gfarms';
var regex = /(?<=farm)[^/\s]*/i;

/***/ }),

/***/ "./src/js/crops.js":
/*!*************************!*\
  !*** ./src/js/crops.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var CROPS = [{
  id: 0,
  name: 'Popberry',
  sproutTime: {
    hours: 2,
    minutes: 0,
    seconds: 0
  },
  sproutTimeSeconds: 7200
}, {
  id: 1,
  name: 'Grumpkin',
  sproutTime: {
    hours: 4,
    minutes: 0,
    seconds: 0
  },
  sproutTimeSeconds: 14400
}, {
  id: 2,
  name: 'Scarrot',
  sproutTime: {
    hours: 5,
    minutes: 20,
    seconds: 0
  },
  // in hours
  sproutTimeSeconds: 19200
}];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CROPS);

/***/ }),

/***/ "./src/js/farm-events.js":
/*!*******************************!*\
  !*** ./src/js/farm-events.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "deleteFarm": () => (/* binding */ deleteFarm),
/* harmony export */   "editSingleFarmForm": () => (/* binding */ editSingleFarmForm),
/* harmony export */   "selectFarm": () => (/* binding */ selectFarm),
/* harmony export */   "startFarm": () => (/* binding */ startFarm)
/* harmony export */ });
/* harmony import */ var _vendors_easytimer_min__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vendors/easytimer.min */ "./src/js/vendors/easytimer.min.js");
/* harmony import */ var _misc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./misc */ "./src/js/misc.js");
/* harmony import */ var _farm_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./farm-helpers */ "./src/js/farm-helpers.js");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./consts */ "./src/js/consts.js");




function startFarm(button, farms, localStorageKey) {
  // console.log('clicking start');
  var target = button;
  target.disabled = true;
  var farmDom = target.parentElement.parentElement;
  farmDom.classList.remove('completed');
  var farm = (0,_farm_helpers__WEBPACK_IMPORTED_MODULE_2__.findFarm)(farmDom.id, farms).farm;
  var timerDom = farmDom.querySelector('.timer');
  var timer = new easytimer.Timer(); //saving timer pointer in farm

  farm.timer = timer;
  farm.startTime = new Date().getTime() / 1000; //saving farm in localStorage

  localStorage.setItem(localStorageKey, JSON.stringify(farms));
  var hourFormat = (0,_misc__WEBPACK_IMPORTED_MODULE_1__.secondsToHourFormat)(farm.crop.sproutTimeSeconds); // // timer.start({ countdown: true, startValues: {seconds: 10} });

  timer.start({
    countdown: true,
    startValues: {
      hours: hourFormat[0],
      minutes: hourFormat[1],
      seconds: hourFormat[2]
    }
  });
  timer.addEventListener('secondsUpdated', (0,_misc__WEBPACK_IMPORTED_MODULE_1__.handleTimerStart)(timerDom, timer));
  farmDom.classList.add('started');
  timer.addEventListener('targetAchieved', function (e) {
    target.disabled = false;
    farmDom.classList.add('completed');
    farmDom.classList.remove('started');
    (0,_misc__WEBPACK_IMPORTED_MODULE_1__.updateFarmCount)(farms);
  });
  (0,_misc__WEBPACK_IMPORTED_MODULE_1__.updateFarmCount)(farms);
  (0,_farm_helpers__WEBPACK_IMPORTED_MODULE_2__.openFarm)(farm.number);
}
function deleteFarm(button, farms, localStorageKey) {
  var dev = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var target = button;
  var farmDom = target.parentElement.parentElement;
  var farm = (0,_farm_helpers__WEBPACK_IMPORTED_MODULE_2__.findFarm)(farmDom.id, farms);

  if (dev) {
    console.log('deleting farms ...');
    console.log('farm node to be deleted: ', farmDom);
    console.log('farm to be deleted: ', farm);
  } //remove farm from FARMS array


  farms.splice(farm.i, 1);

  if (farms.length == 0) {
    _consts__WEBPACK_IMPORTED_MODULE_3__.selectAllFarmsDom.disabled = true;
  }

  if (dev) {
    console.log('farms after delete: ', farms);
  }

  localStorage.setItem(localStorageKey, JSON.stringify(farms));
  farmDom.remove();
  (0,_misc__WEBPACK_IMPORTED_MODULE_1__.updateFarmCount)(farms);
}
function editSingleFarmForm(button, farms) {
  var dev = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var target = button;
  var farmDom = target.parentElement.parentElement;
  var farm = (0,_farm_helpers__WEBPACK_IMPORTED_MODULE_2__.findFarm)(farmDom.id, farms).farm;
  var popToOpen = target.getAttribute('data-poptoopen');
  var popUp = document.getElementById(popToOpen);
  var h2 = popUp.querySelector('h2');
  var farmInput = popUp.querySelector('.farmInput');
  var cropDom = popUp.querySelector('.crop-info img');
  var timerDom = popUp.querySelector('.time p');
  var textarea = popUp.querySelector('textarea');
  var colorIndicator = popUp.querySelector('.color-indicator div');
  var colorInputDom = popUp.querySelector('input[type=color]');
  popUp.querySelectorAll('.crop-radio input').forEach(function (e) {
    e.checked = false;
  });
  h2.innerHTML = "Farm ".concat(farmDom.id);
  farmInput.value = farmDom.id;
  cropDom.setAttribute('src', "/assets/images/crops/".concat(farm.crop.name.toLowerCase(), ".png"));
  var hourFormat = (0,_misc__WEBPACK_IMPORTED_MODULE_1__.secondsToHourFormat)(farm.crop.sproutTimeSeconds);
  timerDom.innerHTML = "".concat(hourFormat[0], ":").concat(hourFormat[1], ":").concat(hourFormat[2]);
  textarea.value = farm.info.notes;

  if (farm.info.color != null) {
    colorIndicator.style.background = farm.info.color; // colorInputDom.click();

    colorInputDom.value = farm.info.color;
    colorInputDom.setAttribute('data-color', farm.info.color);
  } else {
    colorInputDom.setAttribute('data-color', '');
  }

  (0,_misc__WEBPACK_IMPORTED_MODULE_1__.openPop)(popUp);
}
function selectFarm(button, farmsToUpdate, farms) {
  var dev = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var target = button;
  var farmDom = target.parentElement.parentElement;

  if (target.checked == true) {
    // add farm to FARMStoUpdate
    var farm = (0,_farm_helpers__WEBPACK_IMPORTED_MODULE_2__.findFarm)(farmDom.id, farms);
    farmsToUpdate.push(farm.farm);

    if (farmsToUpdate.length > 1) {
      document.querySelector('.bulk-actions').style.display = 'inline-flex';
    }

    if (farmsToUpdate.length == farms.length) {
      _consts__WEBPACK_IMPORTED_MODULE_3__.selectAllFarmsDom.checked = true;
    }

    if (dev) {
      console.log('adding farm to FARMStoUpdate: ', farmsToUpdate);
    }
  } else {
    // remove farm from FARMStoUpdate
    var _farm = (0,_farm_helpers__WEBPACK_IMPORTED_MODULE_2__.findFarm)(farmDom.id, farmsToUpdate);

    farmsToUpdate.splice(_farm.i, 1);

    if (farmsToUpdate.length < 2) {
      document.querySelector('.bulk-actions').style.display = 'none';
    }

    if (farmsToUpdate.length < farms.length) {
      _consts__WEBPACK_IMPORTED_MODULE_3__.selectAllFarmsDom.checked = false;
    }

    if (dev) {
      console.log('removing farm to FARMStoUpdate: ', farmsToUpdate);
    }
  } // console.log('fars to update', farmsToUpdate)
  // if (farmsToUpdate.length > 1) {
  //     document.querySelector('.mass-edit-container .extra-buttons').classList.add('show');
  // } else {
  //     document.querySelector('.mass-edit-container .extra-buttons').classList.remove('show');
  // }

}

/***/ }),

/***/ "./src/js/farm-helpers.js":
/*!********************************!*\
  !*** ./src/js/farm-helpers.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addFarm": () => (/* binding */ addFarm),
/* harmony export */   "continueFarmTimer": () => (/* binding */ continueFarmTimer),
/* harmony export */   "createFarmNode": () => (/* binding */ createFarmNode),
/* harmony export */   "findFarm": () => (/* binding */ findFarm),
/* harmony export */   "openFarm": () => (/* binding */ openFarm),
/* harmony export */   "updateFarmDom": () => (/* binding */ updateFarmDom)
/* harmony export */ });
/* harmony import */ var _crops__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./crops */ "./src/js/crops.js");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./consts */ "./src/js/consts.js");
/* harmony import */ var _misc__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./misc */ "./src/js/misc.js");



function findFarm(id, arr) {
  var farm = null;
  arr.forEach(function (item, index) {
    if (id == item.number) {
      farm = {
        farm: item,
        i: index
      };
      return;
    }
  });
  return farm;
}
function openFarm(farmNumber) {
  window.open("https://play.pixels.online/farm".concat(farmNumber), "_blank");
}
function updateFarmDom(farmToUpdate, data, farms, localStorageKey) {
  var farm = farmToUpdate;
  var prevCrop = farm.crop;
  var farmColor = data.farmColor == 'null' ? null : data.farmColor;
  var farmDom = document.getElementById(farm.number);
  var nextDomE = farmDom.nextElementSibling; //update farm in the arr (type and startTimer)

  if (data.type != undefined) {
    farm.crop = _crops__WEBPACK_IMPORTED_MODULE_0__["default"][data.type]; // let cropTimer = farm.crop.sproutTimeSeconds;

    farm.startTime = null;
    farm.timer = null;
  }

  farm.info.color = farmColor == null ? farm.info.color : farmColor;

  if (data.objtype == 'obj') {
    farm.info.notes = data.farmNotes == undefined ? '' : data.farmNotes;
  }

  if (data.objtype == 'arr') {
    document.querySelector('.bulk-actions').style.display = 'none';
  } //save in local localStorage


  localStorage.setItem(localStorageKey, JSON.stringify(farms)); //build dom tree

  farmDom.remove();
  _consts__WEBPACK_IMPORTED_MODULE_1__.farmListDom.insertBefore(createFarmNode(farm), nextDomE);
}
function createFarmNode(farm) {
  var tag = document.createElement("div");
  tag.classList.add('farm', 'row');
  tag.setAttribute('id', farm.number);
  tag.setAttribute('data-id', farm.number);
  var cropName = farm.crop.name.toLowerCase();
  var cropTimer;
  var colorDom = farm.info.color == undefined || farm.info.color == null ? '<div class="color"></div>' : "<div class=\"color\" style=\"background-color: ".concat(farm.info.color, "; border-color: ").concat(farm.info.color, "\"></div>");
  var notesDom = farm.info.notes == undefined || farm.info.notes == '' ? '' : " <div class=\"notes\"><div class=\"info\"><svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M9.99996 18.3334C14.6023 18.3334 18.3333 14.6024 18.3333 10C18.3333 5.39765 14.6023 1.66669 9.99996 1.66669C5.39759 1.66669 1.66663 5.39765 1.66663 10C1.66663 14.6024 5.39759 18.3334 9.99996 18.3334Z\" stroke=\"#B0B7C3\" stroke-width=\"1.66667\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M10 13.3333V10\" stroke=\"#B0B7C3\" stroke-width=\"1.66667\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M10 6.66669H10.0083\" stroke=\"#B0B7C3\" stroke-width=\"1.66667\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg><div class=\"content\"><p>".concat(farm.info.notes, "</p></div></div></div>"); // if crop timer was started, use it

  if (farm.startTime != undefined && farm.startTime != null) {
    cropTimer = {
      hours: '',
      minutes: '',
      seconds: ''
    };
  } else {
    var hourFormat = (0,_misc__WEBPACK_IMPORTED_MODULE_2__.secondsToHourFormat)(farm.crop.sproutTimeSeconds);
    cropTimer = {
      hours: hourFormat[0],
      minutes: hourFormat[1],
      seconds: hourFormat[2]
    };
  }

  tag.innerHTML = "  <div class=\"container input\">\n            <input type=\"checkbox\" name=\"select-farm\" class=\"select-farm\" id=\"check-".concat(farm.number, "\">\n        </div>\n        <div class=\"container crop\">\n            <div class=\"crop-type ").concat(cropName, "\"></div>\n        </div>\n        <div class=\"container number farm-header\">\n            <div>\n                ").concat(colorDom, "\n                <label for=\"check-").concat(farm.number, "\"><p>Farm ").concat(farm.number, "</p></label>\n                ").concat(notesDom, "\n            </div>\n            <button class=\"delete-farm btn-icon\" title=\"Delete Farm\">\n                <svg width=\"18\" height=\"18\" viewBox=\"0 0 18 18\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M7.88384 0.0666682L7.7968 0.0665819C7.38672 0.0659695 7.02679 0.0654321 6.70608 0.191566C6.42565 0.301858 6.1774 0.480789 5.98409 0.711951C5.76301 0.976316 5.6497 1.31794 5.5206 1.70717L5.49316 1.78977L5.2342 2.56667H2.33332H0.66665C0.33528 2.56667 0.0666504 2.8353 0.0666504 3.16667C0.0666504 3.49804 0.33528 3.76667 0.66665 3.76667H1.76757L2.2842 12.5492L2.2857 12.5747C2.33431 13.4013 2.37289 14.0572 2.4464 14.5855C2.52166 15.1264 2.63911 15.5824 2.87192 15.9963C3.25038 16.6691 3.82481 17.2107 4.51873 17.549C4.94559 17.7571 5.40765 17.8476 5.95205 17.891C6.48373 17.9333 7.14081 17.9333 7.96879 17.9333H7.99433H10.0056H10.0312C10.8592 17.9333 11.5162 17.9333 12.0479 17.891C12.5923 17.8476 13.0544 17.7571 13.4812 17.549C14.1752 17.2107 14.7496 16.6691 15.128 15.9963C15.3609 15.5824 15.4783 15.1264 15.5536 14.5855C15.6271 14.0572 15.6657 13.4013 15.7143 12.5747L15.7158 12.5492L16.2324 3.76667H17.3333C17.6647 3.76667 17.9333 3.49804 17.9333 3.16667C17.9333 2.8353 17.6647 2.56667 17.3333 2.56667H15.6667H12.7658L12.5068 1.78977L12.4794 1.70718C12.3503 1.31794 12.237 0.976316 12.0159 0.711951C11.8226 0.480789 11.5743 0.301858 11.2939 0.191566C10.9732 0.0654321 10.6132 0.0659695 10.2032 0.0665819L10.1161 0.0666682H7.88384ZM12.3193 3.76667C12.3286 3.76688 12.3378 3.76689 12.3471 3.76667H15.0303L14.5178 12.4788C14.4674 13.3365 14.4312 13.9447 14.365 14.4201C14.2999 14.8883 14.2114 15.1782 14.0821 15.408C13.8232 15.8683 13.4302 16.2389 12.9554 16.4704C12.7184 16.5859 12.4238 16.6572 11.9526 16.6948C11.4742 16.7329 10.8649 16.7333 10.0056 16.7333H7.99433C7.13511 16.7333 6.52579 16.7329 6.04735 16.6948C5.57618 16.6572 5.28153 16.5859 5.04459 16.4704C4.5698 16.2389 4.17677 15.8683 3.91782 15.408C3.7886 15.1782 3.70008 14.8883 3.63495 14.4201C3.5688 13.9447 3.53258 13.3365 3.48212 12.4788L2.96965 3.76667H5.65284C5.66213 3.76689 5.67139 3.76688 5.68063 3.76667H12.3193ZM11.5009 2.56667L11.3684 2.16925C11.1948 1.64859 11.1506 1.54789 11.0953 1.48176C11.0309 1.40471 10.9482 1.34506 10.8547 1.3083C10.7745 1.27675 10.6649 1.26667 10.1161 1.26667H7.88384C7.33502 1.26667 7.22551 1.27675 7.14529 1.3083C7.05181 1.34506 6.96906 1.40471 6.90463 1.48176C6.84933 1.54789 6.80513 1.64859 6.63158 2.16925L6.49911 2.56667H11.5009ZM7.93334 7.33333C7.93334 7.00196 7.66471 6.73333 7.33334 6.73333C7.00197 6.73333 6.73334 7.00196 6.73334 7.33333V13.1667C6.73334 13.498 7.00197 13.7667 7.33334 13.7667C7.66471 13.7667 7.93334 13.498 7.93334 13.1667V7.33333ZM10.6666 6.73333C10.998 6.73333 11.2667 7.00196 11.2667 7.33333V10.6667C11.2667 10.998 10.998 11.2667 10.6666 11.2667C10.3353 11.2667 10.0666 10.998 10.0666 10.6667V7.33333C10.0666 7.00196 10.3353 6.73333 10.6666 6.73333Z\" fill=\"#2E2C34\"/></svg>\n            </button>\n        </div>\n        <div class=\"container time\">\n            <svg class=\"clock-svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path opacity=\"0.3\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M12 21C7.58172 21 4 17.4183 4 13C4 8.58172 7.58172 5 12 5C16.4183 5 20 8.58172 20 13C20 17.4183 16.4183 21 12 21Z\" fill=\"black\"/><path class=\"white\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M13 5.06189V4H14C14.5523 4 15 3.55228 15 3C15 2.44772 14.5523 2 14 2H10C9.44772 2 9 2.44772 9 3C9 3.55228 9.44772 4 10 4H11V5.06189C11.3276 5.02104 11.6613 5 12 5C12.3387 5 12.6724 5.02104 13 5.06189Z\" fill=\"black\"/><path class=\"white\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M18.1672 7.90393L18.9498 7.12132C19.3403 6.7308 19.3403 6.09763 18.9498 5.70711C18.5593 5.31658 17.9261 5.31658 17.5356 5.70711L16.71 6.53273C17.2511 6.9275 17.7408 7.38855 18.1672 7.90393Z\" fill=\"black\"/><path class=\"white\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M11.4646 7.96165C11.4846 7.70115 11.7018 7.5 11.9631 7.5H12.0371C12.2984 7.5 12.5156 7.70115 12.5356 7.96165L12.9587 13.4617C12.981 13.752 12.7514 14 12.4602 14H11.54C11.2488 14 11.0192 13.752 11.0415 13.4617L11.4646 7.96165Z\" fill=\"black\"/></svg>\n\n            <p class=\"timer\">").concat(cropTimer.hours == 0 ? '00' : cropTimer.hours, ":").concat(cropTimer.minutes == 0 ? '00' : cropTimer.minutes, ":").concat(cropTimer.seconds == 0 ? '00' : cropTimer.seconds, "</p>\n\n\n            <button class=\"start-farm btn-icon text\" title=\"Start Farm\">\n                <svg class=\"play-svg\" width=\"21\" height=\"20\" viewBox=\"0 0 21 20\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M10.97 0C5.44997 0 0.969971 4.48 0.969971 10C0.969971 15.52 5.44997 20 10.97 20C16.49 20 20.97 15.52 20.97 10C20.97 4.48 16.5 0 10.97 0ZM13.97 12.23L11.07 13.9C10.71 14.11 10.31 14.21 9.91997 14.21C9.51997 14.21 9.12997 14.11 8.76997 13.9C8.04997 13.48 7.61997 12.74 7.61997 11.9V8.55C7.61997 7.72 8.04997 6.97 8.76997 6.55C9.48997 6.13 10.35 6.13 11.08 6.55L13.98 8.22C14.7 8.64 15.13 9.38 15.13 10.22C15.13 11.06 14.7 11.81 13.97 12.23Z\" fill=\"#4FBF67\"/></svg>\n                <svg class=\"completed-svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z\" fill=\"white\"/></svg>\n                start\n            </button>\n        </div>\n        <div class=\"container action\">\n            <button class=\"edit-farm btn-icon\" title=\"Edit Farm\" data-poptoopen=\"edit-pop-up\">\n                <svg width=\"17\" height=\"17\" viewBox=\"0 0 17 17\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M16.2923 16.2831H10.2482C9.90317 16.2831 9.62317 16.0031 9.62317 15.6581C9.62317 15.3131 9.90317 15.0331 10.2482 15.0331H16.2923C16.6373 15.0331 16.9173 15.3131 16.9173 15.6581C16.9173 16.0031 16.6373 16.2831 16.2923 16.2831Z\" fill=\"#2E2C34\"/><mask id=\"mask0_35_2505\" style=\"mask-type:alpha\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"15\" height=\"17\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M0.666992 0.50013H14.9841V16.2831H0.666992V0.50013Z\" fill=\"white\"/></mask><g mask=\"url(#mask0_35_2505)\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M9.92556 2.18067L2.07972 11.9932C1.93722 12.1715 1.88472 12.4015 1.93722 12.6223L2.50472 15.0265L5.03722 14.9948C5.27806 14.9923 5.50056 14.8848 5.64806 14.7015C8.32889 11.3473 13.4397 4.95233 13.5847 4.76483C13.7214 4.54317 13.7747 4.22983 13.7031 3.92817C13.6297 3.619 13.4372 3.3565 13.1597 3.189C13.1006 3.14817 11.6964 2.05817 11.6531 2.024C11.1247 1.60067 10.3539 1.674 9.92556 2.18067ZM2.01139 16.2832C1.72222 16.2832 1.47055 16.0848 1.40305 15.8023L0.720554 12.9098C0.579721 12.3107 0.719721 11.6923 1.10389 11.2123L8.95389 1.394C8.95722 1.39067 8.95972 1.3865 8.96305 1.38317C9.82389 0.353999 11.3806 0.202332 12.4306 1.04483C12.4722 1.07733 13.8664 2.16067 13.8664 2.16067C14.3731 2.46233 14.7689 3.0015 14.9189 3.63983C15.0681 4.2715 14.9597 4.92316 14.6122 5.474C14.5864 5.51483 14.5639 5.54983 6.62389 15.4832C6.24139 15.9598 5.66805 16.2373 5.05222 16.2448L2.01972 16.2832H2.01139Z\" fill=\"#2E2C34\"/></g><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M12.5196 7.73733C12.3863 7.73733 12.2529 7.69483 12.1388 7.60817L7.59543 4.11817C7.3221 3.90817 7.27043 3.5165 7.48043 3.2415C7.69126 2.96817 8.08293 2.91733 8.3571 3.12733L12.9013 6.6165C13.1746 6.8265 13.2263 7.219 13.0154 7.49317C12.8929 7.65317 12.7071 7.73733 12.5196 7.73733Z\" fill=\"#2E2C34\"/></svg>\n            </button>\n            <button class=\"open-farm btn-icon text\" title=\"Open Farm\">\n                <svg width=\"14\" height=\"15\" viewBox=\"0 0 14 15\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><g id=\"export\"><path id=\"Vector\" d=\"M7.58325 6.91666L12.3666 2.13333\" stroke=\"#292D32\" stroke-width=\"1.06944\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path id=\"Vector_2\" d=\"M12.8332 4.46666V1.66666H10.0332\" stroke=\"#292D32\" stroke-width=\"1.06944\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path id=\"Vector_3\" d=\"M6.41675 1.66666H5.25008C2.33341 1.66666 1.16675 2.83332 1.16675 5.74999V9.24999C1.16675 12.1667 2.33341 13.3333 5.25008 13.3333H8.75008C11.6667 13.3333 12.8334 12.1667 12.8334 9.24999V8.08332\" stroke=\"#292D32\" stroke-width=\"1.06944\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></g></svg>\n                Open Farm\n            </button>\n        </div>");
  return tag;
}
function continueFarmTimer(farm) {
  var farmDom = document.getElementById(farm.number);
  var timerDom = farmDom.querySelector('.timer');
  var now = new Date().getTime() / 1000;
  var timePassed = now - farm.startTime;

  if (timePassed >= farm.crop.sproutTimeSeconds) {
    farmDom.classList.add('completed');
    timerDom.innerHTML = '00:00:00';
    return;
  }

  var timeLeftOnTimer = farm.crop.sproutTimeSeconds - timePassed;
  var timer = new easytimer.Timer();
  farm.timer = timer;
  farmDom.querySelector('.start-farm').disabled = true;
  var hourFormat = (0,_misc__WEBPACK_IMPORTED_MODULE_2__.secondsToHourFormat)(timeLeftOnTimer); // // timer.start({ countdown: true, startValues: {seconds: 10} });

  timer.start({
    countdown: true,
    startValues: {
      hours: hourFormat[0],
      minutes: hourFormat[1],
      seconds: hourFormat[2]
    }
  });
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
function addFarm(formDom, form, farms, localStorageKey) {
  var dev = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var crop = _crops__WEBPACK_IMPORTED_MODULE_0__["default"][form.type];
  var match = _consts__WEBPACK_IMPORTED_MODULE_1__.regex.exec(form.farmNumber);
  var number = match == null ? form.farmNumber : match[0]; //errOr handling

  if (isNaN(number * 1)) {
    return (0,_misc__WEBPACK_IMPORTED_MODULE_2__.showError)('Invalid Farm');
  } else if (number * 1 > 5000 || number * 1 < 0) {
    return (0,_misc__WEBPACK_IMPORTED_MODULE_2__.showError)('Invalid Farm');
  } else if (farms.length > 0 && findFarm(number, farms) != null) {
    return (0,_misc__WEBPACK_IMPORTED_MODULE_2__.showError)('Farm already exists');
  } //regex url


  var farm = {
    number: number,
    crop: crop,
    timer: null,
    startTime: null,
    info: {
      color: form.farmColor == 'null' ? null : form.farmColor,
      notes: form.farmNotes
    }
  };
  farms.push(farm);
  (0,_misc__WEBPACK_IMPORTED_MODULE_2__.updateFarmCount)(farms); //reset form fields

  formDom.querySelector('.farmNumber').value = '';
  formDom.querySelector('.farmNotes').value = '';
  formDom.querySelector('.farmNumber').focus; // if (farms.length > 1) {
  //     selectAllFarmsDom.disabled = false;
  // }

  localStorage.setItem(localStorageKey, JSON.stringify(farms));

  if (dev) {
    console.log('farms after add: ', farms);
  } //create dom element and add it


  (0,_misc__WEBPACK_IMPORTED_MODULE_2__.showError)("Farm ".concat(number, " added to the bottom"), 2);
  _consts__WEBPACK_IMPORTED_MODULE_1__.farmListDom.appendChild(createFarmNode(farm));
}

/***/ }),

/***/ "./src/js/misc.js":
/*!************************!*\
  !*** ./src/js/misc.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "cleanEditForm": () => (/* binding */ cleanEditForm),
/* harmony export */   "clearCheckBoxes": () => (/* binding */ clearCheckBoxes),
/* harmony export */   "closePop": () => (/* binding */ closePop),
/* harmony export */   "download": () => (/* binding */ download),
/* harmony export */   "handleTimerStart": () => (/* binding */ handleTimerStart),
/* harmony export */   "importClean": () => (/* binding */ importClean),
/* harmony export */   "openPop": () => (/* binding */ openPop),
/* harmony export */   "secondsToHourFormat": () => (/* binding */ secondsToHourFormat),
/* harmony export */   "showError": () => (/* binding */ showError),
/* harmony export */   "updateFarmCount": () => (/* binding */ updateFarmCount)
/* harmony export */ });
/* harmony import */ var _crops__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./crops */ "./src/js/crops.js");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./consts */ "./src/js/consts.js");
/* harmony import */ var _farm_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./farm-helpers */ "./src/js/farm-helpers.js");



function secondsToHourFormat(seconds) {
  return new Date(seconds * 1000).toISOString().substr(11, 8).split(":");
}
function handleTimerStart(timerDom, timer) {
  return function () {
    timerDom.innerHTML = timer.getTimeValues().toString();
  };
}
function openPop(container) {
  container.classList.add('open');
}
function closePop(container) {
  container.classList.remove('open');
}
function updateFarmCount(arr) {
  var farmCount = arr.length;
  var farmsDom = _consts__WEBPACK_IMPORTED_MODULE_1__.farmListDom.querySelectorAll('.farm');
  var readyFarms = 0;
  var startedFarms = 0;
  _consts__WEBPACK_IMPORTED_MODULE_1__.farmCountDom.innerHTML = farmCount;
  farmsDom.forEach(function (farm) {
    if (farm.classList.contains('started')) {
      startedFarms++;
    } else if (farm.classList.contains('completed')) {
      readyFarms++;
    }
  }); // console.log(readyFarms);

  _consts__WEBPACK_IMPORTED_MODULE_1__.farmReadytDom.innerHTML = readyFarms;
  _consts__WEBPACK_IMPORTED_MODULE_1__.farmStartedDom.innerHTML = startedFarms;
}
function clearCheckBoxes(arr) {
  arr.forEach(function (element) {
    element.checked = false;
  }); // document.querySelector('.mass-edit-container .extra-buttons').classList.remove('show');
  // selectButton.classList.remove('all-selected');
  // selectButton.innerHTML = 'Select All';
}
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
function importClean(data, farms, localStorageKey) {
  var farmsToClean = [];
  var sameFarms = [];
  var fileType; //chekc if data is of type string or array

  try {
    JSON.parse(data);
    fileType = 'exported';
  } catch (e) {
    fileType = 'links'; // return showError('Invalid data');
  }

  if (fileType == 'exported') {
    farmsToClean = JSON.parse(data);
    console.log(farmsToClean);

    if (farms == 0) {
      localStorage.setItem(localStorageKey, JSON.stringify(farmsToClean));
      window.location.reload();
    }

    for (var i = farmsToClean.length - 1; i >= 0; i--) {
      if ((0,_farm_helpers__WEBPACK_IMPORTED_MODULE_2__.findFarm)(farmsToClean[i].number, farms) != null) {
        sameFarms.push(farmsToClean[i]);
        farmsToClean.splice(i, 1);
      }
    }

    farms = farms.concat(farmsToClean); // if(sameFarms.length > 0){
    //     showError('Duplicated farms were ommited', 1);
    // }

    localStorage.setItem(localStorageKey, JSON.stringify(farms));

    if (farmsToClean.length > 0) {
      window.location.reload();
    } else {
      showError('No farms imported, all farms were duplicates', 1);
    }
  } else {
    data.split(/\r?\n/).forEach(function (link) {
      var match = _consts__WEBPACK_IMPORTED_MODULE_1__.regex.exec(link);

      if (match != null) {
        var farm = {
          number: match[0],
          crop: _crops__WEBPACK_IMPORTED_MODULE_0__["default"][0],
          timer: null,
          startTime: null
        };
        farmsToClean.push(farm);
      }
    });

    if (farms == 0) {
      localStorage.setItem(localStorageKey, JSON.stringify(farmsToClean));
      window.location.reload();
    }

    for (var i = farmsToClean.length - 1; i >= 0; i--) {
      if ((0,_farm_helpers__WEBPACK_IMPORTED_MODULE_2__.findFarm)(farmsToClean[i].number, farms) != null) {
        sameFarms.push(farmsToClean[i]);
        farmsToClean.splice(i, 1);
      }
    }

    farms = farms.concat(farmsToClean);
    localStorage.setItem(localStorageKey, JSON.stringify(farms));

    if (farmsToClean.length > 0) {
      window.location.reload();
    } else {
      showError('No farms imported, all farms were duplicates', 1);
    }
  }
}
function cleanEditForm(form) {
  // let textarea = form.querySelector('textarea');
  var colorPickerButton = form.querySelector('.add-color');
  var colorIndicator = form.querySelector('.color-indicator div');
  var colorInputDom = form.querySelector('input[type=color]'); // textarea.value = '';

  colorInputDom.setAttribute('data-color', '');
}
function showError(errorMessage, errorCode) {
  _consts__WEBPACK_IMPORTED_MODULE_1__.errorDom.querySelector('p').innerHTML = errorMessage;

  if (errorCode == 0) {
    _consts__WEBPACK_IMPORTED_MODULE_1__.errorDom.classList.add('show', 'error');
  } else if (errorCode == 1) {
    _consts__WEBPACK_IMPORTED_MODULE_1__.errorDom.classList.add('show', 'warning');
  } else if (errorCode == 2) {
    _consts__WEBPACK_IMPORTED_MODULE_1__.errorDom.classList.add('show', 'success');
  } else {
    _consts__WEBPACK_IMPORTED_MODULE_1__.errorDom.classList.add('show', 'error');
  }

  setTimeout(function () {
    _consts__WEBPACK_IMPORTED_MODULE_1__.errorDom.classList.remove('show');
  }, 5000);
  setTimeout(function () {
    _consts__WEBPACK_IMPORTED_MODULE_1__.errorDom.classList.remove('error', 'warning', 'success');
  }, 5500);
}

/***/ }),

/***/ "./src/js/vendors/easytimer.min.js":
/*!*****************************************!*\
  !*** ./src/js/vendors/easytimer.min.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");


/**
 * easytimer.js
 * Generated: 2022-02-12
 * Version: 4.5.3
 */
!function (t, e) {
  "object" == (typeof exports === "undefined" ? "undefined" : (0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(exports)) && "undefined" != "object" ? e(exports) : "function" == typeof define && __webpack_require__.amdO ? define(["exports"], e) : e((t = "undefined" != typeof globalThis ? globalThis : t || self).easytimer = {});
}(undefined, function (t) {
  "use strict";

  function e(t, e) {
    var n = Object.keys(t);

    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(t);
      e && (r = r.filter(function (e) {
        return Object.getOwnPropertyDescriptor(t, e).enumerable;
      })), n.push.apply(n, r);
    }

    return n;
  }

  function n(t) {
    for (var n = 1; n < arguments.length; n++) {
      var r = null != arguments[n] ? arguments[n] : {};
      n % 2 ? e(Object(r), !0).forEach(function (e) {
        o(t, e, r[e]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r)) : e(Object(r)).forEach(function (e) {
        Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(r, e));
      });
    }

    return t;
  }

  function r(t) {
    return (r = "function" == typeof Symbol && "symbol" == (0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(Symbol.iterator) ? function (t) {
      return (0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(t);
    } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : (0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(t);
    })(t);
  }

  function o(t, e, n) {
    return e in t ? Object.defineProperty(t, e, {
      value: n,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }) : t[e] = n, t;
  }

  function s(t, e, n) {
    var r,
        o = "";
    if ((t = "number" == typeof t ? String(t) : t).length > e) return t;

    for (r = 0; r < e; r += 1) {
      o += String(n);
    }

    return (o + t).slice(-o.length);
  }

  function i() {
    this.reset();
  }

  function u() {
    this.events = {};
  }

  i.prototype.toString = function () {
    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : ["hours", "minutes", "seconds"],
        e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : ":",
        n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 2;
    t = t || ["hours", "minutes", "seconds"], e = e || ":", n = n || 2;
    var r,
        o = [];

    for (r = 0; r < t.length; r += 1) {
      void 0 !== this[t[r]] && ("secondTenths" === t[r] ? o.push(this[t[r]]) : o.push(s(this[t[r]], n, "0")));
    }

    return o.join(e);
  }, i.prototype.reset = function () {
    this.secondTenths = 0, this.seconds = 0, this.minutes = 0, this.hours = 0, this.days = 0;
  }, u.prototype.on = function (t, e) {
    var n = this;
    return Array.isArray(this.events[t]) || (this.events[t] = []), this.events[t].push(e), function () {
      return n.removeListener(t, e);
    };
  }, u.prototype.removeListener = function (t, e) {
    if (Array.isArray(this.events[t])) {
      var n = this.events[t].indexOf(e);
      n > -1 && this.events[t].splice(n, 1);
    }
  }, u.prototype.removeAllListeners = function (t) {
    t ? Array.isArray(this.events[t]) && (this.events[t] = []) : this.events = {};
  }, u.prototype.emit = function (t) {
    for (var e = this, n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++) {
      r[o - 1] = arguments[o];
    }

    Array.isArray(this.events[t]) && this.events[t].forEach(function (t) {
      return t.apply(e, r);
    });
  };
  var c = 10,
      a = 60,
      f = 60,
      h = 24,
      d = "secondTenths",
      l = "seconds",
      p = "minutes",
      v = "hours",
      y = "days",
      m = [d, l, p, v, y],
      b = {
    secondTenths: 100,
    seconds: 1e3,
    minutes: 6e4,
    hours: 36e5,
    days: 864e5
  },
      g = {
    secondTenths: c,
    seconds: a,
    minutes: f,
    hours: h
  };

  function w(t, e) {
    return (t % e + e) % e;
  }

  function O() {
    var t,
        e,
        o,
        s,
        O,
        T,
        j,
        A,
        E,
        P,
        S = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
        D = new i(),
        L = new i(),
        x = new u(),
        V = !1,
        M = !1,
        U = {},
        k = {
      detail: {
        timer: this
      }
    };

    function I(t, e) {
      var n = g[t];
      L[t] = e, D[t] = t === y ? Math.abs(e) : w(e >= 0 ? e : n - w(e, n), n);
    }

    function _(t) {
      return B(t, y);
    }

    function z(t) {
      return B(t, v);
    }

    function C(t) {
      return B(t, p);
    }

    function R(t) {
      return B(t, l);
    }

    function q(t) {
      return B(t, d);
    }

    function B(t, e) {
      var n = L[e];
      return I(e, rt(t, b[e])), L[e] !== n;
    }

    function F() {
      G(), Z();
    }

    function G() {
      clearInterval(t), t = void 0, V = !1, M = !1;
    }

    function H(t) {
      yt() ? (E = K(), T = ot(O.target)) : $(t), J();
    }

    function J() {
      var n = b[e];
      Y(W(Date.now())) || (t = setInterval(N, n), V = !0, M = !1);
    }

    function K() {
      return W(Date.now()) - L.secondTenths * b.secondTenths * o;
    }

    function N() {
      var t = W(Date.now());
      X(Q()), s(k.detail.timer), Y(t) && (ut(), pt("targetAchieved", k));
    }

    function Q() {
      var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : W(Date.now()),
          e = o > 0 ? t - E : E - t,
          n = {};
      return n.secondTenths = q(e), n.seconds = R(e), n.minutes = C(e), n.hours = z(e), n.days = _(e), n;
    }

    function W(t) {
      return Math.floor(t / b[e]) * b[e];
    }

    function X(t) {
      t.secondTenths && pt("secondTenthsUpdated", k), t.seconds && pt("secondsUpdated", k), t.minutes && pt("minutesUpdated", k), t.hours && pt("hoursUpdated", k), t.days && pt("daysUpdated", k);
    }

    function Y(t) {
      return T instanceof Array && t >= P;
    }

    function Z() {
      D.reset(), L.reset();
    }

    function $(t) {
      e = tt((t = t || {}).precision), s = "function" == typeof t.callback ? t.callback : function () {}, A = !0 === t.countdown, o = !0 === A ? -1 : 1, "object" === r(t.startValues) ? st(t.startValues) : j = null, E = K(), Q(), "object" === r(t.target) ? T = ot(t.target) : A ? (t.target = {
        seconds: 0
      }, T = ot(t.target)) : T = null, U = {
        precision: e,
        callback: s,
        countdown: "object" === r(t) && !0 === t.countdown,
        target: T,
        startValues: j
      }, O = t;
    }

    function tt(t) {
      if (!et(t = "string" == typeof t ? t : l)) throw new Error("Error in precision parameter: ".concat(t, " is not a valid value"));
      return t;
    }

    function et(t) {
      return m.indexOf(t) >= 0;
    }

    function nt(t) {
      var e;
      if ("object" === r(t)) if (t instanceof Array) {
        if (5 !== t.length) throw new Error("Array size not valid");
        e = t;
      } else {
        for (var n in t) {
          if (m.indexOf(n) < 0) throw new Error("Error in startValues or target parameter: ".concat(n, " is not a valid input value"));
        }

        e = [t.secondTenths || 0, t.seconds || 0, t.minutes || 0, t.hours || 0, t.days || 0];
      }
      var o = (e = e.map(function (t) {
        return parseInt(t, 10);
      }))[0],
          s = e[1] + rt(o, c),
          i = e[2] + rt(s, a),
          u = e[3] + rt(i, f),
          d = e[4] + rt(u, h);
      return e[0] = o % c, e[1] = s % a, e[2] = i % f, e[3] = u % h, e[4] = d, e;
    }

    function rt(t, e) {
      var n = t / e;
      return n < 0 ? Math.ceil(n) : Math.floor(n);
    }

    function ot(t) {
      if (t) {
        var e = it(T = nt(t));
        return P = E + e.secondTenths * b.secondTenths * o, T;
      }
    }

    function st(t) {
      j = nt(t), D.secondTenths = j[0], D.seconds = j[1], D.minutes = j[2], D.hours = j[3], D.days = j[4], L = it(j, L);
    }

    function it(t, e) {
      var n = e || {};
      return n.days = t[4], n.hours = n.days * h + t[3], n.minutes = n.hours * f + t[2], n.seconds = n.minutes * a + t[1], n.secondTenths = n.seconds * c + t[[0]], n;
    }

    function ut() {
      F(), pt("stopped", k);
    }

    function ct() {
      F(), H(O), pt("reset", k);
    }

    function at() {
      var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      t = n(n({}, S), t), vt() || (H(t), pt("started", k));
    }

    function ft() {
      G(), M = !0, pt("paused", k);
    }

    function ht(t, e) {
      x.on(t, e);
    }

    function dt(t, e) {
      x.removeListener(t, e);
    }

    function lt(t) {
      x.removeAllListeners(t);
    }

    function pt(t, e) {
      x.emit(t, e);
    }

    function vt() {
      return V;
    }

    function yt() {
      return M;
    }

    function mt() {
      return D;
    }

    function bt() {
      return L;
    }

    function gt() {
      return U;
    }

    $(S), void 0 !== this && (this.start = at, this.pause = ft, this.stop = ut, this.reset = ct, this.isRunning = vt, this.isPaused = yt, this.getTimeValues = mt, this.getTotalTimeValues = bt, this.getConfig = gt, this.addEventListener = ht, this.on = ht, this.removeEventListener = dt, this.removeAllEventListeners = lt, this.off = dt);
  }

  t.Timer = O, t["default"] = O, Object.defineProperty(t, "__esModule", {
    value: !0
  });
});

/***/ }),

/***/ "./node_modules/sortablejs/modular/sortable.esm.js":
/*!*********************************************************!*\
  !*** ./node_modules/sortablejs/modular/sortable.esm.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MultiDrag": () => (/* binding */ MultiDragPlugin),
/* harmony export */   "Sortable": () => (/* binding */ Sortable),
/* harmony export */   "Swap": () => (/* binding */ SwapPlugin),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**!
 * Sortable 1.15.0
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var version = "1.15.0";

function userAgent(pattern) {
  if (typeof window !== 'undefined' && window.navigator) {
    return !! /*@__PURE__*/navigator.userAgent.match(pattern);
  }
}

var IE11OrLess = userAgent(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i);
var Edge = userAgent(/Edge/i);
var FireFox = userAgent(/firefox/i);
var Safari = userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
var IOS = userAgent(/iP(ad|od|hone)/i);
var ChromeForAndroid = userAgent(/chrome/i) && userAgent(/android/i);

var captureMode = {
  capture: false,
  passive: false
};

function on(el, event, fn) {
  el.addEventListener(event, fn, !IE11OrLess && captureMode);
}

function off(el, event, fn) {
  el.removeEventListener(event, fn, !IE11OrLess && captureMode);
}

function matches(
/**HTMLElement*/
el,
/**String*/
selector) {
  if (!selector) return;
  selector[0] === '>' && (selector = selector.substring(1));

  if (el) {
    try {
      if (el.matches) {
        return el.matches(selector);
      } else if (el.msMatchesSelector) {
        return el.msMatchesSelector(selector);
      } else if (el.webkitMatchesSelector) {
        return el.webkitMatchesSelector(selector);
      }
    } catch (_) {
      return false;
    }
  }

  return false;
}

function getParentOrHost(el) {
  return el.host && el !== document && el.host.nodeType ? el.host : el.parentNode;
}

function closest(
/**HTMLElement*/
el,
/**String*/
selector,
/**HTMLElement*/
ctx, includeCTX) {
  if (el) {
    ctx = ctx || document;

    do {
      if (selector != null && (selector[0] === '>' ? el.parentNode === ctx && matches(el, selector) : matches(el, selector)) || includeCTX && el === ctx) {
        return el;
      }

      if (el === ctx) break;
      /* jshint boss:true */
    } while (el = getParentOrHost(el));
  }

  return null;
}

var R_SPACE = /\s+/g;

function toggleClass(el, name, state) {
  if (el && name) {
    if (el.classList) {
      el.classList[state ? 'add' : 'remove'](name);
    } else {
      var className = (' ' + el.className + ' ').replace(R_SPACE, ' ').replace(' ' + name + ' ', ' ');
      el.className = (className + (state ? ' ' + name : '')).replace(R_SPACE, ' ');
    }
  }
}

function css(el, prop, val) {
  var style = el && el.style;

  if (style) {
    if (val === void 0) {
      if (document.defaultView && document.defaultView.getComputedStyle) {
        val = document.defaultView.getComputedStyle(el, '');
      } else if (el.currentStyle) {
        val = el.currentStyle;
      }

      return prop === void 0 ? val : val[prop];
    } else {
      if (!(prop in style) && prop.indexOf('webkit') === -1) {
        prop = '-webkit-' + prop;
      }

      style[prop] = val + (typeof val === 'string' ? '' : 'px');
    }
  }
}

function matrix(el, selfOnly) {
  var appliedTransforms = '';

  if (typeof el === 'string') {
    appliedTransforms = el;
  } else {
    do {
      var transform = css(el, 'transform');

      if (transform && transform !== 'none') {
        appliedTransforms = transform + ' ' + appliedTransforms;
      }
      /* jshint boss:true */

    } while (!selfOnly && (el = el.parentNode));
  }

  var matrixFn = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  /*jshint -W056 */

  return matrixFn && new matrixFn(appliedTransforms);
}

function find(ctx, tagName, iterator) {
  if (ctx) {
    var list = ctx.getElementsByTagName(tagName),
        i = 0,
        n = list.length;

    if (iterator) {
      for (; i < n; i++) {
        iterator(list[i], i);
      }
    }

    return list;
  }

  return [];
}

function getWindowScrollingElement() {
  var scrollingElement = document.scrollingElement;

  if (scrollingElement) {
    return scrollingElement;
  } else {
    return document.documentElement;
  }
}
/**
 * Returns the "bounding client rect" of given element
 * @param  {HTMLElement} el                       The element whose boundingClientRect is wanted
 * @param  {[Boolean]} relativeToContainingBlock  Whether the rect should be relative to the containing block of (including) the container
 * @param  {[Boolean]} relativeToNonStaticParent  Whether the rect should be relative to the relative parent of (including) the contaienr
 * @param  {[Boolean]} undoScale                  Whether the container's scale() should be undone
 * @param  {[HTMLElement]} container              The parent the element will be placed in
 * @return {Object}                               The boundingClientRect of el, with specified adjustments
 */


function getRect(el, relativeToContainingBlock, relativeToNonStaticParent, undoScale, container) {
  if (!el.getBoundingClientRect && el !== window) return;
  var elRect, top, left, bottom, right, height, width;

  if (el !== window && el.parentNode && el !== getWindowScrollingElement()) {
    elRect = el.getBoundingClientRect();
    top = elRect.top;
    left = elRect.left;
    bottom = elRect.bottom;
    right = elRect.right;
    height = elRect.height;
    width = elRect.width;
  } else {
    top = 0;
    left = 0;
    bottom = window.innerHeight;
    right = window.innerWidth;
    height = window.innerHeight;
    width = window.innerWidth;
  }

  if ((relativeToContainingBlock || relativeToNonStaticParent) && el !== window) {
    // Adjust for translate()
    container = container || el.parentNode; // solves #1123 (see: https://stackoverflow.com/a/37953806/6088312)
    // Not needed on <= IE11

    if (!IE11OrLess) {
      do {
        if (container && container.getBoundingClientRect && (css(container, 'transform') !== 'none' || relativeToNonStaticParent && css(container, 'position') !== 'static')) {
          var containerRect = container.getBoundingClientRect(); // Set relative to edges of padding box of container

          top -= containerRect.top + parseInt(css(container, 'border-top-width'));
          left -= containerRect.left + parseInt(css(container, 'border-left-width'));
          bottom = top + elRect.height;
          right = left + elRect.width;
          break;
        }
        /* jshint boss:true */

      } while (container = container.parentNode);
    }
  }

  if (undoScale && el !== window) {
    // Adjust for scale()
    var elMatrix = matrix(container || el),
        scaleX = elMatrix && elMatrix.a,
        scaleY = elMatrix && elMatrix.d;

    if (elMatrix) {
      top /= scaleY;
      left /= scaleX;
      width /= scaleX;
      height /= scaleY;
      bottom = top + height;
      right = left + width;
    }
  }

  return {
    top: top,
    left: left,
    bottom: bottom,
    right: right,
    width: width,
    height: height
  };
}
/**
 * Checks if a side of an element is scrolled past a side of its parents
 * @param  {HTMLElement}  el           The element who's side being scrolled out of view is in question
 * @param  {String}       elSide       Side of the element in question ('top', 'left', 'right', 'bottom')
 * @param  {String}       parentSide   Side of the parent in question ('top', 'left', 'right', 'bottom')
 * @return {HTMLElement}               The parent scroll element that the el's side is scrolled past, or null if there is no such element
 */


function isScrolledPast(el, elSide, parentSide) {
  var parent = getParentAutoScrollElement(el, true),
      elSideVal = getRect(el)[elSide];
  /* jshint boss:true */

  while (parent) {
    var parentSideVal = getRect(parent)[parentSide],
        visible = void 0;

    if (parentSide === 'top' || parentSide === 'left') {
      visible = elSideVal >= parentSideVal;
    } else {
      visible = elSideVal <= parentSideVal;
    }

    if (!visible) return parent;
    if (parent === getWindowScrollingElement()) break;
    parent = getParentAutoScrollElement(parent, false);
  }

  return false;
}
/**
 * Gets nth child of el, ignoring hidden children, sortable's elements (does not ignore clone if it's visible)
 * and non-draggable elements
 * @param  {HTMLElement} el       The parent element
 * @param  {Number} childNum      The index of the child
 * @param  {Object} options       Parent Sortable's options
 * @return {HTMLElement}          The child at index childNum, or null if not found
 */


function getChild(el, childNum, options, includeDragEl) {
  var currentChild = 0,
      i = 0,
      children = el.children;

  while (i < children.length) {
    if (children[i].style.display !== 'none' && children[i] !== Sortable.ghost && (includeDragEl || children[i] !== Sortable.dragged) && closest(children[i], options.draggable, el, false)) {
      if (currentChild === childNum) {
        return children[i];
      }

      currentChild++;
    }

    i++;
  }

  return null;
}
/**
 * Gets the last child in the el, ignoring ghostEl or invisible elements (clones)
 * @param  {HTMLElement} el       Parent element
 * @param  {selector} selector    Any other elements that should be ignored
 * @return {HTMLElement}          The last child, ignoring ghostEl
 */


function lastChild(el, selector) {
  var last = el.lastElementChild;

  while (last && (last === Sortable.ghost || css(last, 'display') === 'none' || selector && !matches(last, selector))) {
    last = last.previousElementSibling;
  }

  return last || null;
}
/**
 * Returns the index of an element within its parent for a selected set of
 * elements
 * @param  {HTMLElement} el
 * @param  {selector} selector
 * @return {number}
 */


function index(el, selector) {
  var index = 0;

  if (!el || !el.parentNode) {
    return -1;
  }
  /* jshint boss:true */


  while (el = el.previousElementSibling) {
    if (el.nodeName.toUpperCase() !== 'TEMPLATE' && el !== Sortable.clone && (!selector || matches(el, selector))) {
      index++;
    }
  }

  return index;
}
/**
 * Returns the scroll offset of the given element, added with all the scroll offsets of parent elements.
 * The value is returned in real pixels.
 * @param  {HTMLElement} el
 * @return {Array}             Offsets in the format of [left, top]
 */


function getRelativeScrollOffset(el) {
  var offsetLeft = 0,
      offsetTop = 0,
      winScroller = getWindowScrollingElement();

  if (el) {
    do {
      var elMatrix = matrix(el),
          scaleX = elMatrix.a,
          scaleY = elMatrix.d;
      offsetLeft += el.scrollLeft * scaleX;
      offsetTop += el.scrollTop * scaleY;
    } while (el !== winScroller && (el = el.parentNode));
  }

  return [offsetLeft, offsetTop];
}
/**
 * Returns the index of the object within the given array
 * @param  {Array} arr   Array that may or may not hold the object
 * @param  {Object} obj  An object that has a key-value pair unique to and identical to a key-value pair in the object you want to find
 * @return {Number}      The index of the object in the array, or -1
 */


function indexOfObject(arr, obj) {
  for (var i in arr) {
    if (!arr.hasOwnProperty(i)) continue;

    for (var key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === arr[i][key]) return Number(i);
    }
  }

  return -1;
}

function getParentAutoScrollElement(el, includeSelf) {
  // skip to window
  if (!el || !el.getBoundingClientRect) return getWindowScrollingElement();
  var elem = el;
  var gotSelf = false;

  do {
    // we don't need to get elem css if it isn't even overflowing in the first place (performance)
    if (elem.clientWidth < elem.scrollWidth || elem.clientHeight < elem.scrollHeight) {
      var elemCSS = css(elem);

      if (elem.clientWidth < elem.scrollWidth && (elemCSS.overflowX == 'auto' || elemCSS.overflowX == 'scroll') || elem.clientHeight < elem.scrollHeight && (elemCSS.overflowY == 'auto' || elemCSS.overflowY == 'scroll')) {
        if (!elem.getBoundingClientRect || elem === document.body) return getWindowScrollingElement();
        if (gotSelf || includeSelf) return elem;
        gotSelf = true;
      }
    }
    /* jshint boss:true */

  } while (elem = elem.parentNode);

  return getWindowScrollingElement();
}

function extend(dst, src) {
  if (dst && src) {
    for (var key in src) {
      if (src.hasOwnProperty(key)) {
        dst[key] = src[key];
      }
    }
  }

  return dst;
}

function isRectEqual(rect1, rect2) {
  return Math.round(rect1.top) === Math.round(rect2.top) && Math.round(rect1.left) === Math.round(rect2.left) && Math.round(rect1.height) === Math.round(rect2.height) && Math.round(rect1.width) === Math.round(rect2.width);
}

var _throttleTimeout;

function throttle(callback, ms) {
  return function () {
    if (!_throttleTimeout) {
      var args = arguments,
          _this = this;

      if (args.length === 1) {
        callback.call(_this, args[0]);
      } else {
        callback.apply(_this, args);
      }

      _throttleTimeout = setTimeout(function () {
        _throttleTimeout = void 0;
      }, ms);
    }
  };
}

function cancelThrottle() {
  clearTimeout(_throttleTimeout);
  _throttleTimeout = void 0;
}

function scrollBy(el, x, y) {
  el.scrollLeft += x;
  el.scrollTop += y;
}

function clone(el) {
  var Polymer = window.Polymer;
  var $ = window.jQuery || window.Zepto;

  if (Polymer && Polymer.dom) {
    return Polymer.dom(el).cloneNode(true);
  } else if ($) {
    return $(el).clone(true)[0];
  } else {
    return el.cloneNode(true);
  }
}

function setRect(el, rect) {
  css(el, 'position', 'absolute');
  css(el, 'top', rect.top);
  css(el, 'left', rect.left);
  css(el, 'width', rect.width);
  css(el, 'height', rect.height);
}

function unsetRect(el) {
  css(el, 'position', '');
  css(el, 'top', '');
  css(el, 'left', '');
  css(el, 'width', '');
  css(el, 'height', '');
}

var expando = 'Sortable' + new Date().getTime();

function AnimationStateManager() {
  var animationStates = [],
      animationCallbackId;
  return {
    captureAnimationState: function captureAnimationState() {
      animationStates = [];
      if (!this.options.animation) return;
      var children = [].slice.call(this.el.children);
      children.forEach(function (child) {
        if (css(child, 'display') === 'none' || child === Sortable.ghost) return;
        animationStates.push({
          target: child,
          rect: getRect(child)
        });

        var fromRect = _objectSpread2({}, animationStates[animationStates.length - 1].rect); // If animating: compensate for current animation


        if (child.thisAnimationDuration) {
          var childMatrix = matrix(child, true);

          if (childMatrix) {
            fromRect.top -= childMatrix.f;
            fromRect.left -= childMatrix.e;
          }
        }

        child.fromRect = fromRect;
      });
    },
    addAnimationState: function addAnimationState(state) {
      animationStates.push(state);
    },
    removeAnimationState: function removeAnimationState(target) {
      animationStates.splice(indexOfObject(animationStates, {
        target: target
      }), 1);
    },
    animateAll: function animateAll(callback) {
      var _this = this;

      if (!this.options.animation) {
        clearTimeout(animationCallbackId);
        if (typeof callback === 'function') callback();
        return;
      }

      var animating = false,
          animationTime = 0;
      animationStates.forEach(function (state) {
        var time = 0,
            target = state.target,
            fromRect = target.fromRect,
            toRect = getRect(target),
            prevFromRect = target.prevFromRect,
            prevToRect = target.prevToRect,
            animatingRect = state.rect,
            targetMatrix = matrix(target, true);

        if (targetMatrix) {
          // Compensate for current animation
          toRect.top -= targetMatrix.f;
          toRect.left -= targetMatrix.e;
        }

        target.toRect = toRect;

        if (target.thisAnimationDuration) {
          // Could also check if animatingRect is between fromRect and toRect
          if (isRectEqual(prevFromRect, toRect) && !isRectEqual(fromRect, toRect) && // Make sure animatingRect is on line between toRect & fromRect
          (animatingRect.top - toRect.top) / (animatingRect.left - toRect.left) === (fromRect.top - toRect.top) / (fromRect.left - toRect.left)) {
            // If returning to same place as started from animation and on same axis
            time = calculateRealTime(animatingRect, prevFromRect, prevToRect, _this.options);
          }
        } // if fromRect != toRect: animate


        if (!isRectEqual(toRect, fromRect)) {
          target.prevFromRect = fromRect;
          target.prevToRect = toRect;

          if (!time) {
            time = _this.options.animation;
          }

          _this.animate(target, animatingRect, toRect, time);
        }

        if (time) {
          animating = true;
          animationTime = Math.max(animationTime, time);
          clearTimeout(target.animationResetTimer);
          target.animationResetTimer = setTimeout(function () {
            target.animationTime = 0;
            target.prevFromRect = null;
            target.fromRect = null;
            target.prevToRect = null;
            target.thisAnimationDuration = null;
          }, time);
          target.thisAnimationDuration = time;
        }
      });
      clearTimeout(animationCallbackId);

      if (!animating) {
        if (typeof callback === 'function') callback();
      } else {
        animationCallbackId = setTimeout(function () {
          if (typeof callback === 'function') callback();
        }, animationTime);
      }

      animationStates = [];
    },
    animate: function animate(target, currentRect, toRect, duration) {
      if (duration) {
        css(target, 'transition', '');
        css(target, 'transform', '');
        var elMatrix = matrix(this.el),
            scaleX = elMatrix && elMatrix.a,
            scaleY = elMatrix && elMatrix.d,
            translateX = (currentRect.left - toRect.left) / (scaleX || 1),
            translateY = (currentRect.top - toRect.top) / (scaleY || 1);
        target.animatingX = !!translateX;
        target.animatingY = !!translateY;
        css(target, 'transform', 'translate3d(' + translateX + 'px,' + translateY + 'px,0)');
        this.forRepaintDummy = repaint(target); // repaint

        css(target, 'transition', 'transform ' + duration + 'ms' + (this.options.easing ? ' ' + this.options.easing : ''));
        css(target, 'transform', 'translate3d(0,0,0)');
        typeof target.animated === 'number' && clearTimeout(target.animated);
        target.animated = setTimeout(function () {
          css(target, 'transition', '');
          css(target, 'transform', '');
          target.animated = false;
          target.animatingX = false;
          target.animatingY = false;
        }, duration);
      }
    }
  };
}

function repaint(target) {
  return target.offsetWidth;
}

function calculateRealTime(animatingRect, fromRect, toRect, options) {
  return Math.sqrt(Math.pow(fromRect.top - animatingRect.top, 2) + Math.pow(fromRect.left - animatingRect.left, 2)) / Math.sqrt(Math.pow(fromRect.top - toRect.top, 2) + Math.pow(fromRect.left - toRect.left, 2)) * options.animation;
}

var plugins = [];
var defaults = {
  initializeByDefault: true
};
var PluginManager = {
  mount: function mount(plugin) {
    // Set default static properties
    for (var option in defaults) {
      if (defaults.hasOwnProperty(option) && !(option in plugin)) {
        plugin[option] = defaults[option];
      }
    }

    plugins.forEach(function (p) {
      if (p.pluginName === plugin.pluginName) {
        throw "Sortable: Cannot mount plugin ".concat(plugin.pluginName, " more than once");
      }
    });
    plugins.push(plugin);
  },
  pluginEvent: function pluginEvent(eventName, sortable, evt) {
    var _this = this;

    this.eventCanceled = false;

    evt.cancel = function () {
      _this.eventCanceled = true;
    };

    var eventNameGlobal = eventName + 'Global';
    plugins.forEach(function (plugin) {
      if (!sortable[plugin.pluginName]) return; // Fire global events if it exists in this sortable

      if (sortable[plugin.pluginName][eventNameGlobal]) {
        sortable[plugin.pluginName][eventNameGlobal](_objectSpread2({
          sortable: sortable
        }, evt));
      } // Only fire plugin event if plugin is enabled in this sortable,
      // and plugin has event defined


      if (sortable.options[plugin.pluginName] && sortable[plugin.pluginName][eventName]) {
        sortable[plugin.pluginName][eventName](_objectSpread2({
          sortable: sortable
        }, evt));
      }
    });
  },
  initializePlugins: function initializePlugins(sortable, el, defaults, options) {
    plugins.forEach(function (plugin) {
      var pluginName = plugin.pluginName;
      if (!sortable.options[pluginName] && !plugin.initializeByDefault) return;
      var initialized = new plugin(sortable, el, sortable.options);
      initialized.sortable = sortable;
      initialized.options = sortable.options;
      sortable[pluginName] = initialized; // Add default options from plugin

      _extends(defaults, initialized.defaults);
    });

    for (var option in sortable.options) {
      if (!sortable.options.hasOwnProperty(option)) continue;
      var modified = this.modifyOption(sortable, option, sortable.options[option]);

      if (typeof modified !== 'undefined') {
        sortable.options[option] = modified;
      }
    }
  },
  getEventProperties: function getEventProperties(name, sortable) {
    var eventProperties = {};
    plugins.forEach(function (plugin) {
      if (typeof plugin.eventProperties !== 'function') return;

      _extends(eventProperties, plugin.eventProperties.call(sortable[plugin.pluginName], name));
    });
    return eventProperties;
  },
  modifyOption: function modifyOption(sortable, name, value) {
    var modifiedValue;
    plugins.forEach(function (plugin) {
      // Plugin must exist on the Sortable
      if (!sortable[plugin.pluginName]) return; // If static option listener exists for this option, call in the context of the Sortable's instance of this plugin

      if (plugin.optionListeners && typeof plugin.optionListeners[name] === 'function') {
        modifiedValue = plugin.optionListeners[name].call(sortable[plugin.pluginName], value);
      }
    });
    return modifiedValue;
  }
};

function dispatchEvent(_ref) {
  var sortable = _ref.sortable,
      rootEl = _ref.rootEl,
      name = _ref.name,
      targetEl = _ref.targetEl,
      cloneEl = _ref.cloneEl,
      toEl = _ref.toEl,
      fromEl = _ref.fromEl,
      oldIndex = _ref.oldIndex,
      newIndex = _ref.newIndex,
      oldDraggableIndex = _ref.oldDraggableIndex,
      newDraggableIndex = _ref.newDraggableIndex,
      originalEvent = _ref.originalEvent,
      putSortable = _ref.putSortable,
      extraEventProperties = _ref.extraEventProperties;
  sortable = sortable || rootEl && rootEl[expando];
  if (!sortable) return;
  var evt,
      options = sortable.options,
      onName = 'on' + name.charAt(0).toUpperCase() + name.substr(1); // Support for new CustomEvent feature

  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent(name, {
      bubbles: true,
      cancelable: true
    });
  } else {
    evt = document.createEvent('Event');
    evt.initEvent(name, true, true);
  }

  evt.to = toEl || rootEl;
  evt.from = fromEl || rootEl;
  evt.item = targetEl || rootEl;
  evt.clone = cloneEl;
  evt.oldIndex = oldIndex;
  evt.newIndex = newIndex;
  evt.oldDraggableIndex = oldDraggableIndex;
  evt.newDraggableIndex = newDraggableIndex;
  evt.originalEvent = originalEvent;
  evt.pullMode = putSortable ? putSortable.lastPutMode : undefined;

  var allEventProperties = _objectSpread2(_objectSpread2({}, extraEventProperties), PluginManager.getEventProperties(name, sortable));

  for (var option in allEventProperties) {
    evt[option] = allEventProperties[option];
  }

  if (rootEl) {
    rootEl.dispatchEvent(evt);
  }

  if (options[onName]) {
    options[onName].call(sortable, evt);
  }
}

var _excluded = ["evt"];

var pluginEvent = function pluginEvent(eventName, sortable) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      originalEvent = _ref.evt,
      data = _objectWithoutProperties(_ref, _excluded);

  PluginManager.pluginEvent.bind(Sortable)(eventName, sortable, _objectSpread2({
    dragEl: dragEl,
    parentEl: parentEl,
    ghostEl: ghostEl,
    rootEl: rootEl,
    nextEl: nextEl,
    lastDownEl: lastDownEl,
    cloneEl: cloneEl,
    cloneHidden: cloneHidden,
    dragStarted: moved,
    putSortable: putSortable,
    activeSortable: Sortable.active,
    originalEvent: originalEvent,
    oldIndex: oldIndex,
    oldDraggableIndex: oldDraggableIndex,
    newIndex: newIndex,
    newDraggableIndex: newDraggableIndex,
    hideGhostForTarget: _hideGhostForTarget,
    unhideGhostForTarget: _unhideGhostForTarget,
    cloneNowHidden: function cloneNowHidden() {
      cloneHidden = true;
    },
    cloneNowShown: function cloneNowShown() {
      cloneHidden = false;
    },
    dispatchSortableEvent: function dispatchSortableEvent(name) {
      _dispatchEvent({
        sortable: sortable,
        name: name,
        originalEvent: originalEvent
      });
    }
  }, data));
};

function _dispatchEvent(info) {
  dispatchEvent(_objectSpread2({
    putSortable: putSortable,
    cloneEl: cloneEl,
    targetEl: dragEl,
    rootEl: rootEl,
    oldIndex: oldIndex,
    oldDraggableIndex: oldDraggableIndex,
    newIndex: newIndex,
    newDraggableIndex: newDraggableIndex
  }, info));
}

var dragEl,
    parentEl,
    ghostEl,
    rootEl,
    nextEl,
    lastDownEl,
    cloneEl,
    cloneHidden,
    oldIndex,
    newIndex,
    oldDraggableIndex,
    newDraggableIndex,
    activeGroup,
    putSortable,
    awaitingDragStarted = false,
    ignoreNextClick = false,
    sortables = [],
    tapEvt,
    touchEvt,
    lastDx,
    lastDy,
    tapDistanceLeft,
    tapDistanceTop,
    moved,
    lastTarget,
    lastDirection,
    pastFirstInvertThresh = false,
    isCircumstantialInvert = false,
    targetMoveDistance,
    // For positioning ghost absolutely
ghostRelativeParent,
    ghostRelativeParentInitialScroll = [],
    // (left, top)
_silent = false,
    savedInputChecked = [];
/** @const */

var documentExists = typeof document !== 'undefined',
    PositionGhostAbsolutely = IOS,
    CSSFloatProperty = Edge || IE11OrLess ? 'cssFloat' : 'float',
    // This will not pass for IE9, because IE9 DnD only works on anchors
supportDraggable = documentExists && !ChromeForAndroid && !IOS && 'draggable' in document.createElement('div'),
    supportCssPointerEvents = function () {
  if (!documentExists) return; // false when <= IE11

  if (IE11OrLess) {
    return false;
  }

  var el = document.createElement('x');
  el.style.cssText = 'pointer-events:auto';
  return el.style.pointerEvents === 'auto';
}(),
    _detectDirection = function _detectDirection(el, options) {
  var elCSS = css(el),
      elWidth = parseInt(elCSS.width) - parseInt(elCSS.paddingLeft) - parseInt(elCSS.paddingRight) - parseInt(elCSS.borderLeftWidth) - parseInt(elCSS.borderRightWidth),
      child1 = getChild(el, 0, options),
      child2 = getChild(el, 1, options),
      firstChildCSS = child1 && css(child1),
      secondChildCSS = child2 && css(child2),
      firstChildWidth = firstChildCSS && parseInt(firstChildCSS.marginLeft) + parseInt(firstChildCSS.marginRight) + getRect(child1).width,
      secondChildWidth = secondChildCSS && parseInt(secondChildCSS.marginLeft) + parseInt(secondChildCSS.marginRight) + getRect(child2).width;

  if (elCSS.display === 'flex') {
    return elCSS.flexDirection === 'column' || elCSS.flexDirection === 'column-reverse' ? 'vertical' : 'horizontal';
  }

  if (elCSS.display === 'grid') {
    return elCSS.gridTemplateColumns.split(' ').length <= 1 ? 'vertical' : 'horizontal';
  }

  if (child1 && firstChildCSS["float"] && firstChildCSS["float"] !== 'none') {
    var touchingSideChild2 = firstChildCSS["float"] === 'left' ? 'left' : 'right';
    return child2 && (secondChildCSS.clear === 'both' || secondChildCSS.clear === touchingSideChild2) ? 'vertical' : 'horizontal';
  }

  return child1 && (firstChildCSS.display === 'block' || firstChildCSS.display === 'flex' || firstChildCSS.display === 'table' || firstChildCSS.display === 'grid' || firstChildWidth >= elWidth && elCSS[CSSFloatProperty] === 'none' || child2 && elCSS[CSSFloatProperty] === 'none' && firstChildWidth + secondChildWidth > elWidth) ? 'vertical' : 'horizontal';
},
    _dragElInRowColumn = function _dragElInRowColumn(dragRect, targetRect, vertical) {
  var dragElS1Opp = vertical ? dragRect.left : dragRect.top,
      dragElS2Opp = vertical ? dragRect.right : dragRect.bottom,
      dragElOppLength = vertical ? dragRect.width : dragRect.height,
      targetS1Opp = vertical ? targetRect.left : targetRect.top,
      targetS2Opp = vertical ? targetRect.right : targetRect.bottom,
      targetOppLength = vertical ? targetRect.width : targetRect.height;
  return dragElS1Opp === targetS1Opp || dragElS2Opp === targetS2Opp || dragElS1Opp + dragElOppLength / 2 === targetS1Opp + targetOppLength / 2;
},

/**
 * Detects first nearest empty sortable to X and Y position using emptyInsertThreshold.
 * @param  {Number} x      X position
 * @param  {Number} y      Y position
 * @return {HTMLElement}   Element of the first found nearest Sortable
 */
_detectNearestEmptySortable = function _detectNearestEmptySortable(x, y) {
  var ret;
  sortables.some(function (sortable) {
    var threshold = sortable[expando].options.emptyInsertThreshold;
    if (!threshold || lastChild(sortable)) return;
    var rect = getRect(sortable),
        insideHorizontally = x >= rect.left - threshold && x <= rect.right + threshold,
        insideVertically = y >= rect.top - threshold && y <= rect.bottom + threshold;

    if (insideHorizontally && insideVertically) {
      return ret = sortable;
    }
  });
  return ret;
},
    _prepareGroup = function _prepareGroup(options) {
  function toFn(value, pull) {
    return function (to, from, dragEl, evt) {
      var sameGroup = to.options.group.name && from.options.group.name && to.options.group.name === from.options.group.name;

      if (value == null && (pull || sameGroup)) {
        // Default pull value
        // Default pull and put value if same group
        return true;
      } else if (value == null || value === false) {
        return false;
      } else if (pull && value === 'clone') {
        return value;
      } else if (typeof value === 'function') {
        return toFn(value(to, from, dragEl, evt), pull)(to, from, dragEl, evt);
      } else {
        var otherGroup = (pull ? to : from).options.group.name;
        return value === true || typeof value === 'string' && value === otherGroup || value.join && value.indexOf(otherGroup) > -1;
      }
    };
  }

  var group = {};
  var originalGroup = options.group;

  if (!originalGroup || _typeof(originalGroup) != 'object') {
    originalGroup = {
      name: originalGroup
    };
  }

  group.name = originalGroup.name;
  group.checkPull = toFn(originalGroup.pull, true);
  group.checkPut = toFn(originalGroup.put);
  group.revertClone = originalGroup.revertClone;
  options.group = group;
},
    _hideGhostForTarget = function _hideGhostForTarget() {
  if (!supportCssPointerEvents && ghostEl) {
    css(ghostEl, 'display', 'none');
  }
},
    _unhideGhostForTarget = function _unhideGhostForTarget() {
  if (!supportCssPointerEvents && ghostEl) {
    css(ghostEl, 'display', '');
  }
}; // #1184 fix - Prevent click event on fallback if dragged but item not changed position


if (documentExists && !ChromeForAndroid) {
  document.addEventListener('click', function (evt) {
    if (ignoreNextClick) {
      evt.preventDefault();
      evt.stopPropagation && evt.stopPropagation();
      evt.stopImmediatePropagation && evt.stopImmediatePropagation();
      ignoreNextClick = false;
      return false;
    }
  }, true);
}

var nearestEmptyInsertDetectEvent = function nearestEmptyInsertDetectEvent(evt) {
  if (dragEl) {
    evt = evt.touches ? evt.touches[0] : evt;

    var nearest = _detectNearestEmptySortable(evt.clientX, evt.clientY);

    if (nearest) {
      // Create imitation event
      var event = {};

      for (var i in evt) {
        if (evt.hasOwnProperty(i)) {
          event[i] = evt[i];
        }
      }

      event.target = event.rootEl = nearest;
      event.preventDefault = void 0;
      event.stopPropagation = void 0;

      nearest[expando]._onDragOver(event);
    }
  }
};

var _checkOutsideTargetEl = function _checkOutsideTargetEl(evt) {
  if (dragEl) {
    dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
  }
};
/**
 * @class  Sortable
 * @param  {HTMLElement}  el
 * @param  {Object}       [options]
 */


function Sortable(el, options) {
  if (!(el && el.nodeType && el.nodeType === 1)) {
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(el));
  }

  this.el = el; // root element

  this.options = options = _extends({}, options); // Export instance

  el[expando] = this;
  var defaults = {
    group: null,
    sort: true,
    disabled: false,
    store: null,
    handle: null,
    draggable: /^[uo]l$/i.test(el.nodeName) ? '>li' : '>*',
    swapThreshold: 1,
    // percentage; 0 <= x <= 1
    invertSwap: false,
    // invert always
    invertedSwapThreshold: null,
    // will be set to same as swapThreshold if default
    removeCloneOnHide: true,
    direction: function direction() {
      return _detectDirection(el, this.options);
    },
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
    ignore: 'a, img',
    filter: null,
    preventOnFilter: true,
    animation: 0,
    easing: null,
    setData: function setData(dataTransfer, dragEl) {
      dataTransfer.setData('Text', dragEl.textContent);
    },
    dropBubble: false,
    dragoverBubble: false,
    dataIdAttr: 'data-id',
    delay: 0,
    delayOnTouchOnly: false,
    touchStartThreshold: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1,
    forceFallback: false,
    fallbackClass: 'sortable-fallback',
    fallbackOnBody: false,
    fallbackTolerance: 0,
    fallbackOffset: {
      x: 0,
      y: 0
    },
    supportPointer: Sortable.supportPointer !== false && 'PointerEvent' in window && !Safari,
    emptyInsertThreshold: 5
  };
  PluginManager.initializePlugins(this, el, defaults); // Set default options

  for (var name in defaults) {
    !(name in options) && (options[name] = defaults[name]);
  }

  _prepareGroup(options); // Bind all private methods


  for (var fn in this) {
    if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
      this[fn] = this[fn].bind(this);
    }
  } // Setup drag mode


  this.nativeDraggable = options.forceFallback ? false : supportDraggable;

  if (this.nativeDraggable) {
    // Touch start threshold cannot be greater than the native dragstart threshold
    this.options.touchStartThreshold = 1;
  } // Bind events


  if (options.supportPointer) {
    on(el, 'pointerdown', this._onTapStart);
  } else {
    on(el, 'mousedown', this._onTapStart);
    on(el, 'touchstart', this._onTapStart);
  }

  if (this.nativeDraggable) {
    on(el, 'dragover', this);
    on(el, 'dragenter', this);
  }

  sortables.push(this.el); // Restore sorting

  options.store && options.store.get && this.sort(options.store.get(this) || []); // Add animation state manager

  _extends(this, AnimationStateManager());
}

Sortable.prototype =
/** @lends Sortable.prototype */
{
  constructor: Sortable,
  _isOutsideThisEl: function _isOutsideThisEl(target) {
    if (!this.el.contains(target) && target !== this.el) {
      lastTarget = null;
    }
  },
  _getDirection: function _getDirection(evt, target) {
    return typeof this.options.direction === 'function' ? this.options.direction.call(this, evt, target, dragEl) : this.options.direction;
  },
  _onTapStart: function _onTapStart(
  /** Event|TouchEvent */
  evt) {
    if (!evt.cancelable) return;

    var _this = this,
        el = this.el,
        options = this.options,
        preventOnFilter = options.preventOnFilter,
        type = evt.type,
        touch = evt.touches && evt.touches[0] || evt.pointerType && evt.pointerType === 'touch' && evt,
        target = (touch || evt).target,
        originalTarget = evt.target.shadowRoot && (evt.path && evt.path[0] || evt.composedPath && evt.composedPath()[0]) || target,
        filter = options.filter;

    _saveInputCheckedState(el); // Don't trigger start event when an element is been dragged, otherwise the evt.oldindex always wrong when set option.group.


    if (dragEl) {
      return;
    }

    if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
      return; // only left button and enabled
    } // cancel dnd if original target is content editable


    if (originalTarget.isContentEditable) {
      return;
    } // Safari ignores further event handling after mousedown


    if (!this.nativeDraggable && Safari && target && target.tagName.toUpperCase() === 'SELECT') {
      return;
    }

    target = closest(target, options.draggable, el, false);

    if (target && target.animated) {
      return;
    }

    if (lastDownEl === target) {
      // Ignoring duplicate `down`
      return;
    } // Get the index of the dragged element within its parent


    oldIndex = index(target);
    oldDraggableIndex = index(target, options.draggable); // Check filter

    if (typeof filter === 'function') {
      if (filter.call(this, evt, target, this)) {
        _dispatchEvent({
          sortable: _this,
          rootEl: originalTarget,
          name: 'filter',
          targetEl: target,
          toEl: el,
          fromEl: el
        });

        pluginEvent('filter', _this, {
          evt: evt
        });
        preventOnFilter && evt.cancelable && evt.preventDefault();
        return; // cancel dnd
      }
    } else if (filter) {
      filter = filter.split(',').some(function (criteria) {
        criteria = closest(originalTarget, criteria.trim(), el, false);

        if (criteria) {
          _dispatchEvent({
            sortable: _this,
            rootEl: criteria,
            name: 'filter',
            targetEl: target,
            fromEl: el,
            toEl: el
          });

          pluginEvent('filter', _this, {
            evt: evt
          });
          return true;
        }
      });

      if (filter) {
        preventOnFilter && evt.cancelable && evt.preventDefault();
        return; // cancel dnd
      }
    }

    if (options.handle && !closest(originalTarget, options.handle, el, false)) {
      return;
    } // Prepare `dragstart`


    this._prepareDragStart(evt, touch, target);
  },
  _prepareDragStart: function _prepareDragStart(
  /** Event */
  evt,
  /** Touch */
  touch,
  /** HTMLElement */
  target) {
    var _this = this,
        el = _this.el,
        options = _this.options,
        ownerDocument = el.ownerDocument,
        dragStartFn;

    if (target && !dragEl && target.parentNode === el) {
      var dragRect = getRect(target);
      rootEl = el;
      dragEl = target;
      parentEl = dragEl.parentNode;
      nextEl = dragEl.nextSibling;
      lastDownEl = target;
      activeGroup = options.group;
      Sortable.dragged = dragEl;
      tapEvt = {
        target: dragEl,
        clientX: (touch || evt).clientX,
        clientY: (touch || evt).clientY
      };
      tapDistanceLeft = tapEvt.clientX - dragRect.left;
      tapDistanceTop = tapEvt.clientY - dragRect.top;
      this._lastX = (touch || evt).clientX;
      this._lastY = (touch || evt).clientY;
      dragEl.style['will-change'] = 'all';

      dragStartFn = function dragStartFn() {
        pluginEvent('delayEnded', _this, {
          evt: evt
        });

        if (Sortable.eventCanceled) {
          _this._onDrop();

          return;
        } // Delayed drag has been triggered
        // we can re-enable the events: touchmove/mousemove


        _this._disableDelayedDragEvents();

        if (!FireFox && _this.nativeDraggable) {
          dragEl.draggable = true;
        } // Bind the events: dragstart/dragend


        _this._triggerDragStart(evt, touch); // Drag start event


        _dispatchEvent({
          sortable: _this,
          name: 'choose',
          originalEvent: evt
        }); // Chosen item


        toggleClass(dragEl, options.chosenClass, true);
      }; // Disable "draggable"


      options.ignore.split(',').forEach(function (criteria) {
        find(dragEl, criteria.trim(), _disableDraggable);
      });
      on(ownerDocument, 'dragover', nearestEmptyInsertDetectEvent);
      on(ownerDocument, 'mousemove', nearestEmptyInsertDetectEvent);
      on(ownerDocument, 'touchmove', nearestEmptyInsertDetectEvent);
      on(ownerDocument, 'mouseup', _this._onDrop);
      on(ownerDocument, 'touchend', _this._onDrop);
      on(ownerDocument, 'touchcancel', _this._onDrop); // Make dragEl draggable (must be before delay for FireFox)

      if (FireFox && this.nativeDraggable) {
        this.options.touchStartThreshold = 4;
        dragEl.draggable = true;
      }

      pluginEvent('delayStart', this, {
        evt: evt
      }); // Delay is impossible for native DnD in Edge or IE

      if (options.delay && (!options.delayOnTouchOnly || touch) && (!this.nativeDraggable || !(Edge || IE11OrLess))) {
        if (Sortable.eventCanceled) {
          this._onDrop();

          return;
        } // If the user moves the pointer or let go the click or touch
        // before the delay has been reached:
        // disable the delayed drag


        on(ownerDocument, 'mouseup', _this._disableDelayedDrag);
        on(ownerDocument, 'touchend', _this._disableDelayedDrag);
        on(ownerDocument, 'touchcancel', _this._disableDelayedDrag);
        on(ownerDocument, 'mousemove', _this._delayedDragTouchMoveHandler);
        on(ownerDocument, 'touchmove', _this._delayedDragTouchMoveHandler);
        options.supportPointer && on(ownerDocument, 'pointermove', _this._delayedDragTouchMoveHandler);
        _this._dragStartTimer = setTimeout(dragStartFn, options.delay);
      } else {
        dragStartFn();
      }
    }
  },
  _delayedDragTouchMoveHandler: function _delayedDragTouchMoveHandler(
  /** TouchEvent|PointerEvent **/
  e) {
    var touch = e.touches ? e.touches[0] : e;

    if (Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1))) {
      this._disableDelayedDrag();
    }
  },
  _disableDelayedDrag: function _disableDelayedDrag() {
    dragEl && _disableDraggable(dragEl);
    clearTimeout(this._dragStartTimer);

    this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function _disableDelayedDragEvents() {
    var ownerDocument = this.el.ownerDocument;
    off(ownerDocument, 'mouseup', this._disableDelayedDrag);
    off(ownerDocument, 'touchend', this._disableDelayedDrag);
    off(ownerDocument, 'touchcancel', this._disableDelayedDrag);
    off(ownerDocument, 'mousemove', this._delayedDragTouchMoveHandler);
    off(ownerDocument, 'touchmove', this._delayedDragTouchMoveHandler);
    off(ownerDocument, 'pointermove', this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function _triggerDragStart(
  /** Event */
  evt,
  /** Touch */
  touch) {
    touch = touch || evt.pointerType == 'touch' && evt;

    if (!this.nativeDraggable || touch) {
      if (this.options.supportPointer) {
        on(document, 'pointermove', this._onTouchMove);
      } else if (touch) {
        on(document, 'touchmove', this._onTouchMove);
      } else {
        on(document, 'mousemove', this._onTouchMove);
      }
    } else {
      on(dragEl, 'dragend', this);
      on(rootEl, 'dragstart', this._onDragStart);
    }

    try {
      if (document.selection) {
        // Timeout neccessary for IE9
        _nextTick(function () {
          document.selection.empty();
        });
      } else {
        window.getSelection().removeAllRanges();
      }
    } catch (err) {}
  },
  _dragStarted: function _dragStarted(fallback, evt) {

    awaitingDragStarted = false;

    if (rootEl && dragEl) {
      pluginEvent('dragStarted', this, {
        evt: evt
      });

      if (this.nativeDraggable) {
        on(document, 'dragover', _checkOutsideTargetEl);
      }

      var options = this.options; // Apply effect

      !fallback && toggleClass(dragEl, options.dragClass, false);
      toggleClass(dragEl, options.ghostClass, true);
      Sortable.active = this;
      fallback && this._appendGhost(); // Drag start event

      _dispatchEvent({
        sortable: this,
        name: 'start',
        originalEvent: evt
      });
    } else {
      this._nulling();
    }
  },
  _emulateDragOver: function _emulateDragOver() {
    if (touchEvt) {
      this._lastX = touchEvt.clientX;
      this._lastY = touchEvt.clientY;

      _hideGhostForTarget();

      var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
      var parent = target;

      while (target && target.shadowRoot) {
        target = target.shadowRoot.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
        if (target === parent) break;
        parent = target;
      }

      dragEl.parentNode[expando]._isOutsideThisEl(target);

      if (parent) {
        do {
          if (parent[expando]) {
            var inserted = void 0;
            inserted = parent[expando]._onDragOver({
              clientX: touchEvt.clientX,
              clientY: touchEvt.clientY,
              target: target,
              rootEl: parent
            });

            if (inserted && !this.options.dragoverBubble) {
              break;
            }
          }

          target = parent; // store last element
        }
        /* jshint boss:true */
        while (parent = parent.parentNode);
      }

      _unhideGhostForTarget();
    }
  },
  _onTouchMove: function _onTouchMove(
  /**TouchEvent*/
  evt) {
    if (tapEvt) {
      var options = this.options,
          fallbackTolerance = options.fallbackTolerance,
          fallbackOffset = options.fallbackOffset,
          touch = evt.touches ? evt.touches[0] : evt,
          ghostMatrix = ghostEl && matrix(ghostEl, true),
          scaleX = ghostEl && ghostMatrix && ghostMatrix.a,
          scaleY = ghostEl && ghostMatrix && ghostMatrix.d,
          relativeScrollOffset = PositionGhostAbsolutely && ghostRelativeParent && getRelativeScrollOffset(ghostRelativeParent),
          dx = (touch.clientX - tapEvt.clientX + fallbackOffset.x) / (scaleX || 1) + (relativeScrollOffset ? relativeScrollOffset[0] - ghostRelativeParentInitialScroll[0] : 0) / (scaleX || 1),
          dy = (touch.clientY - tapEvt.clientY + fallbackOffset.y) / (scaleY || 1) + (relativeScrollOffset ? relativeScrollOffset[1] - ghostRelativeParentInitialScroll[1] : 0) / (scaleY || 1); // only set the status to dragging, when we are actually dragging

      if (!Sortable.active && !awaitingDragStarted) {
        if (fallbackTolerance && Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) < fallbackTolerance) {
          return;
        }

        this._onDragStart(evt, true);
      }

      if (ghostEl) {
        if (ghostMatrix) {
          ghostMatrix.e += dx - (lastDx || 0);
          ghostMatrix.f += dy - (lastDy || 0);
        } else {
          ghostMatrix = {
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            e: dx,
            f: dy
          };
        }

        var cssMatrix = "matrix(".concat(ghostMatrix.a, ",").concat(ghostMatrix.b, ",").concat(ghostMatrix.c, ",").concat(ghostMatrix.d, ",").concat(ghostMatrix.e, ",").concat(ghostMatrix.f, ")");
        css(ghostEl, 'webkitTransform', cssMatrix);
        css(ghostEl, 'mozTransform', cssMatrix);
        css(ghostEl, 'msTransform', cssMatrix);
        css(ghostEl, 'transform', cssMatrix);
        lastDx = dx;
        lastDy = dy;
        touchEvt = touch;
      }

      evt.cancelable && evt.preventDefault();
    }
  },
  _appendGhost: function _appendGhost() {
    // Bug if using scale(): https://stackoverflow.com/questions/2637058
    // Not being adjusted for
    if (!ghostEl) {
      var container = this.options.fallbackOnBody ? document.body : rootEl,
          rect = getRect(dragEl, true, PositionGhostAbsolutely, true, container),
          options = this.options; // Position absolutely

      if (PositionGhostAbsolutely) {
        // Get relatively positioned parent
        ghostRelativeParent = container;

        while (css(ghostRelativeParent, 'position') === 'static' && css(ghostRelativeParent, 'transform') === 'none' && ghostRelativeParent !== document) {
          ghostRelativeParent = ghostRelativeParent.parentNode;
        }

        if (ghostRelativeParent !== document.body && ghostRelativeParent !== document.documentElement) {
          if (ghostRelativeParent === document) ghostRelativeParent = getWindowScrollingElement();
          rect.top += ghostRelativeParent.scrollTop;
          rect.left += ghostRelativeParent.scrollLeft;
        } else {
          ghostRelativeParent = getWindowScrollingElement();
        }

        ghostRelativeParentInitialScroll = getRelativeScrollOffset(ghostRelativeParent);
      }

      ghostEl = dragEl.cloneNode(true);
      toggleClass(ghostEl, options.ghostClass, false);
      toggleClass(ghostEl, options.fallbackClass, true);
      toggleClass(ghostEl, options.dragClass, true);
      css(ghostEl, 'transition', '');
      css(ghostEl, 'transform', '');
      css(ghostEl, 'box-sizing', 'border-box');
      css(ghostEl, 'margin', 0);
      css(ghostEl, 'top', rect.top);
      css(ghostEl, 'left', rect.left);
      css(ghostEl, 'width', rect.width);
      css(ghostEl, 'height', rect.height);
      css(ghostEl, 'opacity', '0.8');
      css(ghostEl, 'position', PositionGhostAbsolutely ? 'absolute' : 'fixed');
      css(ghostEl, 'zIndex', '100000');
      css(ghostEl, 'pointerEvents', 'none');
      Sortable.ghost = ghostEl;
      container.appendChild(ghostEl); // Set transform-origin

      css(ghostEl, 'transform-origin', tapDistanceLeft / parseInt(ghostEl.style.width) * 100 + '% ' + tapDistanceTop / parseInt(ghostEl.style.height) * 100 + '%');
    }
  },
  _onDragStart: function _onDragStart(
  /**Event*/
  evt,
  /**boolean*/
  fallback) {
    var _this = this;

    var dataTransfer = evt.dataTransfer;
    var options = _this.options;
    pluginEvent('dragStart', this, {
      evt: evt
    });

    if (Sortable.eventCanceled) {
      this._onDrop();

      return;
    }

    pluginEvent('setupClone', this);

    if (!Sortable.eventCanceled) {
      cloneEl = clone(dragEl);
      cloneEl.removeAttribute("id");
      cloneEl.draggable = false;
      cloneEl.style['will-change'] = '';

      this._hideClone();

      toggleClass(cloneEl, this.options.chosenClass, false);
      Sortable.clone = cloneEl;
    } // #1143: IFrame support workaround


    _this.cloneId = _nextTick(function () {
      pluginEvent('clone', _this);
      if (Sortable.eventCanceled) return;

      if (!_this.options.removeCloneOnHide) {
        rootEl.insertBefore(cloneEl, dragEl);
      }

      _this._hideClone();

      _dispatchEvent({
        sortable: _this,
        name: 'clone'
      });
    });
    !fallback && toggleClass(dragEl, options.dragClass, true); // Set proper drop events

    if (fallback) {
      ignoreNextClick = true;
      _this._loopId = setInterval(_this._emulateDragOver, 50);
    } else {
      // Undo what was set in _prepareDragStart before drag started
      off(document, 'mouseup', _this._onDrop);
      off(document, 'touchend', _this._onDrop);
      off(document, 'touchcancel', _this._onDrop);

      if (dataTransfer) {
        dataTransfer.effectAllowed = 'move';
        options.setData && options.setData.call(_this, dataTransfer, dragEl);
      }

      on(document, 'drop', _this); // #1276 fix:

      css(dragEl, 'transform', 'translateZ(0)');
    }

    awaitingDragStarted = true;
    _this._dragStartId = _nextTick(_this._dragStarted.bind(_this, fallback, evt));
    on(document, 'selectstart', _this);
    moved = true;

    if (Safari) {
      css(document.body, 'user-select', 'none');
    }
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function _onDragOver(
  /**Event*/
  evt) {
    var el = this.el,
        target = evt.target,
        dragRect,
        targetRect,
        revert,
        options = this.options,
        group = options.group,
        activeSortable = Sortable.active,
        isOwner = activeGroup === group,
        canSort = options.sort,
        fromSortable = putSortable || activeSortable,
        vertical,
        _this = this,
        completedFired = false;

    if (_silent) return;

    function dragOverEvent(name, extra) {
      pluginEvent(name, _this, _objectSpread2({
        evt: evt,
        isOwner: isOwner,
        axis: vertical ? 'vertical' : 'horizontal',
        revert: revert,
        dragRect: dragRect,
        targetRect: targetRect,
        canSort: canSort,
        fromSortable: fromSortable,
        target: target,
        completed: completed,
        onMove: function onMove(target, after) {
          return _onMove(rootEl, el, dragEl, dragRect, target, getRect(target), evt, after);
        },
        changed: changed
      }, extra));
    } // Capture animation state


    function capture() {
      dragOverEvent('dragOverAnimationCapture');

      _this.captureAnimationState();

      if (_this !== fromSortable) {
        fromSortable.captureAnimationState();
      }
    } // Return invocation when dragEl is inserted (or completed)


    function completed(insertion) {
      dragOverEvent('dragOverCompleted', {
        insertion: insertion
      });

      if (insertion) {
        // Clones must be hidden before folding animation to capture dragRectAbsolute properly
        if (isOwner) {
          activeSortable._hideClone();
        } else {
          activeSortable._showClone(_this);
        }

        if (_this !== fromSortable) {
          // Set ghost class to new sortable's ghost class
          toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : activeSortable.options.ghostClass, false);
          toggleClass(dragEl, options.ghostClass, true);
        }

        if (putSortable !== _this && _this !== Sortable.active) {
          putSortable = _this;
        } else if (_this === Sortable.active && putSortable) {
          putSortable = null;
        } // Animation


        if (fromSortable === _this) {
          _this._ignoreWhileAnimating = target;
        }

        _this.animateAll(function () {
          dragOverEvent('dragOverAnimationComplete');
          _this._ignoreWhileAnimating = null;
        });

        if (_this !== fromSortable) {
          fromSortable.animateAll();
          fromSortable._ignoreWhileAnimating = null;
        }
      } // Null lastTarget if it is not inside a previously swapped element


      if (target === dragEl && !dragEl.animated || target === el && !target.animated) {
        lastTarget = null;
      } // no bubbling and not fallback


      if (!options.dragoverBubble && !evt.rootEl && target !== document) {
        dragEl.parentNode[expando]._isOutsideThisEl(evt.target); // Do not detect for empty insert if already inserted


        !insertion && nearestEmptyInsertDetectEvent(evt);
      }

      !options.dragoverBubble && evt.stopPropagation && evt.stopPropagation();
      return completedFired = true;
    } // Call when dragEl has been inserted


    function changed() {
      newIndex = index(dragEl);
      newDraggableIndex = index(dragEl, options.draggable);

      _dispatchEvent({
        sortable: _this,
        name: 'change',
        toEl: el,
        newIndex: newIndex,
        newDraggableIndex: newDraggableIndex,
        originalEvent: evt
      });
    }

    if (evt.preventDefault !== void 0) {
      evt.cancelable && evt.preventDefault();
    }

    target = closest(target, options.draggable, el, true);
    dragOverEvent('dragOver');
    if (Sortable.eventCanceled) return completedFired;

    if (dragEl.contains(evt.target) || target.animated && target.animatingX && target.animatingY || _this._ignoreWhileAnimating === target) {
      return completed(false);
    }

    ignoreNextClick = false;

    if (activeSortable && !options.disabled && (isOwner ? canSort || (revert = parentEl !== rootEl) // Reverting item into the original list
    : putSortable === this || (this.lastPutMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) && group.checkPut(this, activeSortable, dragEl, evt))) {
      vertical = this._getDirection(evt, target) === 'vertical';
      dragRect = getRect(dragEl);
      dragOverEvent('dragOverValid');
      if (Sortable.eventCanceled) return completedFired;

      if (revert) {
        parentEl = rootEl; // actualization

        capture();

        this._hideClone();

        dragOverEvent('revert');

        if (!Sortable.eventCanceled) {
          if (nextEl) {
            rootEl.insertBefore(dragEl, nextEl);
          } else {
            rootEl.appendChild(dragEl);
          }
        }

        return completed(true);
      }

      var elLastChild = lastChild(el, options.draggable);

      if (!elLastChild || _ghostIsLast(evt, vertical, this) && !elLastChild.animated) {
        // Insert to end of list
        // If already at end of list: Do not insert
        if (elLastChild === dragEl) {
          return completed(false);
        } // if there is a last element, it is the target


        if (elLastChild && el === evt.target) {
          target = elLastChild;
        }

        if (target) {
          targetRect = getRect(target);
        }

        if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, !!target) !== false) {
          capture();

          if (elLastChild && elLastChild.nextSibling) {
            // the last draggable element is not the last node
            el.insertBefore(dragEl, elLastChild.nextSibling);
          } else {
            el.appendChild(dragEl);
          }

          parentEl = el; // actualization

          changed();
          return completed(true);
        }
      } else if (elLastChild && _ghostIsFirst(evt, vertical, this)) {
        // Insert to start of list
        var firstChild = getChild(el, 0, options, true);

        if (firstChild === dragEl) {
          return completed(false);
        }

        target = firstChild;
        targetRect = getRect(target);

        if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, false) !== false) {
          capture();
          el.insertBefore(dragEl, firstChild);
          parentEl = el; // actualization

          changed();
          return completed(true);
        }
      } else if (target.parentNode === el) {
        targetRect = getRect(target);
        var direction = 0,
            targetBeforeFirstSwap,
            differentLevel = dragEl.parentNode !== el,
            differentRowCol = !_dragElInRowColumn(dragEl.animated && dragEl.toRect || dragRect, target.animated && target.toRect || targetRect, vertical),
            side1 = vertical ? 'top' : 'left',
            scrolledPastTop = isScrolledPast(target, 'top', 'top') || isScrolledPast(dragEl, 'top', 'top'),
            scrollBefore = scrolledPastTop ? scrolledPastTop.scrollTop : void 0;

        if (lastTarget !== target) {
          targetBeforeFirstSwap = targetRect[side1];
          pastFirstInvertThresh = false;
          isCircumstantialInvert = !differentRowCol && options.invertSwap || differentLevel;
        }

        direction = _getSwapDirection(evt, target, targetRect, vertical, differentRowCol ? 1 : options.swapThreshold, options.invertedSwapThreshold == null ? options.swapThreshold : options.invertedSwapThreshold, isCircumstantialInvert, lastTarget === target);
        var sibling;

        if (direction !== 0) {
          // Check if target is beside dragEl in respective direction (ignoring hidden elements)
          var dragIndex = index(dragEl);

          do {
            dragIndex -= direction;
            sibling = parentEl.children[dragIndex];
          } while (sibling && (css(sibling, 'display') === 'none' || sibling === ghostEl));
        } // If dragEl is already beside target: Do not insert


        if (direction === 0 || sibling === target) {
          return completed(false);
        }

        lastTarget = target;
        lastDirection = direction;
        var nextSibling = target.nextElementSibling,
            after = false;
        after = direction === 1;

        var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);

        if (moveVector !== false) {
          if (moveVector === 1 || moveVector === -1) {
            after = moveVector === 1;
          }

          _silent = true;
          setTimeout(_unsilent, 30);
          capture();

          if (after && !nextSibling) {
            el.appendChild(dragEl);
          } else {
            target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
          } // Undo chrome's scroll adjustment (has no effect on other browsers)


          if (scrolledPastTop) {
            scrollBy(scrolledPastTop, 0, scrollBefore - scrolledPastTop.scrollTop);
          }

          parentEl = dragEl.parentNode; // actualization
          // must be done before animation

          if (targetBeforeFirstSwap !== undefined && !isCircumstantialInvert) {
            targetMoveDistance = Math.abs(targetBeforeFirstSwap - getRect(target)[side1]);
          }

          changed();
          return completed(true);
        }
      }

      if (el.contains(dragEl)) {
        return completed(false);
      }
    }

    return false;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function _offMoveEvents() {
    off(document, 'mousemove', this._onTouchMove);
    off(document, 'touchmove', this._onTouchMove);
    off(document, 'pointermove', this._onTouchMove);
    off(document, 'dragover', nearestEmptyInsertDetectEvent);
    off(document, 'mousemove', nearestEmptyInsertDetectEvent);
    off(document, 'touchmove', nearestEmptyInsertDetectEvent);
  },
  _offUpEvents: function _offUpEvents() {
    var ownerDocument = this.el.ownerDocument;
    off(ownerDocument, 'mouseup', this._onDrop);
    off(ownerDocument, 'touchend', this._onDrop);
    off(ownerDocument, 'pointerup', this._onDrop);
    off(ownerDocument, 'touchcancel', this._onDrop);
    off(document, 'selectstart', this);
  },
  _onDrop: function _onDrop(
  /**Event*/
  evt) {
    var el = this.el,
        options = this.options; // Get the index of the dragged element within its parent

    newIndex = index(dragEl);
    newDraggableIndex = index(dragEl, options.draggable);
    pluginEvent('drop', this, {
      evt: evt
    });
    parentEl = dragEl && dragEl.parentNode; // Get again after plugin event

    newIndex = index(dragEl);
    newDraggableIndex = index(dragEl, options.draggable);

    if (Sortable.eventCanceled) {
      this._nulling();

      return;
    }

    awaitingDragStarted = false;
    isCircumstantialInvert = false;
    pastFirstInvertThresh = false;
    clearInterval(this._loopId);
    clearTimeout(this._dragStartTimer);

    _cancelNextTick(this.cloneId);

    _cancelNextTick(this._dragStartId); // Unbind events


    if (this.nativeDraggable) {
      off(document, 'drop', this);
      off(el, 'dragstart', this._onDragStart);
    }

    this._offMoveEvents();

    this._offUpEvents();

    if (Safari) {
      css(document.body, 'user-select', '');
    }

    css(dragEl, 'transform', '');

    if (evt) {
      if (moved) {
        evt.cancelable && evt.preventDefault();
        !options.dropBubble && evt.stopPropagation();
      }

      ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);

      if (rootEl === parentEl || putSortable && putSortable.lastPutMode !== 'clone') {
        // Remove clone(s)
        cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
      }

      if (dragEl) {
        if (this.nativeDraggable) {
          off(dragEl, 'dragend', this);
        }

        _disableDraggable(dragEl);

        dragEl.style['will-change'] = ''; // Remove classes
        // ghostClass is added in dragStarted

        if (moved && !awaitingDragStarted) {
          toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : this.options.ghostClass, false);
        }

        toggleClass(dragEl, this.options.chosenClass, false); // Drag stop event

        _dispatchEvent({
          sortable: this,
          name: 'unchoose',
          toEl: parentEl,
          newIndex: null,
          newDraggableIndex: null,
          originalEvent: evt
        });

        if (rootEl !== parentEl) {
          if (newIndex >= 0) {
            // Add event
            _dispatchEvent({
              rootEl: parentEl,
              name: 'add',
              toEl: parentEl,
              fromEl: rootEl,
              originalEvent: evt
            }); // Remove event


            _dispatchEvent({
              sortable: this,
              name: 'remove',
              toEl: parentEl,
              originalEvent: evt
            }); // drag from one list and drop into another


            _dispatchEvent({
              rootEl: parentEl,
              name: 'sort',
              toEl: parentEl,
              fromEl: rootEl,
              originalEvent: evt
            });

            _dispatchEvent({
              sortable: this,
              name: 'sort',
              toEl: parentEl,
              originalEvent: evt
            });
          }

          putSortable && putSortable.save();
        } else {
          if (newIndex !== oldIndex) {
            if (newIndex >= 0) {
              // drag & drop within the same list
              _dispatchEvent({
                sortable: this,
                name: 'update',
                toEl: parentEl,
                originalEvent: evt
              });

              _dispatchEvent({
                sortable: this,
                name: 'sort',
                toEl: parentEl,
                originalEvent: evt
              });
            }
          }
        }

        if (Sortable.active) {
          /* jshint eqnull:true */
          if (newIndex == null || newIndex === -1) {
            newIndex = oldIndex;
            newDraggableIndex = oldDraggableIndex;
          }

          _dispatchEvent({
            sortable: this,
            name: 'end',
            toEl: parentEl,
            originalEvent: evt
          }); // Save sorting


          this.save();
        }
      }
    }

    this._nulling();
  },
  _nulling: function _nulling() {
    pluginEvent('nulling', this);
    rootEl = dragEl = parentEl = ghostEl = nextEl = cloneEl = lastDownEl = cloneHidden = tapEvt = touchEvt = moved = newIndex = newDraggableIndex = oldIndex = oldDraggableIndex = lastTarget = lastDirection = putSortable = activeGroup = Sortable.dragged = Sortable.ghost = Sortable.clone = Sortable.active = null;
    savedInputChecked.forEach(function (el) {
      el.checked = true;
    });
    savedInputChecked.length = lastDx = lastDy = 0;
  },
  handleEvent: function handleEvent(
  /**Event*/
  evt) {
    switch (evt.type) {
      case 'drop':
      case 'dragend':
        this._onDrop(evt);

        break;

      case 'dragenter':
      case 'dragover':
        if (dragEl) {
          this._onDragOver(evt);

          _globalDragOver(evt);
        }

        break;

      case 'selectstart':
        evt.preventDefault();
        break;
    }
  },

  /**
   * Serializes the item into an array of string.
   * @returns {String[]}
   */
  toArray: function toArray() {
    var order = [],
        el,
        children = this.el.children,
        i = 0,
        n = children.length,
        options = this.options;

    for (; i < n; i++) {
      el = children[i];

      if (closest(el, options.draggable, this.el, false)) {
        order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
      }
    }

    return order;
  },

  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function sort(order, useAnimation) {
    var items = {},
        rootEl = this.el;
    this.toArray().forEach(function (id, i) {
      var el = rootEl.children[i];

      if (closest(el, this.options.draggable, rootEl, false)) {
        items[id] = el;
      }
    }, this);
    useAnimation && this.captureAnimationState();
    order.forEach(function (id) {
      if (items[id]) {
        rootEl.removeChild(items[id]);
        rootEl.appendChild(items[id]);
      }
    });
    useAnimation && this.animateAll();
  },

  /**
   * Save the current sorting
   */
  save: function save() {
    var store = this.options.store;
    store && store.set && store.set(this);
  },

  /**
   * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
   * @param   {HTMLElement}  el
   * @param   {String}       [selector]  default: `options.draggable`
   * @returns {HTMLElement|null}
   */
  closest: function closest$1(el, selector) {
    return closest(el, selector || this.options.draggable, this.el, false);
  },

  /**
   * Set/get option
   * @param   {string} name
   * @param   {*}      [value]
   * @returns {*}
   */
  option: function option(name, value) {
    var options = this.options;

    if (value === void 0) {
      return options[name];
    } else {
      var modifiedValue = PluginManager.modifyOption(this, name, value);

      if (typeof modifiedValue !== 'undefined') {
        options[name] = modifiedValue;
      } else {
        options[name] = value;
      }

      if (name === 'group') {
        _prepareGroup(options);
      }
    }
  },

  /**
   * Destroy
   */
  destroy: function destroy() {
    pluginEvent('destroy', this);
    var el = this.el;
    el[expando] = null;
    off(el, 'mousedown', this._onTapStart);
    off(el, 'touchstart', this._onTapStart);
    off(el, 'pointerdown', this._onTapStart);

    if (this.nativeDraggable) {
      off(el, 'dragover', this);
      off(el, 'dragenter', this);
    } // Remove draggable attributes


    Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el) {
      el.removeAttribute('draggable');
    });

    this._onDrop();

    this._disableDelayedDragEvents();

    sortables.splice(sortables.indexOf(this.el), 1);
    this.el = el = null;
  },
  _hideClone: function _hideClone() {
    if (!cloneHidden) {
      pluginEvent('hideClone', this);
      if (Sortable.eventCanceled) return;
      css(cloneEl, 'display', 'none');

      if (this.options.removeCloneOnHide && cloneEl.parentNode) {
        cloneEl.parentNode.removeChild(cloneEl);
      }

      cloneHidden = true;
    }
  },
  _showClone: function _showClone(putSortable) {
    if (putSortable.lastPutMode !== 'clone') {
      this._hideClone();

      return;
    }

    if (cloneHidden) {
      pluginEvent('showClone', this);
      if (Sortable.eventCanceled) return; // show clone at dragEl or original position

      if (dragEl.parentNode == rootEl && !this.options.group.revertClone) {
        rootEl.insertBefore(cloneEl, dragEl);
      } else if (nextEl) {
        rootEl.insertBefore(cloneEl, nextEl);
      } else {
        rootEl.appendChild(cloneEl);
      }

      if (this.options.group.revertClone) {
        this.animate(dragEl, cloneEl);
      }

      css(cloneEl, 'display', '');
      cloneHidden = false;
    }
  }
};

function _globalDragOver(
/**Event*/
evt) {
  if (evt.dataTransfer) {
    evt.dataTransfer.dropEffect = 'move';
  }

  evt.cancelable && evt.preventDefault();
}

function _onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect, originalEvent, willInsertAfter) {
  var evt,
      sortable = fromEl[expando],
      onMoveFn = sortable.options.onMove,
      retVal; // Support for new CustomEvent feature

  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent('move', {
      bubbles: true,
      cancelable: true
    });
  } else {
    evt = document.createEvent('Event');
    evt.initEvent('move', true, true);
  }

  evt.to = toEl;
  evt.from = fromEl;
  evt.dragged = dragEl;
  evt.draggedRect = dragRect;
  evt.related = targetEl || toEl;
  evt.relatedRect = targetRect || getRect(toEl);
  evt.willInsertAfter = willInsertAfter;
  evt.originalEvent = originalEvent;
  fromEl.dispatchEvent(evt);

  if (onMoveFn) {
    retVal = onMoveFn.call(sortable, evt, originalEvent);
  }

  return retVal;
}

function _disableDraggable(el) {
  el.draggable = false;
}

function _unsilent() {
  _silent = false;
}

function _ghostIsFirst(evt, vertical, sortable) {
  var rect = getRect(getChild(sortable.el, 0, sortable.options, true));
  var spacer = 10;
  return vertical ? evt.clientX < rect.left - spacer || evt.clientY < rect.top && evt.clientX < rect.right : evt.clientY < rect.top - spacer || evt.clientY < rect.bottom && evt.clientX < rect.left;
}

function _ghostIsLast(evt, vertical, sortable) {
  var rect = getRect(lastChild(sortable.el, sortable.options.draggable));
  var spacer = 10;
  return vertical ? evt.clientX > rect.right + spacer || evt.clientX <= rect.right && evt.clientY > rect.bottom && evt.clientX >= rect.left : evt.clientX > rect.right && evt.clientY > rect.top || evt.clientX <= rect.right && evt.clientY > rect.bottom + spacer;
}

function _getSwapDirection(evt, target, targetRect, vertical, swapThreshold, invertedSwapThreshold, invertSwap, isLastTarget) {
  var mouseOnAxis = vertical ? evt.clientY : evt.clientX,
      targetLength = vertical ? targetRect.height : targetRect.width,
      targetS1 = vertical ? targetRect.top : targetRect.left,
      targetS2 = vertical ? targetRect.bottom : targetRect.right,
      invert = false;

  if (!invertSwap) {
    // Never invert or create dragEl shadow when target movemenet causes mouse to move past the end of regular swapThreshold
    if (isLastTarget && targetMoveDistance < targetLength * swapThreshold) {
      // multiplied only by swapThreshold because mouse will already be inside target by (1 - threshold) * targetLength / 2
      // check if past first invert threshold on side opposite of lastDirection
      if (!pastFirstInvertThresh && (lastDirection === 1 ? mouseOnAxis > targetS1 + targetLength * invertedSwapThreshold / 2 : mouseOnAxis < targetS2 - targetLength * invertedSwapThreshold / 2)) {
        // past first invert threshold, do not restrict inverted threshold to dragEl shadow
        pastFirstInvertThresh = true;
      }

      if (!pastFirstInvertThresh) {
        // dragEl shadow (target move distance shadow)
        if (lastDirection === 1 ? mouseOnAxis < targetS1 + targetMoveDistance // over dragEl shadow
        : mouseOnAxis > targetS2 - targetMoveDistance) {
          return -lastDirection;
        }
      } else {
        invert = true;
      }
    } else {
      // Regular
      if (mouseOnAxis > targetS1 + targetLength * (1 - swapThreshold) / 2 && mouseOnAxis < targetS2 - targetLength * (1 - swapThreshold) / 2) {
        return _getInsertDirection(target);
      }
    }
  }

  invert = invert || invertSwap;

  if (invert) {
    // Invert of regular
    if (mouseOnAxis < targetS1 + targetLength * invertedSwapThreshold / 2 || mouseOnAxis > targetS2 - targetLength * invertedSwapThreshold / 2) {
      return mouseOnAxis > targetS1 + targetLength / 2 ? 1 : -1;
    }
  }

  return 0;
}
/**
 * Gets the direction dragEl must be swapped relative to target in order to make it
 * seem that dragEl has been "inserted" into that element's position
 * @param  {HTMLElement} target       The target whose position dragEl is being inserted at
 * @return {Number}                   Direction dragEl must be swapped
 */


function _getInsertDirection(target) {
  if (index(dragEl) < index(target)) {
    return 1;
  } else {
    return -1;
  }
}
/**
 * Generate id
 * @param   {HTMLElement} el
 * @returns {String}
 * @private
 */


function _generateId(el) {
  var str = el.tagName + el.className + el.src + el.href + el.textContent,
      i = str.length,
      sum = 0;

  while (i--) {
    sum += str.charCodeAt(i);
  }

  return sum.toString(36);
}

function _saveInputCheckedState(root) {
  savedInputChecked.length = 0;
  var inputs = root.getElementsByTagName('input');
  var idx = inputs.length;

  while (idx--) {
    var el = inputs[idx];
    el.checked && savedInputChecked.push(el);
  }
}

function _nextTick(fn) {
  return setTimeout(fn, 0);
}

function _cancelNextTick(id) {
  return clearTimeout(id);
} // Fixed #973:


if (documentExists) {
  on(document, 'touchmove', function (evt) {
    if ((Sortable.active || awaitingDragStarted) && evt.cancelable) {
      evt.preventDefault();
    }
  });
} // Export utils


Sortable.utils = {
  on: on,
  off: off,
  css: css,
  find: find,
  is: function is(el, selector) {
    return !!closest(el, selector, el, false);
  },
  extend: extend,
  throttle: throttle,
  closest: closest,
  toggleClass: toggleClass,
  clone: clone,
  index: index,
  nextTick: _nextTick,
  cancelNextTick: _cancelNextTick,
  detectDirection: _detectDirection,
  getChild: getChild
};
/**
 * Get the Sortable instance of an element
 * @param  {HTMLElement} element The element
 * @return {Sortable|undefined}         The instance of Sortable
 */

Sortable.get = function (element) {
  return element[expando];
};
/**
 * Mount a plugin to Sortable
 * @param  {...SortablePlugin|SortablePlugin[]} plugins       Plugins being mounted
 */


Sortable.mount = function () {
  for (var _len = arguments.length, plugins = new Array(_len), _key = 0; _key < _len; _key++) {
    plugins[_key] = arguments[_key];
  }

  if (plugins[0].constructor === Array) plugins = plugins[0];
  plugins.forEach(function (plugin) {
    if (!plugin.prototype || !plugin.prototype.constructor) {
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(plugin));
    }

    if (plugin.utils) Sortable.utils = _objectSpread2(_objectSpread2({}, Sortable.utils), plugin.utils);
    PluginManager.mount(plugin);
  });
};
/**
 * Create sortable instance
 * @param {HTMLElement}  el
 * @param {Object}      [options]
 */


Sortable.create = function (el, options) {
  return new Sortable(el, options);
}; // Export


Sortable.version = version;

var autoScrolls = [],
    scrollEl,
    scrollRootEl,
    scrolling = false,
    lastAutoScrollX,
    lastAutoScrollY,
    touchEvt$1,
    pointerElemChangedInterval;

function AutoScrollPlugin() {
  function AutoScroll() {
    this.defaults = {
      scroll: true,
      forceAutoScrollFallback: false,
      scrollSensitivity: 30,
      scrollSpeed: 10,
      bubbleScroll: true
    }; // Bind all private methods

    for (var fn in this) {
      if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
        this[fn] = this[fn].bind(this);
      }
    }
  }

  AutoScroll.prototype = {
    dragStarted: function dragStarted(_ref) {
      var originalEvent = _ref.originalEvent;

      if (this.sortable.nativeDraggable) {
        on(document, 'dragover', this._handleAutoScroll);
      } else {
        if (this.options.supportPointer) {
          on(document, 'pointermove', this._handleFallbackAutoScroll);
        } else if (originalEvent.touches) {
          on(document, 'touchmove', this._handleFallbackAutoScroll);
        } else {
          on(document, 'mousemove', this._handleFallbackAutoScroll);
        }
      }
    },
    dragOverCompleted: function dragOverCompleted(_ref2) {
      var originalEvent = _ref2.originalEvent;

      // For when bubbling is canceled and using fallback (fallback 'touchmove' always reached)
      if (!this.options.dragOverBubble && !originalEvent.rootEl) {
        this._handleAutoScroll(originalEvent);
      }
    },
    drop: function drop() {
      if (this.sortable.nativeDraggable) {
        off(document, 'dragover', this._handleAutoScroll);
      } else {
        off(document, 'pointermove', this._handleFallbackAutoScroll);
        off(document, 'touchmove', this._handleFallbackAutoScroll);
        off(document, 'mousemove', this._handleFallbackAutoScroll);
      }

      clearPointerElemChangedInterval();
      clearAutoScrolls();
      cancelThrottle();
    },
    nulling: function nulling() {
      touchEvt$1 = scrollRootEl = scrollEl = scrolling = pointerElemChangedInterval = lastAutoScrollX = lastAutoScrollY = null;
      autoScrolls.length = 0;
    },
    _handleFallbackAutoScroll: function _handleFallbackAutoScroll(evt) {
      this._handleAutoScroll(evt, true);
    },
    _handleAutoScroll: function _handleAutoScroll(evt, fallback) {
      var _this = this;

      var x = (evt.touches ? evt.touches[0] : evt).clientX,
          y = (evt.touches ? evt.touches[0] : evt).clientY,
          elem = document.elementFromPoint(x, y);
      touchEvt$1 = evt; // IE does not seem to have native autoscroll,
      // Edge's autoscroll seems too conditional,
      // MACOS Safari does not have autoscroll,
      // Firefox and Chrome are good

      if (fallback || this.options.forceAutoScrollFallback || Edge || IE11OrLess || Safari) {
        autoScroll(evt, this.options, elem, fallback); // Listener for pointer element change

        var ogElemScroller = getParentAutoScrollElement(elem, true);

        if (scrolling && (!pointerElemChangedInterval || x !== lastAutoScrollX || y !== lastAutoScrollY)) {
          pointerElemChangedInterval && clearPointerElemChangedInterval(); // Detect for pointer elem change, emulating native DnD behaviour

          pointerElemChangedInterval = setInterval(function () {
            var newElem = getParentAutoScrollElement(document.elementFromPoint(x, y), true);

            if (newElem !== ogElemScroller) {
              ogElemScroller = newElem;
              clearAutoScrolls();
            }

            autoScroll(evt, _this.options, newElem, fallback);
          }, 10);
          lastAutoScrollX = x;
          lastAutoScrollY = y;
        }
      } else {
        // if DnD is enabled (and browser has good autoscrolling), first autoscroll will already scroll, so get parent autoscroll of first autoscroll
        if (!this.options.bubbleScroll || getParentAutoScrollElement(elem, true) === getWindowScrollingElement()) {
          clearAutoScrolls();
          return;
        }

        autoScroll(evt, this.options, getParentAutoScrollElement(elem, false), false);
      }
    }
  };
  return _extends(AutoScroll, {
    pluginName: 'scroll',
    initializeByDefault: true
  });
}

function clearAutoScrolls() {
  autoScrolls.forEach(function (autoScroll) {
    clearInterval(autoScroll.pid);
  });
  autoScrolls = [];
}

function clearPointerElemChangedInterval() {
  clearInterval(pointerElemChangedInterval);
}

var autoScroll = throttle(function (evt, options, rootEl, isFallback) {
  // Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
  if (!options.scroll) return;
  var x = (evt.touches ? evt.touches[0] : evt).clientX,
      y = (evt.touches ? evt.touches[0] : evt).clientY,
      sens = options.scrollSensitivity,
      speed = options.scrollSpeed,
      winScroller = getWindowScrollingElement();
  var scrollThisInstance = false,
      scrollCustomFn; // New scroll root, set scrollEl

  if (scrollRootEl !== rootEl) {
    scrollRootEl = rootEl;
    clearAutoScrolls();
    scrollEl = options.scroll;
    scrollCustomFn = options.scrollFn;

    if (scrollEl === true) {
      scrollEl = getParentAutoScrollElement(rootEl, true);
    }
  }

  var layersOut = 0;
  var currentParent = scrollEl;

  do {
    var el = currentParent,
        rect = getRect(el),
        top = rect.top,
        bottom = rect.bottom,
        left = rect.left,
        right = rect.right,
        width = rect.width,
        height = rect.height,
        canScrollX = void 0,
        canScrollY = void 0,
        scrollWidth = el.scrollWidth,
        scrollHeight = el.scrollHeight,
        elCSS = css(el),
        scrollPosX = el.scrollLeft,
        scrollPosY = el.scrollTop;

    if (el === winScroller) {
      canScrollX = width < scrollWidth && (elCSS.overflowX === 'auto' || elCSS.overflowX === 'scroll' || elCSS.overflowX === 'visible');
      canScrollY = height < scrollHeight && (elCSS.overflowY === 'auto' || elCSS.overflowY === 'scroll' || elCSS.overflowY === 'visible');
    } else {
      canScrollX = width < scrollWidth && (elCSS.overflowX === 'auto' || elCSS.overflowX === 'scroll');
      canScrollY = height < scrollHeight && (elCSS.overflowY === 'auto' || elCSS.overflowY === 'scroll');
    }

    var vx = canScrollX && (Math.abs(right - x) <= sens && scrollPosX + width < scrollWidth) - (Math.abs(left - x) <= sens && !!scrollPosX);
    var vy = canScrollY && (Math.abs(bottom - y) <= sens && scrollPosY + height < scrollHeight) - (Math.abs(top - y) <= sens && !!scrollPosY);

    if (!autoScrolls[layersOut]) {
      for (var i = 0; i <= layersOut; i++) {
        if (!autoScrolls[i]) {
          autoScrolls[i] = {};
        }
      }
    }

    if (autoScrolls[layersOut].vx != vx || autoScrolls[layersOut].vy != vy || autoScrolls[layersOut].el !== el) {
      autoScrolls[layersOut].el = el;
      autoScrolls[layersOut].vx = vx;
      autoScrolls[layersOut].vy = vy;
      clearInterval(autoScrolls[layersOut].pid);

      if (vx != 0 || vy != 0) {
        scrollThisInstance = true;
        /* jshint loopfunc:true */

        autoScrolls[layersOut].pid = setInterval(function () {
          // emulate drag over during autoscroll (fallback), emulating native DnD behaviour
          if (isFallback && this.layer === 0) {
            Sortable.active._onTouchMove(touchEvt$1); // To move ghost if it is positioned absolutely

          }

          var scrollOffsetY = autoScrolls[this.layer].vy ? autoScrolls[this.layer].vy * speed : 0;
          var scrollOffsetX = autoScrolls[this.layer].vx ? autoScrolls[this.layer].vx * speed : 0;

          if (typeof scrollCustomFn === 'function') {
            if (scrollCustomFn.call(Sortable.dragged.parentNode[expando], scrollOffsetX, scrollOffsetY, evt, touchEvt$1, autoScrolls[this.layer].el) !== 'continue') {
              return;
            }
          }

          scrollBy(autoScrolls[this.layer].el, scrollOffsetX, scrollOffsetY);
        }.bind({
          layer: layersOut
        }), 24);
      }
    }

    layersOut++;
  } while (options.bubbleScroll && currentParent !== winScroller && (currentParent = getParentAutoScrollElement(currentParent, false)));

  scrolling = scrollThisInstance; // in case another function catches scrolling as false in between when it is not
}, 30);

var drop = function drop(_ref) {
  var originalEvent = _ref.originalEvent,
      putSortable = _ref.putSortable,
      dragEl = _ref.dragEl,
      activeSortable = _ref.activeSortable,
      dispatchSortableEvent = _ref.dispatchSortableEvent,
      hideGhostForTarget = _ref.hideGhostForTarget,
      unhideGhostForTarget = _ref.unhideGhostForTarget;
  if (!originalEvent) return;
  var toSortable = putSortable || activeSortable;
  hideGhostForTarget();
  var touch = originalEvent.changedTouches && originalEvent.changedTouches.length ? originalEvent.changedTouches[0] : originalEvent;
  var target = document.elementFromPoint(touch.clientX, touch.clientY);
  unhideGhostForTarget();

  if (toSortable && !toSortable.el.contains(target)) {
    dispatchSortableEvent('spill');
    this.onSpill({
      dragEl: dragEl,
      putSortable: putSortable
    });
  }
};

function Revert() {}

Revert.prototype = {
  startIndex: null,
  dragStart: function dragStart(_ref2) {
    var oldDraggableIndex = _ref2.oldDraggableIndex;
    this.startIndex = oldDraggableIndex;
  },
  onSpill: function onSpill(_ref3) {
    var dragEl = _ref3.dragEl,
        putSortable = _ref3.putSortable;
    this.sortable.captureAnimationState();

    if (putSortable) {
      putSortable.captureAnimationState();
    }

    var nextSibling = getChild(this.sortable.el, this.startIndex, this.options);

    if (nextSibling) {
      this.sortable.el.insertBefore(dragEl, nextSibling);
    } else {
      this.sortable.el.appendChild(dragEl);
    }

    this.sortable.animateAll();

    if (putSortable) {
      putSortable.animateAll();
    }
  },
  drop: drop
};

_extends(Revert, {
  pluginName: 'revertOnSpill'
});

function Remove() {}

Remove.prototype = {
  onSpill: function onSpill(_ref4) {
    var dragEl = _ref4.dragEl,
        putSortable = _ref4.putSortable;
    var parentSortable = putSortable || this.sortable;
    parentSortable.captureAnimationState();
    dragEl.parentNode && dragEl.parentNode.removeChild(dragEl);
    parentSortable.animateAll();
  },
  drop: drop
};

_extends(Remove, {
  pluginName: 'removeOnSpill'
});

var lastSwapEl;

function SwapPlugin() {
  function Swap() {
    this.defaults = {
      swapClass: 'sortable-swap-highlight'
    };
  }

  Swap.prototype = {
    dragStart: function dragStart(_ref) {
      var dragEl = _ref.dragEl;
      lastSwapEl = dragEl;
    },
    dragOverValid: function dragOverValid(_ref2) {
      var completed = _ref2.completed,
          target = _ref2.target,
          onMove = _ref2.onMove,
          activeSortable = _ref2.activeSortable,
          changed = _ref2.changed,
          cancel = _ref2.cancel;
      if (!activeSortable.options.swap) return;
      var el = this.sortable.el,
          options = this.options;

      if (target && target !== el) {
        var prevSwapEl = lastSwapEl;

        if (onMove(target) !== false) {
          toggleClass(target, options.swapClass, true);
          lastSwapEl = target;
        } else {
          lastSwapEl = null;
        }

        if (prevSwapEl && prevSwapEl !== lastSwapEl) {
          toggleClass(prevSwapEl, options.swapClass, false);
        }
      }

      changed();
      completed(true);
      cancel();
    },
    drop: function drop(_ref3) {
      var activeSortable = _ref3.activeSortable,
          putSortable = _ref3.putSortable,
          dragEl = _ref3.dragEl;
      var toSortable = putSortable || this.sortable;
      var options = this.options;
      lastSwapEl && toggleClass(lastSwapEl, options.swapClass, false);

      if (lastSwapEl && (options.swap || putSortable && putSortable.options.swap)) {
        if (dragEl !== lastSwapEl) {
          toSortable.captureAnimationState();
          if (toSortable !== activeSortable) activeSortable.captureAnimationState();
          swapNodes(dragEl, lastSwapEl);
          toSortable.animateAll();
          if (toSortable !== activeSortable) activeSortable.animateAll();
        }
      }
    },
    nulling: function nulling() {
      lastSwapEl = null;
    }
  };
  return _extends(Swap, {
    pluginName: 'swap',
    eventProperties: function eventProperties() {
      return {
        swapItem: lastSwapEl
      };
    }
  });
}

function swapNodes(n1, n2) {
  var p1 = n1.parentNode,
      p2 = n2.parentNode,
      i1,
      i2;
  if (!p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1)) return;
  i1 = index(n1);
  i2 = index(n2);

  if (p1.isEqualNode(p2) && i1 < i2) {
    i2++;
  }

  p1.insertBefore(n2, p1.children[i1]);
  p2.insertBefore(n1, p2.children[i2]);
}

var multiDragElements = [],
    multiDragClones = [],
    lastMultiDragSelect,
    // for selection with modifier key down (SHIFT)
multiDragSortable,
    initialFolding = false,
    // Initial multi-drag fold when drag started
folding = false,
    // Folding any other time
dragStarted = false,
    dragEl$1,
    clonesFromRect,
    clonesHidden;

function MultiDragPlugin() {
  function MultiDrag(sortable) {
    // Bind all private methods
    for (var fn in this) {
      if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
        this[fn] = this[fn].bind(this);
      }
    }

    if (!sortable.options.avoidImplicitDeselect) {
      if (sortable.options.supportPointer) {
        on(document, 'pointerup', this._deselectMultiDrag);
      } else {
        on(document, 'mouseup', this._deselectMultiDrag);
        on(document, 'touchend', this._deselectMultiDrag);
      }
    }

    on(document, 'keydown', this._checkKeyDown);
    on(document, 'keyup', this._checkKeyUp);
    this.defaults = {
      selectedClass: 'sortable-selected',
      multiDragKey: null,
      avoidImplicitDeselect: false,
      setData: function setData(dataTransfer, dragEl) {
        var data = '';

        if (multiDragElements.length && multiDragSortable === sortable) {
          multiDragElements.forEach(function (multiDragElement, i) {
            data += (!i ? '' : ', ') + multiDragElement.textContent;
          });
        } else {
          data = dragEl.textContent;
        }

        dataTransfer.setData('Text', data);
      }
    };
  }

  MultiDrag.prototype = {
    multiDragKeyDown: false,
    isMultiDrag: false,
    delayStartGlobal: function delayStartGlobal(_ref) {
      var dragged = _ref.dragEl;
      dragEl$1 = dragged;
    },
    delayEnded: function delayEnded() {
      this.isMultiDrag = ~multiDragElements.indexOf(dragEl$1);
    },
    setupClone: function setupClone(_ref2) {
      var sortable = _ref2.sortable,
          cancel = _ref2.cancel;
      if (!this.isMultiDrag) return;

      for (var i = 0; i < multiDragElements.length; i++) {
        multiDragClones.push(clone(multiDragElements[i]));
        multiDragClones[i].sortableIndex = multiDragElements[i].sortableIndex;
        multiDragClones[i].draggable = false;
        multiDragClones[i].style['will-change'] = '';
        toggleClass(multiDragClones[i], this.options.selectedClass, false);
        multiDragElements[i] === dragEl$1 && toggleClass(multiDragClones[i], this.options.chosenClass, false);
      }

      sortable._hideClone();

      cancel();
    },
    clone: function clone(_ref3) {
      var sortable = _ref3.sortable,
          rootEl = _ref3.rootEl,
          dispatchSortableEvent = _ref3.dispatchSortableEvent,
          cancel = _ref3.cancel;
      if (!this.isMultiDrag) return;

      if (!this.options.removeCloneOnHide) {
        if (multiDragElements.length && multiDragSortable === sortable) {
          insertMultiDragClones(true, rootEl);
          dispatchSortableEvent('clone');
          cancel();
        }
      }
    },
    showClone: function showClone(_ref4) {
      var cloneNowShown = _ref4.cloneNowShown,
          rootEl = _ref4.rootEl,
          cancel = _ref4.cancel;
      if (!this.isMultiDrag) return;
      insertMultiDragClones(false, rootEl);
      multiDragClones.forEach(function (clone) {
        css(clone, 'display', '');
      });
      cloneNowShown();
      clonesHidden = false;
      cancel();
    },
    hideClone: function hideClone(_ref5) {
      var _this = this;

      var sortable = _ref5.sortable,
          cloneNowHidden = _ref5.cloneNowHidden,
          cancel = _ref5.cancel;
      if (!this.isMultiDrag) return;
      multiDragClones.forEach(function (clone) {
        css(clone, 'display', 'none');

        if (_this.options.removeCloneOnHide && clone.parentNode) {
          clone.parentNode.removeChild(clone);
        }
      });
      cloneNowHidden();
      clonesHidden = true;
      cancel();
    },
    dragStartGlobal: function dragStartGlobal(_ref6) {
      var sortable = _ref6.sortable;

      if (!this.isMultiDrag && multiDragSortable) {
        multiDragSortable.multiDrag._deselectMultiDrag();
      }

      multiDragElements.forEach(function (multiDragElement) {
        multiDragElement.sortableIndex = index(multiDragElement);
      }); // Sort multi-drag elements

      multiDragElements = multiDragElements.sort(function (a, b) {
        return a.sortableIndex - b.sortableIndex;
      });
      dragStarted = true;
    },
    dragStarted: function dragStarted(_ref7) {
      var _this2 = this;

      var sortable = _ref7.sortable;
      if (!this.isMultiDrag) return;

      if (this.options.sort) {
        // Capture rects,
        // hide multi drag elements (by positioning them absolute),
        // set multi drag elements rects to dragRect,
        // show multi drag elements,
        // animate to rects,
        // unset rects & remove from DOM
        sortable.captureAnimationState();

        if (this.options.animation) {
          multiDragElements.forEach(function (multiDragElement) {
            if (multiDragElement === dragEl$1) return;
            css(multiDragElement, 'position', 'absolute');
          });
          var dragRect = getRect(dragEl$1, false, true, true);
          multiDragElements.forEach(function (multiDragElement) {
            if (multiDragElement === dragEl$1) return;
            setRect(multiDragElement, dragRect);
          });
          folding = true;
          initialFolding = true;
        }
      }

      sortable.animateAll(function () {
        folding = false;
        initialFolding = false;

        if (_this2.options.animation) {
          multiDragElements.forEach(function (multiDragElement) {
            unsetRect(multiDragElement);
          });
        } // Remove all auxiliary multidrag items from el, if sorting enabled


        if (_this2.options.sort) {
          removeMultiDragElements();
        }
      });
    },
    dragOver: function dragOver(_ref8) {
      var target = _ref8.target,
          completed = _ref8.completed,
          cancel = _ref8.cancel;

      if (folding && ~multiDragElements.indexOf(target)) {
        completed(false);
        cancel();
      }
    },
    revert: function revert(_ref9) {
      var fromSortable = _ref9.fromSortable,
          rootEl = _ref9.rootEl,
          sortable = _ref9.sortable,
          dragRect = _ref9.dragRect;

      if (multiDragElements.length > 1) {
        // Setup unfold animation
        multiDragElements.forEach(function (multiDragElement) {
          sortable.addAnimationState({
            target: multiDragElement,
            rect: folding ? getRect(multiDragElement) : dragRect
          });
          unsetRect(multiDragElement);
          multiDragElement.fromRect = dragRect;
          fromSortable.removeAnimationState(multiDragElement);
        });
        folding = false;
        insertMultiDragElements(!this.options.removeCloneOnHide, rootEl);
      }
    },
    dragOverCompleted: function dragOverCompleted(_ref10) {
      var sortable = _ref10.sortable,
          isOwner = _ref10.isOwner,
          insertion = _ref10.insertion,
          activeSortable = _ref10.activeSortable,
          parentEl = _ref10.parentEl,
          putSortable = _ref10.putSortable;
      var options = this.options;

      if (insertion) {
        // Clones must be hidden before folding animation to capture dragRectAbsolute properly
        if (isOwner) {
          activeSortable._hideClone();
        }

        initialFolding = false; // If leaving sort:false root, or already folding - Fold to new location

        if (options.animation && multiDragElements.length > 1 && (folding || !isOwner && !activeSortable.options.sort && !putSortable)) {
          // Fold: Set all multi drag elements's rects to dragEl's rect when multi-drag elements are invisible
          var dragRectAbsolute = getRect(dragEl$1, false, true, true);
          multiDragElements.forEach(function (multiDragElement) {
            if (multiDragElement === dragEl$1) return;
            setRect(multiDragElement, dragRectAbsolute); // Move element(s) to end of parentEl so that it does not interfere with multi-drag clones insertion if they are inserted
            // while folding, and so that we can capture them again because old sortable will no longer be fromSortable

            parentEl.appendChild(multiDragElement);
          });
          folding = true;
        } // Clones must be shown (and check to remove multi drags) after folding when interfering multiDragElements are moved out


        if (!isOwner) {
          // Only remove if not folding (folding will remove them anyways)
          if (!folding) {
            removeMultiDragElements();
          }

          if (multiDragElements.length > 1) {
            var clonesHiddenBefore = clonesHidden;

            activeSortable._showClone(sortable); // Unfold animation for clones if showing from hidden


            if (activeSortable.options.animation && !clonesHidden && clonesHiddenBefore) {
              multiDragClones.forEach(function (clone) {
                activeSortable.addAnimationState({
                  target: clone,
                  rect: clonesFromRect
                });
                clone.fromRect = clonesFromRect;
                clone.thisAnimationDuration = null;
              });
            }
          } else {
            activeSortable._showClone(sortable);
          }
        }
      }
    },
    dragOverAnimationCapture: function dragOverAnimationCapture(_ref11) {
      var dragRect = _ref11.dragRect,
          isOwner = _ref11.isOwner,
          activeSortable = _ref11.activeSortable;
      multiDragElements.forEach(function (multiDragElement) {
        multiDragElement.thisAnimationDuration = null;
      });

      if (activeSortable.options.animation && !isOwner && activeSortable.multiDrag.isMultiDrag) {
        clonesFromRect = _extends({}, dragRect);
        var dragMatrix = matrix(dragEl$1, true);
        clonesFromRect.top -= dragMatrix.f;
        clonesFromRect.left -= dragMatrix.e;
      }
    },
    dragOverAnimationComplete: function dragOverAnimationComplete() {
      if (folding) {
        folding = false;
        removeMultiDragElements();
      }
    },
    drop: function drop(_ref12) {
      var evt = _ref12.originalEvent,
          rootEl = _ref12.rootEl,
          parentEl = _ref12.parentEl,
          sortable = _ref12.sortable,
          dispatchSortableEvent = _ref12.dispatchSortableEvent,
          oldIndex = _ref12.oldIndex,
          putSortable = _ref12.putSortable;
      var toSortable = putSortable || this.sortable;
      if (!evt) return;
      var options = this.options,
          children = parentEl.children; // Multi-drag selection

      if (!dragStarted) {
        if (options.multiDragKey && !this.multiDragKeyDown) {
          this._deselectMultiDrag();
        }

        toggleClass(dragEl$1, options.selectedClass, !~multiDragElements.indexOf(dragEl$1));

        if (!~multiDragElements.indexOf(dragEl$1)) {
          multiDragElements.push(dragEl$1);
          dispatchEvent({
            sortable: sortable,
            rootEl: rootEl,
            name: 'select',
            targetEl: dragEl$1,
            originalEvent: evt
          }); // Modifier activated, select from last to dragEl

          if (evt.shiftKey && lastMultiDragSelect && sortable.el.contains(lastMultiDragSelect)) {
            var lastIndex = index(lastMultiDragSelect),
                currentIndex = index(dragEl$1);

            if (~lastIndex && ~currentIndex && lastIndex !== currentIndex) {
              // Must include lastMultiDragSelect (select it), in case modified selection from no selection
              // (but previous selection existed)
              var n, i;

              if (currentIndex > lastIndex) {
                i = lastIndex;
                n = currentIndex;
              } else {
                i = currentIndex;
                n = lastIndex + 1;
              }

              for (; i < n; i++) {
                if (~multiDragElements.indexOf(children[i])) continue;
                toggleClass(children[i], options.selectedClass, true);
                multiDragElements.push(children[i]);
                dispatchEvent({
                  sortable: sortable,
                  rootEl: rootEl,
                  name: 'select',
                  targetEl: children[i],
                  originalEvent: evt
                });
              }
            }
          } else {
            lastMultiDragSelect = dragEl$1;
          }

          multiDragSortable = toSortable;
        } else {
          multiDragElements.splice(multiDragElements.indexOf(dragEl$1), 1);
          lastMultiDragSelect = null;
          dispatchEvent({
            sortable: sortable,
            rootEl: rootEl,
            name: 'deselect',
            targetEl: dragEl$1,
            originalEvent: evt
          });
        }
      } // Multi-drag drop


      if (dragStarted && this.isMultiDrag) {
        folding = false; // Do not "unfold" after around dragEl if reverted

        if ((parentEl[expando].options.sort || parentEl !== rootEl) && multiDragElements.length > 1) {
          var dragRect = getRect(dragEl$1),
              multiDragIndex = index(dragEl$1, ':not(.' + this.options.selectedClass + ')');
          if (!initialFolding && options.animation) dragEl$1.thisAnimationDuration = null;
          toSortable.captureAnimationState();

          if (!initialFolding) {
            if (options.animation) {
              dragEl$1.fromRect = dragRect;
              multiDragElements.forEach(function (multiDragElement) {
                multiDragElement.thisAnimationDuration = null;

                if (multiDragElement !== dragEl$1) {
                  var rect = folding ? getRect(multiDragElement) : dragRect;
                  multiDragElement.fromRect = rect; // Prepare unfold animation

                  toSortable.addAnimationState({
                    target: multiDragElement,
                    rect: rect
                  });
                }
              });
            } // Multi drag elements are not necessarily removed from the DOM on drop, so to reinsert
            // properly they must all be removed


            removeMultiDragElements();
            multiDragElements.forEach(function (multiDragElement) {
              if (children[multiDragIndex]) {
                parentEl.insertBefore(multiDragElement, children[multiDragIndex]);
              } else {
                parentEl.appendChild(multiDragElement);
              }

              multiDragIndex++;
            }); // If initial folding is done, the elements may have changed position because they are now
            // unfolding around dragEl, even though dragEl may not have his index changed, so update event
            // must be fired here as Sortable will not.

            if (oldIndex === index(dragEl$1)) {
              var update = false;
              multiDragElements.forEach(function (multiDragElement) {
                if (multiDragElement.sortableIndex !== index(multiDragElement)) {
                  update = true;
                  return;
                }
              });

              if (update) {
                dispatchSortableEvent('update');
              }
            }
          } // Must be done after capturing individual rects (scroll bar)


          multiDragElements.forEach(function (multiDragElement) {
            unsetRect(multiDragElement);
          });
          toSortable.animateAll();
        }

        multiDragSortable = toSortable;
      } // Remove clones if necessary


      if (rootEl === parentEl || putSortable && putSortable.lastPutMode !== 'clone') {
        multiDragClones.forEach(function (clone) {
          clone.parentNode && clone.parentNode.removeChild(clone);
        });
      }
    },
    nullingGlobal: function nullingGlobal() {
      this.isMultiDrag = dragStarted = false;
      multiDragClones.length = 0;
    },
    destroyGlobal: function destroyGlobal() {
      this._deselectMultiDrag();

      off(document, 'pointerup', this._deselectMultiDrag);
      off(document, 'mouseup', this._deselectMultiDrag);
      off(document, 'touchend', this._deselectMultiDrag);
      off(document, 'keydown', this._checkKeyDown);
      off(document, 'keyup', this._checkKeyUp);
    },
    _deselectMultiDrag: function _deselectMultiDrag(evt) {
      if (typeof dragStarted !== "undefined" && dragStarted) return; // Only deselect if selection is in this sortable

      if (multiDragSortable !== this.sortable) return; // Only deselect if target is not item in this sortable

      if (evt && closest(evt.target, this.options.draggable, this.sortable.el, false)) return; // Only deselect if left click

      if (evt && evt.button !== 0) return;

      while (multiDragElements.length) {
        var el = multiDragElements[0];
        toggleClass(el, this.options.selectedClass, false);
        multiDragElements.shift();
        dispatchEvent({
          sortable: this.sortable,
          rootEl: this.sortable.el,
          name: 'deselect',
          targetEl: el,
          originalEvent: evt
        });
      }
    },
    _checkKeyDown: function _checkKeyDown(evt) {
      if (evt.key === this.options.multiDragKey) {
        this.multiDragKeyDown = true;
      }
    },
    _checkKeyUp: function _checkKeyUp(evt) {
      if (evt.key === this.options.multiDragKey) {
        this.multiDragKeyDown = false;
      }
    }
  };
  return _extends(MultiDrag, {
    // Static methods & properties
    pluginName: 'multiDrag',
    utils: {
      /**
       * Selects the provided multi-drag item
       * @param  {HTMLElement} el    The element to be selected
       */
      select: function select(el) {
        var sortable = el.parentNode[expando];
        if (!sortable || !sortable.options.multiDrag || ~multiDragElements.indexOf(el)) return;

        if (multiDragSortable && multiDragSortable !== sortable) {
          multiDragSortable.multiDrag._deselectMultiDrag();

          multiDragSortable = sortable;
        }

        toggleClass(el, sortable.options.selectedClass, true);
        multiDragElements.push(el);
      },

      /**
       * Deselects the provided multi-drag item
       * @param  {HTMLElement} el    The element to be deselected
       */
      deselect: function deselect(el) {
        var sortable = el.parentNode[expando],
            index = multiDragElements.indexOf(el);
        if (!sortable || !sortable.options.multiDrag || !~index) return;
        toggleClass(el, sortable.options.selectedClass, false);
        multiDragElements.splice(index, 1);
      }
    },
    eventProperties: function eventProperties() {
      var _this3 = this;

      var oldIndicies = [],
          newIndicies = [];
      multiDragElements.forEach(function (multiDragElement) {
        oldIndicies.push({
          multiDragElement: multiDragElement,
          index: multiDragElement.sortableIndex
        }); // multiDragElements will already be sorted if folding

        var newIndex;

        if (folding && multiDragElement !== dragEl$1) {
          newIndex = -1;
        } else if (folding) {
          newIndex = index(multiDragElement, ':not(.' + _this3.options.selectedClass + ')');
        } else {
          newIndex = index(multiDragElement);
        }

        newIndicies.push({
          multiDragElement: multiDragElement,
          index: newIndex
        });
      });
      return {
        items: _toConsumableArray(multiDragElements),
        clones: [].concat(multiDragClones),
        oldIndicies: oldIndicies,
        newIndicies: newIndicies
      };
    },
    optionListeners: {
      multiDragKey: function multiDragKey(key) {
        key = key.toLowerCase();

        if (key === 'ctrl') {
          key = 'Control';
        } else if (key.length > 1) {
          key = key.charAt(0).toUpperCase() + key.substr(1);
        }

        return key;
      }
    }
  });
}

function insertMultiDragElements(clonesInserted, rootEl) {
  multiDragElements.forEach(function (multiDragElement, i) {
    var target = rootEl.children[multiDragElement.sortableIndex + (clonesInserted ? Number(i) : 0)];

    if (target) {
      rootEl.insertBefore(multiDragElement, target);
    } else {
      rootEl.appendChild(multiDragElement);
    }
  });
}
/**
 * Insert multi-drag clones
 * @param  {[Boolean]} elementsInserted  Whether the multi-drag elements are inserted
 * @param  {HTMLElement} rootEl
 */


function insertMultiDragClones(elementsInserted, rootEl) {
  multiDragClones.forEach(function (clone, i) {
    var target = rootEl.children[clone.sortableIndex + (elementsInserted ? Number(i) : 0)];

    if (target) {
      rootEl.insertBefore(clone, target);
    } else {
      rootEl.appendChild(clone);
    }
  });
}

function removeMultiDragElements() {
  multiDragElements.forEach(function (multiDragElement) {
    if (multiDragElement === dragEl$1) return;
    multiDragElement.parentNode && multiDragElement.parentNode.removeChild(multiDragElement);
  });
}

Sortable.mount(new AutoScrollPlugin());
Sortable.mount(Remove, Revert);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Sortable);



/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _arrayLikeToArray)
/* harmony export */ });
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _arrayWithoutHoles)
/* harmony export */ });
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(arr);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/iterableToArray.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/iterableToArray.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _iterableToArray)
/* harmony export */ });
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _nonIterableSpread)
/* harmony export */ });
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _toConsumableArray)
/* harmony export */ });
/* harmony import */ var _arrayWithoutHoles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayWithoutHoles.js */ "./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js");
/* harmony import */ var _iterableToArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/iterableToArray.js");
/* harmony import */ var _unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./unsupportedIterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js");
/* harmony import */ var _nonIterableSpread_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nonIterableSpread.js */ "./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js");




function _toConsumableArray(arr) {
  return (0,_arrayWithoutHoles_js__WEBPACK_IMPORTED_MODULE_0__["default"])(arr) || (0,_iterableToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(arr) || (0,_unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(arr) || (0,_nonIterableSpread_js__WEBPACK_IMPORTED_MODULE_3__["default"])();
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/typeof.js":
/*!***********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/typeof.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _typeof)
/* harmony export */ });
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _unsupportedIterableToArray)
/* harmony export */ });
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
}

/***/ }),

/***/ "./node_modules/array-move/index.js":
/*!******************************************!*\
  !*** ./node_modules/array-move/index.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "arrayMoveImmutable": () => (/* binding */ arrayMoveImmutable),
/* harmony export */   "arrayMoveMutable": () => (/* binding */ arrayMoveMutable)
/* harmony export */ });
function arrayMoveMutable(array, fromIndex, toIndex) {
	const startIndex = fromIndex < 0 ? array.length + fromIndex : fromIndex;

	if (startIndex >= 0 && startIndex < array.length) {
		const endIndex = toIndex < 0 ? array.length + toIndex : toIndex;

		const [item] = array.splice(fromIndex, 1);
		array.splice(endIndex, 0, item);
	}
}

function arrayMoveImmutable(array, fromIndex, toIndex) {
	array = [...array];
	arrayMoveMutable(array, fromIndex, toIndex);
	return array;
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/amd options */
/******/ 	(() => {
/******/ 		__webpack_require__.amdO = {};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***********************!*\
  !*** ./src/js/w3g.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var sortablejs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sortablejs */ "./node_modules/sortablejs/modular/sortable.esm.js");
/* harmony import */ var array_move__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! array-move */ "./node_modules/array-move/index.js");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./consts */ "./src/js/consts.js");
/* harmony import */ var _crops__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./crops */ "./src/js/crops.js");
/* harmony import */ var _misc__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./misc */ "./src/js/misc.js");
/* harmony import */ var _farm_events__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./farm-events */ "./src/js/farm-events.js");
/* harmony import */ var _farm_helpers__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./farm-helpers */ "./src/js/farm-helpers.js");

// import {w3gFarms} from './w3gFarms';







var localStoreCheck = JSON.parse(localStorage.getItem(_consts__WEBPACK_IMPORTED_MODULE_3__.w3gFarmKey));

if (localStoreCheck == null || localStoreCheck.length == 0) {
  localStorage.setItem(_consts__WEBPACK_IMPORTED_MODULE_3__.w3gFarmKey, JSON.stringify(w3gFarms));
} // is in dev mode to print console logs


var dev = false;
var storedFarms = JSON.parse(localStorage.getItem(_consts__WEBPACK_IMPORTED_MODULE_3__.w3gFarmKey));
var FARMS = [];
var FARMStoUpdate = []; //coming from w3gFarmsScript.twig

if (forceUpdate) {
  storedFarms.forEach(function (farm, i) {
    var exist = false;
    w3gFarms.forEach(function (w3gFarm) {
      if (farm.number == w3gFarm.number) {
        exist = true;
        return;
      }
    });

    if (!exist) {
      w3gFarms.splice(i, 0, farm);
    }
  });
  storedFarms = w3gFarms;
  localStorage.setItem(_consts__WEBPACK_IMPORTED_MODULE_3__.w3gFarmKey, JSON.stringify(storedFarms));
  (0,_misc__WEBPACK_IMPORTED_MODULE_5__.showError)('New W3G farms were added', 2);
} // ************************************** //
//             GENERATE FARMS             //
// ************************************** //
// generate farms if there are farms saved


if (storedFarms != null) {
  FARMS = storedFarms;

  if (dev) {
    console.log('farms on load: ', FARMS);
  }

  FARMS.forEach(function (farm) {
    //build old farms with new structure
    if (farm.crop.sproutTimeSeconds == undefined) {
      _crops__WEBPACK_IMPORTED_MODULE_4__["default"].forEach(function (crop) {
        if (crop.id == farm.crop.id) farm.crop.sproutTimeSeconds = crop.sproutTimeSeconds;
      });
    }

    if (farm.info == undefined) {
      farm.info = {};
    }

    _consts__WEBPACK_IMPORTED_MODULE_3__.farmListDom.appendChild((0,_farm_helpers__WEBPACK_IMPORTED_MODULE_7__.createFarmNode)(farm));

    if (farm.startTime != undefined && farm.startTime != null) {
      // console.log('continuing farm timer')
      (0,_farm_helpers__WEBPACK_IMPORTED_MODULE_7__.continueFarmTimer)(farm);
    }
  }); //update far counters after creating farm nodes

  (0,_misc__WEBPACK_IMPORTED_MODULE_5__.updateFarmCount)(FARMS);

  if (FARMS.length > 1) {
    _consts__WEBPACK_IMPORTED_MODULE_3__.selectAllFarmsDom.disabled = false;
  }
} // ************************************** //
//                SORTABLE                //
// ************************************** //


var sortable = new sortablejs__WEBPACK_IMPORTED_MODULE_1__["default"](_consts__WEBPACK_IMPORTED_MODULE_3__.farmListDom, {
  animation: 150,
  ghostClass: 'ghost',
  onEnd: function onEnd(e) {
    (0,array_move__WEBPACK_IMPORTED_MODULE_2__.arrayMoveMutable)(FARMS, e.oldIndex, e.newIndex);
    localStorage.setItem(_consts__WEBPACK_IMPORTED_MODULE_3__.w3gFarmKey, JSON.stringify(FARMS));

    if (dev) {
      console.log('farms after move: ', FARMS);
    }
  }
}); // ************************************** //
//             ADD FARM FORM             //
// ************************************** //

var addForm = document.getElementById('add-farm');
addForm.addEventListener('submit', function (e) {
  e.preventDefault();
  var formData = new FormData(e.target);
  var formProps = Object.fromEntries(formData);
  var formColorImput = e.target.querySelector('input[type=color]');
  e.target.querySelector('.farmNumber').focus(); // console.log(e.target)

  formProps.farmColor = formColorImput.getAttribute('data-color');
  (0,_farm_helpers__WEBPACK_IMPORTED_MODULE_7__.addFarm)(e.target, formProps, FARMS, _consts__WEBPACK_IMPORTED_MODULE_3__.w3gFarmKey, dev);
}); // **************************************  //
//             ADD COLOR                   //
// ************************************** //

document.querySelectorAll('.farm-color-input').forEach(function (el) {
  el.addEventListener('input', function (e) {
    document.querySelectorAll('.colors-grid input[type=radio]').forEach(function (radio) {
      radio.checked = false;
    });
    var input = e.target;
    var indicator = input.parentElement.parentElement.parentElement.querySelector('.color-indicator div');
    input.setAttribute('data-color', e.target.value);
    indicator.style.background = e.target.value;
  });
});
document.querySelectorAll('.colors-grid input[type=radio]').forEach(function (el) {
  el.addEventListener('click', function (e) {
    var value = e.target.value;
    var indicator = e.target.parentElement.parentElement.parentElement.querySelector('.color-indicator div');
    var input = e.target.parentElement.parentElement.querySelector('.farm-color-input');
    indicator.style.background = e.target.value;
    input.setAttribute('data-color', e.target.value);
    input.value = value;
  });
});
document.querySelectorAll('.remove-color').forEach(function (el) {
  el.addEventListener('click', function (e) {
    document.querySelectorAll('.colors-grid input[type=radio]').forEach(function (radio) {
      radio.checked = false;
    });
    var input = e.target.parentElement.parentElement.querySelector('.farm-color-input');
    var indicator = e.target.parentElement.parentElement.querySelector('.color-indicator div');
    input.setAttribute('data-color', '');
    indicator.style.background = '';
  });
}); // ************************************** //
//          FARM EVENT LISTENERS          //
// ************************************** //

_consts__WEBPACK_IMPORTED_MODULE_3__.farmListDom.addEventListener('click', function (e) {
  //start farm
  if (e.target.classList.contains('start-farm')) {
    //start farm from farm-events.js
    (0,_farm_events__WEBPACK_IMPORTED_MODULE_6__.startFarm)(e.target, FARMS, _consts__WEBPACK_IMPORTED_MODULE_3__.w3gFarmKey);
  } else if (e.target.classList.contains('delete-farm')) {
    //delete frm from farm-events.js
    (0,_farm_events__WEBPACK_IMPORTED_MODULE_6__.deleteFarm)(e.target, FARMS, _consts__WEBPACK_IMPORTED_MODULE_3__.w3gFarmKey, dev);
  } else if (e.target.classList.contains('open-farm')) {
    var farmDom = e.target.parentElement.parentElement;
    (0,_farm_helpers__WEBPACK_IMPORTED_MODULE_7__.openFarm)(farmDom.id);
  } else if (e.target.classList.contains('edit-farm')) {
    (0,_farm_events__WEBPACK_IMPORTED_MODULE_6__.editSingleFarmForm)(e.target, FARMS);
  } else if (e.target.classList.contains('select-farm')) {
    (0,_farm_events__WEBPACK_IMPORTED_MODULE_6__.selectFarm)(e.target, FARMStoUpdate, FARMS, dev);
  }
}); // ************************************** //
//               POP UPS                  //
// ************************************** //

var popUps = document.querySelectorAll('.pop-up');
popUps.forEach(function (element) {
  var closePopBtn = element.querySelector('.pop-close');
  var screen = element.querySelector('.screen');
  var container = element.querySelector('.container'); //close button event

  closePopBtn.addEventListener('click', function () {
    (0,_misc__WEBPACK_IMPORTED_MODULE_5__.closePop)(element);
  }); //container propagation

  container.addEventListener('click', function (e) {
    e.stopPropagation();
  });
  screen.addEventListener('click', function (e) {
    (0,_misc__WEBPACK_IMPORTED_MODULE_5__.closePop)(element);
  });
});
var openPopButtons = document.querySelectorAll('.open-pop');
openPopButtons.forEach(function (element) {
  var popUp = document.getElementById(element.getAttribute('data-pop')); // let popUpType = popUp.getAttribute('data-type');

  element.addEventListener('click', function () {
    (0,_misc__WEBPACK_IMPORTED_MODULE_5__.openPop)(popUp);
  });
}); // ************************************** //
//            EDIT FARM FORMS             //
// ************************************** //

document.querySelectorAll('.edit-farms').forEach(function (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var formData = new FormData(e.target);
    var formProps = Object.fromEntries(formData);
    var colorInput = e.target.querySelector('input[type=color]');
    var typeOfEdit = formProps.objtype;

    if (dev) {
      console.log('type of Edit: ', typeOfEdit);
    }

    if (typeOfEdit == 'obj') {
      formProps.farmColor = colorInput.getAttribute('data-color');
      var farmId = formProps.farm;
      var farm = (0,_farm_helpers__WEBPACK_IMPORTED_MODULE_7__.findFarm)(farmId, FARMS).farm;
      (0,_farm_helpers__WEBPACK_IMPORTED_MODULE_7__.updateFarmDom)(farm, formProps, FARMS, _consts__WEBPACK_IMPORTED_MODULE_3__.w3gFarmKey);
      (0,_misc__WEBPACK_IMPORTED_MODULE_5__.closePop)(_consts__WEBPACK_IMPORTED_MODULE_3__.editPopUpDom);
    } else if (typeOfEdit == 'arr') {
      var farmArr = FARMStoUpdate;
      farmArr.forEach(function (farm) {
        (0,_farm_helpers__WEBPACK_IMPORTED_MODULE_7__.updateFarmDom)(farm, formProps, FARMS, _consts__WEBPACK_IMPORTED_MODULE_3__.w3gFarmKey);
      });
      FARMStoUpdate = [];
      var checkBoxes = _consts__WEBPACK_IMPORTED_MODULE_3__.farmListDom.querySelectorAll('.select-farm');
      var selectButton = document.getElementById('select-all-farms');
      (0,_misc__WEBPACK_IMPORTED_MODULE_5__.clearCheckBoxes)(checkBoxes);
      _consts__WEBPACK_IMPORTED_MODULE_3__.selectAllFarmsDom.checked = false;
      (0,_misc__WEBPACK_IMPORTED_MODULE_5__.closePop)(_consts__WEBPACK_IMPORTED_MODULE_3__.massEditPopUpDom);
    }
  });
}); // ************************************** //
//             FILTER FARMS               //
// ************************************** //

_consts__WEBPACK_IMPORTED_MODULE_3__.filterFarmsDom.addEventListener('click', function (e) {
  var button = e.currentTarget;
  var label = button.querySelector('span');
  var filterType = button.getAttribute('data-filter');

  switch (filterType) {
    case 'completed':
      filterFarms(filterType); // console.log('filtering by completed')

      button.setAttribute('data-filter', 'started');
      label.innerHTML = capitalizeFirstLetter(filterType);
      break;

    case 'started':
      filterFarms(filterType); // console.log('filtering by started')

      button.setAttribute('data-filter', 'default');
      label.innerHTML = capitalizeFirstLetter(filterType);
      break;

    default:
      filterFarms('default'); // console.log('filtering by default')

      button.setAttribute('data-filter', 'completed');
      label.innerHTML = capitalizeFirstLetter('default');
      break;
  }
});

function filterFarms(filterBy) {
  console.log(filterBy);

  if (filterBy == 'default') {
    FARMS.forEach(function (farm) {
      var dom = document.getElementById(farm.number);
      dom.classList.remove('hidden');
    });
    return;
  }

  FARMS.forEach(function (farm) {
    var dom = document.getElementById(farm.number);
    console.log(dom.classList.contains(filterBy));

    if (!dom.classList.contains(filterBy)) {
      dom.classList.add('hidden');
    } else {
      dom.classList.remove('hidden');
    }
  });
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
} // ************************************** //
//             MASS DELETING              //
// ************************************** //


document.getElementById('delete-all-farms').addEventListener('click', function (e) {
  var message = "Are you sure you want to delete the selected farms? This can't be undone";

  if (!confirm(message)) {
    return;
  }

  for (var i = 0; i < FARMStoUpdate.length; i++) {
    var farmToDelete = FARMStoUpdate[i].number;
    var farmToDeleteDom = document.getElementById(FARMStoUpdate[i].number);

    for (var f = 0; f < FARMS.length; f++) {
      var farm = FARMS[f];

      if (farm.number == farmToDelete) {
        FARMS.splice(f, 1);
        farmToDeleteDom.remove();
      }
    }
  }

  FARMStoUpdate = [];
  _consts__WEBPACK_IMPORTED_MODULE_3__.selectAllFarmsDom.checked = false;
  document.querySelector('.bulk-actions').style.display = 'none';
  localStorage.setItem(_consts__WEBPACK_IMPORTED_MODULE_3__.w3gFarmKey, JSON.stringify(FARMS));
  (0,_misc__WEBPACK_IMPORTED_MODULE_5__.updateFarmCount)(FARMS);
}); // ************************************** //
//             MASS STARTING              //
// ************************************** //

document.getElementById('start-all-farms').addEventListener('click', function (e) {
  var farmsStarted = 0;
  FARMStoUpdate.forEach(function (farm) {
    var farmDom = document.getElementById(farm.number);

    if (!farmDom.classList.contains('started')) {
      var startButton = farmDom.querySelector('.start-farm');
      startButton.disabled = true;
      farmDom.classList.remove('completed');
      var timerDom = farmDom.querySelector('.timer');
      var timer = new easytimer.Timer(); //saving timer pointer in farm

      farm.timer = timer;
      farm.startTime = new Date().getTime() / 1000;
      var hourFormat = (0,_misc__WEBPACK_IMPORTED_MODULE_5__.secondsToHourFormat)(farm.crop.sproutTimeSeconds); // // timer.start({ countdown: true, startValues: {seconds: 10} });

      timer.start({
        countdown: true,
        startValues: {
          hours: hourFormat[0],
          minutes: hourFormat[1],
          seconds: hourFormat[2]
        }
      });
      timer.addEventListener('secondsUpdated', (0,_misc__WEBPACK_IMPORTED_MODULE_5__.handleTimerStart)(timerDom, timer));
      farmDom.classList.add('started');
      timer.addEventListener('targetAchieved', function (e) {
        startButton.disabled = false;
        farmDom.classList.add('completed');
        farmDom.classList.remove('started');
        (0,_misc__WEBPACK_IMPORTED_MODULE_5__.updateFarmCount)(FARMS);
      });
      (0,_misc__WEBPACK_IMPORTED_MODULE_5__.updateFarmCount)(FARMS);
      (0,_farm_helpers__WEBPACK_IMPORTED_MODULE_7__.openFarm)(farm.number);
    } else {
      farmsStarted += 1;
    }
  });
  var checkBoxes = _consts__WEBPACK_IMPORTED_MODULE_3__.farmListDom.querySelectorAll('.select-farm');
  _consts__WEBPACK_IMPORTED_MODULE_3__.selectAllFarmsDom.checked = false;
  document.querySelector('.bulk-actions').style.display = 'none';
  (0,_misc__WEBPACK_IMPORTED_MODULE_5__.clearCheckBoxes)(checkBoxes);
  localStorage.setItem(_consts__WEBPACK_IMPORTED_MODULE_3__.w3gFarmKey, JSON.stringify(FARMS));

  if (farmsStarted == FARMStoUpdate.length) {
    (0,_misc__WEBPACK_IMPORTED_MODULE_5__.showError)('All timers are currently running', 1);
  }

  console.log(farmsStarted, FARMStoUpdate.length);
  FARMStoUpdate = [];
}); // ************************************** //
//             MASS SELECT                //
// ************************************** //

_consts__WEBPACK_IMPORTED_MODULE_3__.selectAllFarmsDom.addEventListener('change', function (e) {
  var button = e.target;
  var checkBoxes = _consts__WEBPACK_IMPORTED_MODULE_3__.farmListDom.querySelectorAll('.select-farm');

  if (button.checked == false) {
    //deselecting
    FARMStoUpdate = [];
    (0,_misc__WEBPACK_IMPORTED_MODULE_5__.clearCheckBoxes)(checkBoxes);
    document.querySelector('.bulk-actions').style.display = 'none';
  } else {
    //selecting
    FARMStoUpdate = (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(FARMS);
    checkBoxes.forEach(function (element) {
      element.checked = true;
    });

    if (FARMStoUpdate.length > 1) {
      document.querySelector('.bulk-actions').style.display = 'inline-flex';
    }
  }
}); // ************************************** //
//             EXPORT FARMS               //
// ************************************** //

_consts__WEBPACK_IMPORTED_MODULE_3__.exportAllFarms.addEventListener('click', function (e) {
  if (FARMS.length > 0) {
    var farmsToExport = localStorage.getItem(_consts__WEBPACK_IMPORTED_MODULE_3__.w3gFarmKey);
    (0,_misc__WEBPACK_IMPORTED_MODULE_5__.download)('exported-farms', farmsToExport);
  }
}); // ************************************** //
//             MASS IMPORT FARMS          //
// ************************************** //

var importForm = document.getElementById('import-farms');
var importContainer = importForm.querySelector('.file-upload');
var droppedFile;
importForm.addEventListener('dragover', function (e) {
  e.preventDefault();
  importContainer.classList.add('is-dragover');
}, false);
importForm.addEventListener('dragenter', function (e) {
  e.preventDefault();
  importContainer.classList.add('is-dragover');
}, false);
importForm.addEventListener('dragleave', function (e) {
  e.preventDefault();
  importContainer.classList.remove('is-dragover');
}, false);
importForm.addEventListener('dragend', function (e) {
  e.preventDefault();
  importContainer.classList.remove('is-dragover');
}, false);
importForm.addEventListener('drop', function (e) {
  e.preventDefault();
  importContainer.classList.remove('is-dragover');
  droppedFile = e.dataTransfer.files[0]; //check file extension

  var ext = droppedFile.name.split('.')[1];
  console.log(ext);

  if (ext != 'txt') {
    droppedFile = null;
    importForm.querySelector('button').disabled = true;
    importForm.querySelector('p').innerHTML = "<span>Click here to upload </span> or drag and drop <br>txt file";
    (0,_misc__WEBPACK_IMPORTED_MODULE_5__.showError)('Unsuported file extension');
    return;
  }

  console.log('accepted file');
  importForm.querySelector('p').innerHTML = "<span>".concat(droppedFile.name, "</span>");
  importForm.querySelector('button').disabled = false;
}, false);
document.getElementById('file').addEventListener('change', function () {
  var ext = this.files[0].name.split('.')[1]; //check file extension

  if (ext != 'txt') {
    importForm.querySelector('button').disabled = true;
    importForm.querySelector('p').innerHTML = "<span>Click here to upload </span> or drag and drop <br>txt file";
    (0,_misc__WEBPACK_IMPORTED_MODULE_5__.showError)('Unsuported file extension');
    return;
  }

  console.log('accepted file');
  importForm.querySelector('p').innerHTML = "<span>".concat(droppedFile.name, "</span>");
  importForm.querySelector('button').disabled = false;
  var fr = new FileReader();
  fr.readAsText(this.files[0]);

  fr.onload = function () {
    console.log(fr.result);
  };
}); // var examplePlaceholder = '[{"number":"3084","crop":{"id":2,"name":"Scarrot","sproutTime":{"hours":5,"minutes":20,"seconds":0}},"timer":null,"startTime":null},{"number":"3223","crop":{"id":2,"name":"Scarrot","sproutTime":{"hours":5,"minutes":20,"seconds":0}},"timer":null,"startTime":null}';
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

importForm.addEventListener('submit', function (e) {
  e.preventDefault();
  var formData = new FormData(e.target);
  var formProps = Object.fromEntries(formData);
  var fr = new FileReader();
  fr.readAsText(droppedFile != undefined || droppedFile != null ? droppedFile : formProps.file);

  fr.onload = function () {
    // importForm.querySelector('p').innerHTML = `<span>Click here to upload </span> or drag and drop <br>txt file`;
    // importForm.querySelector('button').disabled = false;
    (0,_misc__WEBPACK_IMPORTED_MODULE_5__.importClean)(fr.result, FARMS, _consts__WEBPACK_IMPORTED_MODULE_3__.w3gFarmKey);
  };
}); // ************************************** //
//             RESET FARMS                //
// ************************************** //
// document.getElementById('reset').addEventListener('click', function (e) {
//     if (FARMS.length > 0) {
//         FARMS.forEach(farm => {
//             farm.startTime = null;
//             farm.timer = null;
//         })
//         localStorage.setItem(mainFarmKey, JSON.stringify(FARMS));
//         window.location.reload();
//     }
// })
// ************************************** //
//              ACCOIRDIONS               //
// ************************************** //

var aboutPop = document.getElementById('about-pop-up');
var categoriesBtn = document.querySelectorAll('#about-pop-up .categories button');
var categoriesContainers = document.querySelectorAll('#about-pop-up .categories-content >div');
categoriesBtn.forEach(function (button) {
  button.addEventListener('click', function (e) {
    e.preventDefault();
    categoriesBtn.forEach(function (btn) {
      btn.classList.remove('active');
    });
    categoriesContainers.forEach(function (el) {
      el.classList.remove('active');
    });
    var container = document.getElementById(button.getAttribute('data-cat'));
    e.target.classList.add('active');
    container.classList.add('active');
  });
});
var accordionItems = document.querySelectorAll('#about-pop-up .acordion-item');
accordionItems.forEach(function (item) {
  item.addEventListener('click', function (e) {
    e.stopPropagation();
    var current = e.currentTarget;
    accordionItems.forEach(function (el) {
      if (el == current) {
        if (current.classList.contains('open')) {
          current.classList.remove('open');
        } else {
          current.classList.add('open');
        }
      } else {
        el.classList.remove('open');
      }
    });
  });
});
})();

/******/ })()
;
//# sourceMappingURL=w3g.js.map