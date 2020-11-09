'use strict';

let Key = {
  LEFT_MOUSE: 0,
  ENTER: 13,
  ESC: 27
};

let onEnterEvent = function (evt, actionFn) {
  if (evt.keyCode === Key.ENTER) {
    actionFn();
  }
};

let onEscEvent = function (evt, actionFn) {
  if (evt.keyCode === Key.ESC) {
    evt.preventDefault();
    actionFn();
  }
};

window.util = {
  key: Key,
  onEnterEvent,
  onEscEvent
};

