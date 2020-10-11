'use strict';

(function () {
  const USERS_COUNT = 8;

  const MIN_LOCATION_X = 0;
  const MAX_LOCATION_X = document.querySelector(`.map`).offsetWidth;

  const MIN_LOCATION_Y = 130;
  const MAX_LOCATION_Y = 630;

  const MIN_WIDTH_PINS = 50;
  const MIN_HEIGHT_PINS = 70;

  const COORDS_X = 600;
  const COORDS_Y = 350;

  let mapElement = document.querySelector(`.map`);

  let mapPinMainElement = document.querySelector(`.map__pin--main`);
  let mapFiltersElements = document.querySelectorAll(`.map__filter`);

  let adFormElement = document.querySelector(`.ad-form`);
  let adFormFieldsetElements = document.querySelectorAll(`fieldset`);

  /* функция отрисовки пинов */

  let createPins = function (bookings) {
    let fragment = document.createDocumentFragment();
    let mapPinsElement = window.pin.PinsElement;

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
    window.form.pinAddressInputElement.value = coordsX + `,` + coordsY;
  };

  let render = function () {
    let bookingsMock = window.mock.getBookingsMock();

    createPins(bookingsMock);
  };

  let activePage = function () {
    setFormActive(adFormFieldsetElements);
    setFormActive(mapFiltersElements);
    mapElement.classList.remove(`map--faded`);
    adFormElement.classList.remove(`ad-form--disabled`);
    setAddressCoords(COORDS_X, COORDS_Y);
    render();
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

  window.main = {
    USERS_COUNT: USERS_COUNT,
    MAX_LOCATION_X: MAX_LOCATION_X,
    MIN_LOCATION_X: MIN_LOCATION_X,
    MIN_LOCATION_Y: MIN_LOCATION_Y,
    MAX_LOCATION_Y: MAX_LOCATION_Y,
    MIN_WIDTH_PINS: MIN_WIDTH_PINS,
    MIN_HEIGHT_PINS: MIN_HEIGHT_PINS,
    mapElement: mapElement,
    mapPinMainElement: mapPinMainElement,
    adFormElement: adFormElement,
    setAddressCoords: setAddressCoords
  };
})();
