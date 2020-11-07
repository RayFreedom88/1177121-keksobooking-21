'use strict';

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
