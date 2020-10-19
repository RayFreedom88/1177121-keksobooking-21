'use strict';

(function () {
  const MAX_COUNT = 5;

  const MIN_LOCATION_X = 0;
  const MAX_LOCATION_X = document.querySelector(`.map`).offsetWidth;

  const MIN_LOCATION_Y = 130;
  const MAX_LOCATION_Y = 630;

  const MIN_WIDTH_PINS = 50;
  const MIN_HEIGHT_PINS = 70;

  const COORDS_X = 570;
  const COORDS_Y = 375;

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
    let mapPinsElement = window.pin.getMapPinsElement;

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
  };

  let onError = function (message) {
    window.message.onErrorSend(message);
  };

  let activePage = function () {
    setFormActive(adFormFieldsetElements);
    setFormActive(mapFiltersElements);
    mapElement.classList.remove(`map--faded`);
    adFormElement.classList.remove(`ad-form--disabled`);
    window.backend.load(onSuccess, onError);
  };

  // активации страницы

  let getActivePage = function (evt) {
    if (evt.key === `Enter` || evt.button === 0) {
      activePage();
    }

    mapPinMainElement.removeEventListener(`mousedown`, getActivePage);
    mapPinMainElement.removeEventListener(`keydown`, getActivePage);
  };

  mapPinMainElement.addEventListener(`mousedown`, getActivePage);
  mapPinMainElement.addEventListener(`keydown`, getActivePage);

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

    mapPinMainElement.addEventListener(`mousedown`, getActivePage);
    mapPinMainElement.addEventListener(`keydown`, getActivePage);
  };

  window.main = {
    MAX_COUNT: MAX_COUNT,
    MAX_LOCATION_X: MAX_LOCATION_X,
    MIN_LOCATION_X: MIN_LOCATION_X,
    MIN_LOCATION_Y: MIN_LOCATION_Y,
    MAX_LOCATION_Y: MAX_LOCATION_Y,
    MIN_WIDTH_PINS: MIN_WIDTH_PINS,
    MIN_HEIGHT_PINS: MIN_HEIGHT_PINS,
    getMapElement: getMapElement(),
    getMapPinMainElement: getMapPinMainElement(),
    getMapFiltersContainer: getMapFiltersContainer(),
    getAdFormElement: getAdFormElement(),
    getPinAddressInputElement: getPinAddressInputElement(),
    offers: function () {
      return offers;
    },
    getDeactivePage: getDeactivePage,
    createPins: createPins
  };
})();
