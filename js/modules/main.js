'use strict';

const MAX_COUNT = window.constants.MAX_COUNT;

const COORDS_X = window.constants.COORDS_X;
const COORDS_Y = window.constants.COORDS_Y;

const mapElement = document.querySelector(`.map`);

const mapPinMainElement = document.querySelector(`.map__pin--main`);
const mapFiltersContainer = mapElement.querySelector(`.map__filters-container`);
const mapFiltersElements = document.querySelectorAll(`.map__filter`);

const adFormElement = document.querySelector(`.ad-form`);
const pinAddressInputElement = adFormElement.querySelector(`#address`);

let adFormFieldsetElements = adFormElement.querySelectorAll(`fieldset`);

let offers = [];

/* функция отрисовки пинов */

let renderPins = function (bookings) {
  let fragment = document.createDocumentFragment();
  let mapPinsElement = window.pin.mapPinsElement;

  bookings.forEach(function (booking) {
    fragment.appendChild(window.pin.create(booking));
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

  renderPins(offers.slice(0, MAX_COUNT));

  setFormActive(adFormFieldsetElements);
  setFormActive(mapFiltersElements);

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

  adFormElement.reset();
  adFormElement.classList.add(`ad-form--disabled`);

  window.form.onTypeSelectChange();

  setFormDisabled(adFormFieldsetElements);
  setFormDisabled(mapFiltersElements);

  setAddressCoords(COORDS_X, COORDS_Y);
  setMainPinStartCoords();

  window.card.remove();
  window.pin.remove();
  window.preview.reset();

  mapPinMainElement.addEventListener(`mousedown`, onMainPinMouseDown);
  mapPinMainElement.addEventListener(`keydown`, onMainPinKeyDown);
};

window.main = {
  mapElement,
  mapPinMainElement,
  mapFiltersContainer,
  adFormElement,
  pinAddressInputElement,

  offers() {
    return offers;
  },

  deactivatePage,
  renderPins
};
