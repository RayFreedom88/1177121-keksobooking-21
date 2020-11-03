/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
(() => {
/*!********************************!*\
  !*** ./js/modules/defaults.js ***!
  \********************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


let defaults = {
  MAX_COUNT: 5,

  MIN_WIDTH_PINS: 50,
  MIN_HEIGHT_PINS: 70,

  MIN_LOCATION_X: 0,
  MAX_LOCATION_X: document.querySelector(`.map`).offsetWidth,

  MIN_LOCATION_Y: 130,
  MAX_LOCATION_Y: 630,

  COORDS_X: 630,
  COORDS_Y: 375,

  types: {
    palace: {
      ru: `Дворец`,
      min: `10000`
    },
    flat: {
      ru: `Квартира`,
      min: `1000`
    },
    house: {
      ru: `Дом`,
      min: `5000`
    },
    bungalow: {
      ru: `Бунгало `,
      min: `0`
    }
  }
};

window.defaults = defaults;

})();

(() => {
/*!****************************!*\
  !*** ./js/modules/util.js ***!
  \****************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


let Key = {
  LEFT_MOUSE: 0,
  ENTER: 13,
  ESC: 27
};

let isEnterEvent = function (evt, actionFn) {
  if (evt.keyCode === Key.ENTER) {
    actionFn();
  }
};

let isEscEvent = function (evt, actionFn) {
  if (evt.keyCode === Key.ESC) {
    evt.preventDefault();
    actionFn();
  }
};

window.util = {
  key: Key,
  isEnterEvent: isEnterEvent,
  isEscEvent: isEscEvent
};


})();

(() => {
/*!****************************!*\
  !*** ./js/modules/main.js ***!
  \****************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const MAX_COUNT = window.defaults.MAX_COUNT;

const COORDS_X = window.defaults.COORDS_X;
const COORDS_Y = window.defaults.COORDS_Y;

let mapElement = document.querySelector(`.map`);

let mapPinMainElement = document.querySelector(`.map__pin--main`);
let mapFiltersContainer = mapElement.querySelector(`.map__filters-container`);
let mapFiltersElements = document.querySelectorAll(`.map__filter`);

let adFormElement = document.querySelector(`.ad-form`);
let adFormFieldsetElements = adFormElement.querySelectorAll(`fieldset`);
let pinAddressInputElement = adFormElement.querySelector(`#address`);

let offers = [];

const getMapElement = () => mapElement;
const getMapPinMainElement = () => mapPinMainElement;
const getMapFiltersContainer = () => mapFiltersContainer;
const getAdFormElement = () => adFormElement;
const getPinAddressInputElement = () => pinAddressInputElement;

/* функция отрисовки пинов */

let createPins = function (bookings) {
  let fragment = document.createDocumentFragment();
  let mapPinsElement = window.pin.mapPinsElement;

  bookings.forEach(function (booking) {
    fragment.appendChild(window.pin.getPin(booking));
  });

  mapPinsElement.appendChild(fragment);
};

/* блокировка форм */

let setFormDisabled = function (items) {
  for (let i = 0; i < items.length; i++) {
    items[i].disabled = true;
  }
};

setFormDisabled(adFormFieldsetElements);
setFormDisabled(mapFiltersElements);

/* активация страницы + вызов отрисовки пинов и карточек */

let setFormActive = function (items) {
  for (let i = 0; i < items.length; i++) {
    items[i].disabled = false;
  }
};

let setAddressCoords = function (coordsX, coordsY) {
  pinAddressInputElement.value = coordsX + `,` + coordsY;
};

setAddressCoords(COORDS_X, COORDS_Y);

let onSuccess = function (data) {
  offers = data.slice().filter(function (item) {
    return Object.keys(item.offer).length !== 0;
  });

  createPins(offers.slice(0, MAX_COUNT));

  mapPinMainElement.removeEventListener(`mousedown`, onMainPinMouseDown);
  mapPinMainElement.removeEventListener(`keydown`, onMainPinKeyDown);
};

let onError = function (message) {
  window.message.onErrorSend(message);
};

let getActivePage = function () {
  setFormActive(adFormFieldsetElements);
  setFormActive(mapFiltersElements);
  mapElement.classList.remove(`map--faded`);
  adFormElement.classList.remove(`ad-form--disabled`);
  window.backend.load(onSuccess, onError);
};

// активации страницы

let onMainPinMouseDown = function (evt) {
  if (evt.button === window.util.key.LEFT_MOUSE) {
    getActivePage();
  }
};

let onMainPinKeyDown = function (evt) {
  window.util.isEnterEvent(evt, function () {
    getActivePage();
  });
};

mapPinMainElement.addEventListener(`mousedown`, onMainPinMouseDown);
mapPinMainElement.addEventListener(`keydown`, onMainPinKeyDown);

// деактивация страницы

let setMainPinStartCoords = function () {
  mapPinMainElement.style.left = COORDS_X + `px`;
  mapPinMainElement.style.top = COORDS_Y + `px`;
};

let getDeactivePage = function () {
  mapElement.classList.add(`map--faded`);

  adFormElement.reset();
  adFormElement.classList.add(`ad-form--disabled`);

  setFormDisabled(adFormFieldsetElements);
  setFormDisabled(mapFiltersElements);

  setAddressCoords(COORDS_X, COORDS_Y);
  setMainPinStartCoords();

  window.card.removePopup();
  window.pin.removePins();
  window.preview.resetPreview();

  mapPinMainElement.addEventListener(`mousedown`, getActivePage);
  mapPinMainElement.addEventListener(`keydown`, getActivePage);
};

window.main = {
  mapElement: getMapElement(),
  mapPinMainElement: getMapPinMainElement(),
  mapFiltersContainer: getMapFiltersContainer(),
  adFormElement: getAdFormElement(),
  pinAddressInputElement: getPinAddressInputElement(),

  offers: function () {
    return offers;
  },

  getDeactivePage: getDeactivePage,
  createPins: createPins
};

})();

