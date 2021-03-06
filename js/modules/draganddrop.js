'use strict';

const mapPinMainElement = window.mainElement.pin;

const MAIN_PIN_WIDTH = mapPinMainElement.clientWidth;
const MAIN_PIN_HEIGHT = mapPinMainElement.clientHeight;

const MIN_LOCATION_X = window.constants.MIN_LOCATION_X;
const MIN_LOCATION_Y = window.constants.MIN_LOCATION_Y;

const MAX_LOCATION_Y = window.constants.MAX_LOCATION_Y;
const MAX_LOCATION_X = window.constants.MAX_LOCATION_X;

const setMainPinMove = function (shift) {
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

const onMainPinGrab = function (evt) {
  if (evt.button === window.util.key.LEFT_MOUSE) {
    evt.preventDefault();

    let startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    const onMouseMove = function (moveEvt) {
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

    const onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener(`mousemove`, onMouseMove);
      document.removeEventListener(`mouseup`, onMouseUp);
    };

    document.addEventListener(`mousemove`, onMouseMove);
    document.addEventListener(`mouseup`, onMouseUp);
  }
};

mapPinMainElement.addEventListener(`mousedown`, onMainPinGrab);

