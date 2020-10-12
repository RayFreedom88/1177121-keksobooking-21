'use strict';

(function () {
  let mapPinMainElement = window.main.mapPinMainElement;

  let MAIN_PIN_WIDTH = mapPinMainElement.clientWidth;
  let MAIN_PIN_HEIGHT = mapPinMainElement.clientHeight;

  let MIN_LOCATION_X = window.main.MIN_LOCATION_X;
  let MIN_LOCATION_Y = window.main.MIN_LOCATION_Y;

  let MAX_LOCATION_Y = window.main.MAX_LOCATION_Y;
  let MAX_LOCATION_X = window.main.MAX_LOCATION_X;

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

    window.form.pinAddressInputElement.value = Math.round(parseInt(mapPinMainElement.style.left, 10) + MAIN_PIN_WIDTH / 2) + `, ` + Math.round(parseInt(mapPinMainElement.style.top, 10) + MAIN_PIN_HEIGHT / 2);
  };

  let onMainPinMouseMove = function (evt) {
    if (evt.button === 0) {
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

  mapPinMainElement.addEventListener(`mousedown`, onMainPinMouseMove);
})();