(() => {
/*!********************************!*\
  !*** ./js/modules/debounce.js ***!
  \********************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const DEBOUNCE_INTERVAL = 500; // ms

window.debounce = function (cb) {
  let lastTimeout = null;

  return function (...parameters) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function () {
      cb(...parameters);
    }, DEBOUNCE_INTERVAL);
  };
};

})();

(() => {
/*!*******************************!*\
  !*** ./js/modules/message.js ***!
  \*******************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


let mainElement = document.querySelector(`main`);

let onErrorSend = function (message) {
  let errorTemplate = document.querySelector(`#error`).content.querySelector(`.error`);
  let errorElement = errorTemplate.cloneNode(true);
  errorElement.querySelector(`.error__message`).textContent = message;
  errorElement.querySelector(`.error__button`).addEventListener(`click`, onErrorMessageClick);
  mainElement.appendChild(errorElement);

  document.addEventListener(`keydown`, onErrorMessageEscKeydown);
  document.addEventListener(`mousedown`, onErrorMessageMouseDown);
};

let errorMessageClose = function () {
  let errorElement = document.querySelector(`.error`);
  errorElement.remove();
  document.removeEventListener(`keydown`, onErrorMessageEscKeydown);
  document.removeEventListener(`mousedown`, onErrorMessageMouseDown);
};

let onErrorMessageClick = function () {
  errorMessageClose();
};

let onErrorMessageMouseDown = function () {
  errorMessageClose();
};

let onErrorMessageEscKeydown = function (evt) {
  window.util.isEscEvent(evt, errorMessageClose);
};

let onSuccessSend = function () {
  let successTemplate = document.querySelector(`#success`).content.querySelector(`.success`);
  let successElement = successTemplate.cloneNode(true);
  mainElement.appendChild(successElement);

  document.addEventListener(`keydown`, onSuccessMessageEscKeydown);
  document.addEventListener(`mousedown`, onSuccessMessageMouseDown);
};

let successMessageClose = function () {
  let successElement = document.querySelector(`.success`);
  successElement.remove();
  document.removeEventListener(`keydown`, onSuccessMessageEscKeydown);
  document.removeEventListener(`mousedown`, onSuccessMessageMouseDown);
};

let onSuccessMessageMouseDown = function () {
  successMessageClose();
};

let onSuccessMessageEscKeydown = function (evt) {
  window.util.isEscEvent(evt, successMessageClose);
};

window.message = {
  onErrorSend: onErrorSend,
  onSuccessSend: onSuccessSend
};

})();

(() => {
/*!*******************************!*\
  !*** ./js/modules/beckend.js ***!
  \*******************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


let URL_LOAD = `https://21.javascript.pages.academy/keksobooking/data`;
let URL_UPLOAD = `https://21.javascript.pages.academy/keksobooking`;
let OK_CODE = 200;
let TIMEOUT = 10000;

let request = function (onSuccess, onError, data) {
  let xhr = new XMLHttpRequest();
  xhr.responseType = `json`;
  xhr.timeout = TIMEOUT;

  xhr.addEventListener(`load`, function () {
    if (xhr.status === OK_CODE) {
      onSuccess(xhr.response);
    } else {
      onError(`Cтатус ответа: ` + xhr.status + ` ` + xhr.statusText);
    }
  });

  xhr.addEventListener(`error`, function () {
    onError(`Произошла ошибка соединения`);
  });

  xhr.addEventListener(`timeout`, function () {
    onError(`Запрос не успел выполниться за ` + xhr.timeout + `мс`);
  });

  if (data) {
    xhr.open(`POST`, URL_UPLOAD);
    xhr.send(data);
  } else {
    xhr.open(`GET`, URL_LOAD);
    xhr.send();
  }
};

window.backend = {
  load: request,
  save: request
};


})();

(() => {
/*!***************************!*\
  !*** ./js/modules/pin.js ***!
  \***************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const MIN_WIDTH_PINS = window.defaults.MIN_WIDTH_PINS;
const MIN_HEIGHT_PINS = window.defaults.MIN_HEIGHT_PINS;

let mapElement = window.main.mapElement;

let mapPinsElement = mapElement.querySelector(`.map__pins`);
let mapFiltersContainer = window.main.mapFiltersContainer;

const getMapPinsElement = () => mapPinsElement;

let getPin = function (booking) {
  let pinTemplate = document.querySelector(`#pin`).content;
  let pinElement = pinTemplate.querySelector(`.map__pin`).cloneNode(true);

  pinElement.querySelector(`img`).src = booking.author.avatar;
  pinElement.querySelector(`img`).alt = booking.offer.description;

  let locationX = booking.location.x - MIN_WIDTH_PINS / 2 + `px`;
  let locationY = booking.location.y - MIN_HEIGHT_PINS + `px`;

  pinElement.style.left = locationX;
  pinElement.style.top = locationY;

  mapPinsElement.appendChild(pinElement);

  pinElement.addEventListener(`click`, function () {
    removeActivePin();
    pinElement.classList.add(`map__pin--active`);
    window.card.removePopup();

    mapElement.insertBefore(window.card.getCard(booking), mapFiltersContainer);
  });

  return pinElement;
};

let removePins = function () {
  let pinsOnMap = mapElement.querySelectorAll(`.map__pin:not(.map__pin--main)`);

  if (pinsOnMap.length > 0) {
    pinsOnMap.forEach(function (pin) {
      pin.remove();
    });
  }
};

let removeActivePin = function () {
  let activePin = mapElement.querySelector(`.map__pin--active`);

  if (activePin !== null) {
    activePin.classList.remove(`map__pin--active`);
  }
};

window.pin = {
  mapPinsElement: getMapPinsElement(),
  getPin: getPin,
  removePins: removePins,
  removeActivePin: removeActivePin
};

})();

(() => {
/*!****************************!*\
  !*** ./js/modules/card.js ***!
  \****************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


let isEscEvent = window.util.isEscEvent;

let types = window.defaults.types;

let map = window.main.mapElement;

let onEscKeyDown = function (evt) {
  let popup = map.querySelector(`.popup`);

  isEscEvent(evt, function () {
    if (popup !== null) {
      removePopup();
      document.removeEventListener(`keydown`, onEscKeyDown);
      window.pin.removeActivePin();
    }
  });
};

let getCard = function (booking) {
  let cardTemplate = document.querySelector(`#card`).content;
  let cardElement = cardTemplate.querySelector(`.map__card`).cloneNode(true);

  cardElement.querySelector(`.popup__avatar`).src = booking.author.avatar;
  cardElement.querySelector(`.popup__avatar`).alt = booking.offer.description;

  cardElement.querySelector(`.popup__title`).textContent = booking.offer.title;

  cardElement.querySelector(`.popup__text--address`).textContent = booking.offer.address;

  cardElement.querySelector(`.popup__text--price`).textContent = booking.offer.price + `₽/ночь`;

  cardElement.querySelector(`.popup__type`).textContent = types[booking.offer.type].ru;

  cardElement.querySelector(`.popup__text--capacity`).textContent = `${booking.offer.rooms} ${booking.offer.rooms === 1 ? `комната` : `комнаты`} для ${booking.offer.guests} ${booking.offer.guests === 1 ? `гостя` : `гостей`}`;

  cardElement.querySelector(`.popup__text--time`).textContent = `Заезд после ${booking.offer.checkin}, выезд до ${booking.offer.checkout}`;

  let featureItems = cardElement.querySelectorAll(`.popup__feature`);

  for (let feature of featureItems) {
    if (booking.offer.features.indexOf(feature.classList[1].replace(`popup__feature--`, ``)) < 0) {
      feature.remove();
    }
  }

  cardElement.querySelector(`.popup__description`).textContent = booking.offer.description;

  let cardPhotos = cardElement.querySelector(`.popup__photos`);
  let cardPhotoImage = cardPhotos.querySelector(`.popup__photo`);

  if (booking.offer.photos.length > 0) {
    cardPhotoImage.remove();
    for (let photo of booking.offer.photos) {
      let clonePhoto = document.querySelector(`#card`).content.querySelector(`.popup__photo`).cloneNode(true);
      clonePhoto.src = photo;
      cardPhotos.appendChild(clonePhoto);
    }
  } else {
    cardPhotos.remove();
  }

  let popupClose = cardElement.querySelector(`.popup__close`);

  document.addEventListener(`keydown`, onEscKeyDown);

  popupClose.addEventListener(`click`, function () {
    removePopup();
    window.pin.removeActivePin();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  return cardElement;
};

let removePopup = function () {
  let popup = map.querySelector(`.popup`);

  if (popup !== null) {
    popup.remove();
  }
};

window.card = {
  getCard: getCard,
  removePopup: removePopup
};


})();

(() => {
/*!****************************!*\
  !*** ./js/modules/form.js ***!
  \****************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


let types = window.defaults.types;

let adFormElement = window.main.adFormElement;

let selectTypeElement = adFormElement.querySelector(`#type`);
let inputPriceElement = adFormElement.querySelector(`#price`);

let roomNumberElement = adFormElement.querySelector(`#room_number`);
let numberSeatsElement = adFormElement.querySelector(`#capacity`);

let selectTimeInElement = adFormElement.querySelector(`#timein`);
let selectTimeOutElement = adFormElement.querySelector(`#timeout`);

let adFormResetElement = adFormElement.querySelector(`.ad-form__reset`);

let numberGuest = {
  1: [1],
  2: [1, 2],
  3: [1, 2, 3],
  100: [0]
};

// отключение ручного редактирования поля адреса формы

window.main.pinAddressInputElement.readOnly = true;

// валидация типа жилья и цены за ночь

let onTypeSelectChange = function () {
  inputPriceElement.min = types[selectTypeElement.value].min;
  inputPriceElement.placeholder = types[selectTypeElement.value].min;
};

selectTypeElement.addEventListener(`change`, onTypeSelectChange);

// валидация количество комнат и количеста мест

let disableNumberSeatsOptions = function (list) {
  let capacityOptions = numberSeatsElement.querySelectorAll(`option`);

  for (let i = 0; i < capacityOptions.length; i++) {
    capacityOptions[i].disabled = true;
  }

  numberGuest[list].forEach(function (item) {
    numberSeatsElement.querySelector(`[value="${item}"]`).disabled = false;
    numberSeatsElement.value = item;
  });
};

let onRoomNumberSelectChange = function () {
  disableNumberSeatsOptions(roomNumberElement.value);
};

roomNumberElement.addEventListener(`change`, onRoomNumberSelectChange);

// валидация времени заезда и выезда

let onTimeInSelectChange = function () {
  selectTimeOutElement.value = selectTimeInElement.value;
};

let onTimeOutSelectChange = function () {
  selectTimeInElement.value = selectTimeOutElement.value;
};

selectTimeInElement.addEventListener(`change`, onTimeInSelectChange);
selectTimeOutElement.addEventListener(`change`, onTimeOutSelectChange);

// отправка формы

let onError = function () {
  window.message.onErrorSend(`Ошибка загрузки объявления`);
};

let onSuccess = function () {
  window.message.onSuccessSend();
  window.main.getDeactivePage();
};

let onFormSubmit = function (evt) {
  evt.preventDefault();
  window.backend.save(onSuccess, onError, new FormData(adFormElement));
};

adFormElement.addEventListener(`submit`, onFormSubmit);

adFormResetElement.addEventListener(`click`, function (evt) {
  evt.preventDefault();
  window.main.getDeactivePage();
});


})();

(() => {
/*!******************************!*\
  !*** ./js/modules/filter.js ***!
  \******************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const DEFAULT_FILTER_VALUE = `any`;

let filterFormElement = window.main.mapFiltersContainer.querySelector(`form`);

let priceMap = {
  'low': {
    start: 0,
    end: 10000
  },
  'middle': {
    start: 10000,
    end: 50000
  },
  'high': {
    start: 50000,
    end: Infinity
  }
};

let filterElements = Array.from(filterFormElement.children);

let filterValidation = {
  'housing-type': function (data, filter) {
    return filter.value === data.offer.type;
  },

  'housing-price': function (data, filter) {
    return data.offer.price >= priceMap[filter.value].start && data.offer.price < priceMap[filter.value].end;
  },

  'housing-rooms': function (data, filter) {
    return filter.value === data.offer.rooms.toString();
  },

  'housing-guests': function (data, filter) {
    return filter.value === data.offer.guests.toString();
  },

  'housing-features': function (data, filter) {
    let inputCheckElements = Array.from(filter.querySelectorAll(`input[type=checkbox]:checked`));

    return inputCheckElements.every(function (current) {
      return data.offer.features.some(function (feature) {
        return feature === current.value;
      });
    });
  }
};


let filterData = function (data) {
  return data.filter(function (item) {
    return filterElements.every(function (filter) {
      return (filter.value === DEFAULT_FILTER_VALUE) ? true : filterValidation[filter.id](item, filter);
    });
  });
};

let onFilterFormChange = window.debounce(function () {
  window.card.removePopup();
  window.pin.removePins();
  window.main.createPins(filterData(window.main.offers()).slice(0, window.main.MAX_COUNT));
});

filterFormElement.addEventListener(`change`, onFilterFormChange);

window.filter = filterData;

})();

(() => {
/*!*******************************!*\
  !*** ./js/modules/preview.js ***!
  \*******************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const FILE_TYPES = [`gif`, `jpg`, `jpeg`, `png`];

let Photo = {
  WIDTH: 70,
  HEIGTH: 70,
  ALT: `Фотография жилья`
};

let form = window.main.adFormElement;

let fileChooserAvatar = form.querySelector(`.ad-form-header__upload input[type=file]`);
let previewAvatar = form.querySelector(`.ad-form-header__upload img`);
let defaultAvatar = previewAvatar.src;

let photoContainer = form.querySelector(`.ad-form__photo-container`);
let fileChooserPhotos = form.querySelector(`.ad-form__upload input[type=file]`);
let previewPhoto = form.querySelector(`.ad-form__photo`);

let previews = [];

let showPreview = function (element, preview) {
  let file = element.files[0];
  let fileName = file.name.toLowerCase();

  let matches = FILE_TYPES.some(function (it) {
    return fileName.endsWith(it);
  });

  if (matches) {
    let reader = new FileReader();

    reader.addEventListener(`load`, function () {
      preview(reader.result);
    });

    reader.readAsDataURL(file);
  }
};

fileChooserAvatar.addEventListener(`change`, function () {
  showPreview(fileChooserAvatar, function (image) {
    previewAvatar.src = image;
  });
});

fileChooserPhotos.addEventListener(`change`, function () {
  showPreview(fileChooserPhotos, createPhotoElement);
});

let createPhotoElement = function (src) {
  let element = document.createElement(`div`);
  element.classList.add(`ad-form__photo`);

  let photoElement = document.createElement(`img`);
  photoElement.src = src;
  photoElement.width = Photo.WIDTH;
  photoElement.height = Photo.HEIGTH;
  photoElement.alt = Photo.ALT;

  element.appendChild(photoElement);
  previews.push(element);
  photoContainer.insertBefore(element, previewPhoto);
};

let resetPreview = function () {
  if (previews) {
    previews.forEach(function (element) {
      element.remove();
    });
  }

  previews = [];
  previewAvatar.src = defaultAvatar;
};

window.preview = {
  resetPreview: resetPreview
};

})();

(() => {
/*!***********************************!*\
  !*** ./js/modules/draganddrop.js ***!
  \***********************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


let mapPinMainElement = window.main.mapPinMainElement;

let MAIN_PIN_WIDTH = mapPinMainElement.clientWidth;
let MAIN_PIN_HEIGHT = mapPinMainElement.clientHeight;

let MIN_LOCATION_X = window.defaults.MIN_LOCATION_X;
let MIN_LOCATION_Y = window.defaults.MIN_LOCATION_Y;

let MAX_LOCATION_Y = window.defaults.MAX_LOCATION_Y;
let MAX_LOCATION_X = window.defaults.MAX_LOCATION_X;

let setMainPinMove = function (shift) {
  let y = mapPinMainElement.offsetTop - shift.y;
  let x = mapPinMainElement.offsetLeft - shift.x;

  if (x > MAX_LOCATION_X - MAIN_PIN_WIDTH / 2) {
    x = MAX_LOCATION_X - MAIN_PIN_WIDTH / 2;
  } else if (x < MIN_LOCATION_X - MAIN_PIN_WIDTH / 2) {
    x = MIN_LOCATION_X - MAIN_PIN_WIDTH / 2;
  }

  if (y > MAX_LOCATION_Y - MAIN_PIN_HEIGHT) {
    y = MAX_LOCATION_Y - MAIN_PIN_HEIGHT;
  } else if (y < MIN_LOCATION_Y - MAIN_PIN_HEIGHT) {
    y = MIN_LOCATION_Y - MAIN_PIN_HEIGHT;
  }

  mapPinMainElement.style.top = y + `px`;
  mapPinMainElement.style.left = x + `px`;

  window.main.pinAddressInputElement.value = Math.round(parseInt(mapPinMainElement.style.left, 10) + MAIN_PIN_WIDTH / 2) + `, ` + Math.round(parseInt(mapPinMainElement.style.top, 10) + MAIN_PIN_HEIGHT / 2);
};

let onMainPinGrab = function (evt) {
  if (evt.button === window.util.key.LEFT_MOUSE) {
    evt.preventDefault();

    let startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    let onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      let shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      setMainPinMove(shift);
    };

    let onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener(`mousemove`, onMouseMove);
      document.removeEventListener(`mouseup`, onMouseUp);
    };

    document.addEventListener(`mousemove`, onMouseMove);
    document.addEventListener(`mouseup`, onMouseUp);
  }
};

mapPinMainElement.addEventListener(`mousedown`, onMainPinGrab);


})();

/******/ })()
;