'use strict';

(function () {
  let ESC_KEYCODE = 27;
  let map = window.main.getMapElement;
  let removePopup = window.card.removePopup;

  let isEscEvent = function (evt, actionFn) {
    if (evt.keyCode === ESC_KEYCODE) {
      evt.preventDefault();
      actionFn();
    }
  };

  let onEscKeyDown = function (evt) {
    let popup = map.querySelector(`.popup`);

    isEscEvent(evt, function () {
      if (popup !== null) {
        removePopup();
      }
    });
  };

  window.util = {
    isEscEvent: isEscEvent,
    onEscKeyDown: onEscKeyDown
  };
})();
