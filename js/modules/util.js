'use strict';

const Key = {
  LEFT_MOUSE: 0,
  ENTER: 13,
  ESC: 27
};

const onEnterEvent = function (evt, actionFn) {
  if (evt.keyCode === Key.ENTER) {
    actionFn();
  }
};

const onEscEvent = function (evt, actionFn) {
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

