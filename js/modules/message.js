'use strict';

let isError = false;

let mainElement = document.querySelector(`main`);

let errorTemplate = document.querySelector(`#error`).content.querySelector(`.error`);
let successTemplate = document.querySelector(`#success`).content.querySelector(`.success`);

let onErrorMessageClick = function () {
  removeMessageElement();
};

let onMouseDown = function () {
  removeMessageElement();
};

let onEscKeydown = function (evt) {
  window.util.onEscEvent(evt, removeMessageElement);
};

let addMessageRemovers = function () {
  document.addEventListener(`keydown`, onEscKeydown);
  document.addEventListener(`mousedown`, onMouseDown);
};

let removeMessageElement = function () {
  let selector = isError ? `.error` : `.success`;

  document.querySelector(selector).remove();

  document.removeEventListener(`keydown`, onEscKeydown);
  document.removeEventListener(`mousedown`, onMouseDown);
};

let onErrorSend = function (message) {
  isError = true;

  let errorElement = errorTemplate.cloneNode(true);
  errorElement.querySelector(`.error__message`).textContent = message;
  errorElement.querySelector(`.error__button`).addEventListener(`click`, onErrorMessageClick);
  mainElement.appendChild(errorElement);

  addMessageRemovers();
};

let onSuccessSend = function () {
  isError = false;

  let successElement = successTemplate.cloneNode(true);
  mainElement.appendChild(successElement);

  addMessageRemovers();
};

window.message = {
  onErrorSend,
  onSuccessSend
};
