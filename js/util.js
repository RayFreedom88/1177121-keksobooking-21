'use strict';

(function () {
  let ESC_KEYCODE = 27;
  let removePopup = window.card.removePopup;

  let isEscEvent = function (evt, fn) {
    if (evt.keyCode === ESC_KEYCODE) {
      evt.preventDefault();
      fn();
    }
  };

  let onEscKeyDown = function (evt) {
    let popup = window.map.querySelector(`.popup`);

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
