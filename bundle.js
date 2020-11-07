/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
(() => {
/*!************************************!*\
  !*** ./js/modules/main-element.js ***!
  \************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const mapElement = document.querySelector(`.map`);
const mapPinMainElement = mapElement.querySelector(`.map__pin--main`);

window.mainElement = {
  map: mapElement,
  pin: mapPinMainElement,
};

})();

(() => {
/*!*********************************!*\
  !*** ./js/modules/constants.js ***!
  \*********************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


let constants = {
  COORDS_X: 570,
  COORDS_Y: 375,

  GUESTS_COUNT: 1,

  MAX_COUNT: 5,

  MIN_WIDTH_PINS: 50,
  MIN_HEIGHT_PINS: 70,

  MIN_LOCATION_X: 0,
  MAX_LOCATION_X: document.querySelector(`.map`).offsetWidth,

  MIN_LOCATION_Y: 130,
  MAX_LOCATION_Y: 630,

  NUMBER_GUEST: {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    100: [0]
  },

  TYPES: {
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

window.constants = constants;

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
  isEnterEvent,
  isEscEvent
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

let errorTemplate = document.querySelector(`#error`).content.querySelector(`.error`);
let successTemplate = document.querySelector(`#success`).content.querySelector(`.success`);

let onErrorSend = function (message) {
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
  onErrorSend,
  onSuccessSend
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
/*!******************************!*\
  !*** ./js/modules/filter.js ***!
  \******************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const DEFAULT_FILTER_VALUE = `any`;

const mapElement = window.mainElement.map;
const mapFiltersContainer = mapElement.querySelector(`.map__filters-container`);
const mapFiltersElement = mapFiltersContainer.querySelector(`form`);

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

let filterElements = Array.from(mapFiltersElement.children);

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
  window.card.remove();
  window.pin.remove();
  window.pin.render(filterData(window.main.offers()).slice(0, window.constants.MAX_COUNT));
});

mapFiltersElement.addEventListener(`change`, onFilterFormChange);

window.filter = {
  element: {
    container: mapFiltersContainer,
    form: mapFiltersElement,
  },

  filterData
};

})();

(() => {
/*!****************************!*\
  !*** ./js/modules/form.js ***!
  \****************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


let types = window.constants.TYPES;

const adFormElement = document.querySelector(`.ad-form`);
const adFormFieldsetElements = adFormElement.querySelectorAll(`fieldset`);

const pinAddressInputElement = adFormElement.querySelector(`#address`);

let selectTypeElement = adFormElement.querySelector(`#type`);
let inputPriceElement = adFormElement.querySelector(`#price`);

let roomNumberElement = adFormElement.querySelector(`#room_number`);
let numberSeatsElement = adFormElement.querySelector(`#capacity`);

let selectTimeInElement = adFormElement.querySelector(`#timein`);
let selectTimeOutElement = adFormElement.querySelector(`#timeout`);

let adFormResetElement = adFormElement.querySelector(`.ad-form__reset`);

let numberGuest = window.constants.NUMBER_GUEST;

const mapFilterElements = window.filter.element.form.querySelectorAll(`.map__filter`);

// отключение ручного редактирования поля адреса формы

pinAddressInputElement.readOnly = true;

// поиск адрема метки

let setAddressCoords = function (coordsX, coordsY) {
  pinAddressInputElement.value = coordsX + `,` + coordsY;
};

// блокировка форм

let setDisabled = function (items) {
  for (let i = 0; i < items.length; i++) {
    items[i].disabled = true;
  }
};

let setFormDisabled = function () {
  setDisabled(adFormFieldsetElements);
  setDisabled(mapFilterElements);
};

// активация форм

let setActive = function (items) {
  for (let i = 0; i < items.length; i++) {
    items[i].disabled = false;
  }
};

let setFormActive = function () {
  setActive(adFormFieldsetElements);
  setActive(mapFilterElements);
};

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
  window.main.deactivatePage();
};

let onFormSubmit = function (evt) {
  evt.preventDefault();
  window.backend.save(onSuccess, onError, new FormData(adFormElement));
};

adFormElement.addEventListener(`submit`, onFormSubmit);

// сброс настроек формы

adFormResetElement.addEventListener(`click`, function (evt) {
  evt.preventDefault();
  window.main.deactivatePage();
});

window.form = {
  element: {
    ad: adFormElement,
    pinAddressInput: pinAddressInputElement,
  },

  setAddressCoords,
  setDisabled: setFormDisabled,
  setActive: setFormActive,
  onTypeSelectChange
};


})();

(() => {
/*!***************************!*\
  !*** ./js/modules/pin.js ***!
  \***************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const MIN_WIDTH_PINS = window.constants.MIN_WIDTH_PINS;
const MIN_HEIGHT_PINS = window.constants.MIN_HEIGHT_PINS;

let mapElement = window.mainElement.map;
let mapPinsElement = mapElement.querySelector(`.map__pins`);
let mapFiltersContainer = window.filter.element.container;

let pinTemplate = document.querySelector(`#pin`).content;

// функция создания пинов

let create = function (booking) {
  let pinElement = pinTemplate.querySelector(`.map__pin`).cloneNode(true);

  pinElement.querySelector(`img`).src = booking.author.avatar;
  pinElement.querySelector(`img`).alt = booking.offer.description;

  let locationX = booking.location.x - MIN_WIDTH_PINS / 2 + `px`;
  let locationY = booking.location.y - MIN_HEIGHT_PINS + `px`;

  pinElement.style.left = locationX;
  pinElement.style.top = locationY;

  mapPinsElement.appendChild(pinElement);

  pinElement.addEventListener(`click`, function () {
    removeActive();
    pinElement.classList.add(`map__pin--active`);
    window.card.remove();

    mapElement.insertBefore(window.card.create(booking), mapFiltersContainer);
  });

  return pinElement;
};

// функция отрисовки пинов

let render = function (bookings) {
  let fragment = document.createDocumentFragment();

  bookings.forEach(function (booking) {
    fragment.appendChild(create(booking));
  });

  mapPinsElement.appendChild(fragment);
};

// функции удаления пинов

let remove = function () {
  let pinsOnMap = mapElement.querySelectorAll(`.map__pin:not(.map__pin--main)`);

  if (pinsOnMap.length > 0) {
    pinsOnMap.forEach(function (pin) {
      pin.remove();
    });
  }
};

let removeActive = function () {
  let activePin = mapElement.querySelector(`.map__pin--active`);

  if (activePin !== null) {
    activePin.classList.remove(`map__pin--active`);
  }
};

window.pin = {
  create,
  render,
  remove,
  removeActive
};

})();

(() => {
/*!****************************!*\
  !*** ./js/modules/card.js ***!
  \****************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


let isEscEvent = window.util.isEscEvent;

let types = window.constants.TYPES;

let mapElement = window.mainElement.map;

let cardTemplate = document.querySelector(`#card`).content;

let onEscKeyDown = function (evt) {
  let popup = mapElement.querySelector(`.popup`);

  isEscEvent(evt, function () {
    if (popup !== null) {
      remove();
      document.removeEventListener(`keydown`, onEscKeyDown);
      window.pin.removeActive();
    }
  });
};

let create = function (booking) {
  let cardElement = cardTemplate.querySelector(`.map__card`).cloneNode(true);

  cardElement.querySelector(`.popup__avatar`).src = booking.author.avatar;
  cardElement.querySelector(`.popup__avatar`).alt = booking.offer.description;

  cardElement.querySelector(`.popup__title`).textContent = booking.offer.title;

  cardElement.querySelector(`.popup__text--address`).textContent = booking.offer.address;

  cardElement.querySelector(`.popup__text--price`).textContent = booking.offer.price + `₽/ночь`;

  cardElement.querySelector(`.popup__type`).textContent = types[booking.offer.type].ru;

  cardElement.querySelector(`.popup__text--capacity`).textContent = `${booking.offer.rooms} ${booking.offer.rooms === window.constants.GUESTS_COUNT ? `комната` : `комнаты`} для ${booking.offer.guests} ${booking.offer.guests === window.constants.GUESTS_COUNT ? `гостя` : `гостей`}`;

  cardElement.querySelector(`.popup__text--time`).textContent = `Заезд после ${booking.offer.checkin}, выезд до ${booking.offer.checkout}`;

  let featuresElement = cardElement.querySelector(`.popup__features`);
  let featureElements = cardElement.querySelectorAll(`.popup__feature`);

  for (let feature of featureElements) {
    if (booking.offer.features.indexOf(feature.classList[1].replace(`popup__feature--`, ``)) < 0) {
      feature.remove();
    }

    if (booking.offer.features.length === 0) {
      featuresElement.remove();
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
    remove();
    window.pin.removeActive();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  return cardElement;
};

let remove = function () {
  let popup = mapElement.querySelector(`.popup`);

  if (popup !== null) {
    popup.remove();
  }
};

window.card = {
  create,
  remove
};


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

let adFormElement = window.form.element.ad;

let fileChooserAvatar = adFormElement.querySelector(`.ad-form-header__upload input[type=file]`);
let previewAvatar = adFormElement.querySelector(`.ad-form-header__upload img`);
let defaultAvatar = previewAvatar.src;

let photoContainer = adFormElement.querySelector(`.ad-form__photo-container`);
let fileChooserPhotos = adFormElement.querySelector(`.ad-form__upload input[type=file]`);
let previewPhoto = adFormElement.querySelector(`.ad-form__photo`);

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

let reset = function () {
  if (previews) {
    previews.forEach(function (element) {
      element.remove();
    });
  }

  previews = [];
  previewAvatar.src = defaultAvatar;
};

window.preview = {
  reset
};

})();

(() => {
/*!***********************************!*\
  !*** ./js/modules/draganddrop.js ***!
  \***********************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


let mapPinMainElement = window.mainElement.pin;

let MAIN_PIN_WIDTH = mapPinMainElement.clientWidth;
let MAIN_PIN_HEIGHT = mapPinMainElement.clientHeight;

let MIN_LOCATION_X = window.constants.MIN_LOCATION_X;
let MIN_LOCATION_Y = window.constants.MIN_LOCATION_Y;

let MAX_LOCATION_Y = window.constants.MAX_LOCATION_Y;
let MAX_LOCATION_X = window.constants.MAX_LOCATION_X;

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

  window.form.element.pinAddressInput.value = Math.round(parseInt(mapPinMainElement.style.left, 10) + MAIN_PIN_WIDTH / 2) + `, ` + Math.round(parseInt(mapPinMainElement.style.top, 10) + MAIN_PIN_HEIGHT / 2);
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

(() => {
/*!****************************!*\
  !*** ./js/modules/main.js ***!
  \****************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const MAX_COUNT = window.constants.MAX_COUNT;

const COORDS_X = window.constants.COORDS_X;
const COORDS_Y = window.constants.COORDS_Y;

const mapElement = window.mainElement.map;
const mapPinMainElement = window.mainElement.pin;

const mapFiltersElement = window.filter.element.form;
const adFormElement = window.form.element.ad;

let offers = [];

/* поиск адреса главного пина */

window.form.setAddressCoords(COORDS_X, COORDS_Y);

/* блокировка формы */

window.form.setDisabled();

/* активация страницы */

let onSuccess = function (data) {
  offers = data.slice().filter(function (item) {
    return Object.keys(item.offer).length !== 0;
  });

  window.pin.render(offers.slice(0, MAX_COUNT));

  window.form.setActive();

  mapElement.classList.remove(`map--faded`);
  adFormElement.classList.remove(`ad-form--disabled`);

  mapPinMainElement.removeEventListener(`mousedown`, onMainPinMouseDown);
  mapPinMainElement.removeEventListener(`keydown`, onMainPinKeyDown);
};

let onError = function (message) {
  window.message.onErrorSend(message);
};

let activatePage = function () {
  window.backend.load(onSuccess, onError);
};

// активации страницы

let onMainPinMouseDown = function (evt) {
  if (evt.button === window.util.key.LEFT_MOUSE) {
    activatePage();
  }
};

let onMainPinKeyDown = function (evt) {
  window.util.isEnterEvent(evt, function () {
    activatePage();
  });
};

mapPinMainElement.addEventListener(`mousedown`, onMainPinMouseDown);
mapPinMainElement.addEventListener(`keydown`, onMainPinKeyDown);

// деактивация страницы

let setMainPinStartCoords = function () {
  mapPinMainElement.style.left = COORDS_X + `px`;
  mapPinMainElement.style.top = COORDS_Y + `px`;
};

let deactivatePage = function () {
  mapElement.classList.add(`map--faded`);

  mapFiltersElement.reset();

  adFormElement.reset();
  adFormElement.classList.add(`ad-form--disabled`);

  window.form.onTypeSelectChange();
  window.form.setDisabled();

  window.form.setAddressCoords(COORDS_X, COORDS_Y);
  setMainPinStartCoords();

  window.card.remove();
  window.pin.remove();
  window.preview.reset();

  mapPinMainElement.addEventListener(`mousedown`, onMainPinMouseDown);
  mapPinMainElement.addEventListener(`keydown`, onMainPinKeyDown);
};

window.main = {
  offers() {
    return offers;
  },

  deactivatePage
};

})();

/******/ })()
;