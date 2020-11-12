'use strict';

let isError = false;

const mainElement = document.querySelector(`main`);

const errorTemplate = document.querySelector(`#error`).content.querySelector(`.error`);
const successTemplate = document.querySelector(`#success`).content.querySelector(`.success`);

const onErrorMessageClick = function () {
  removeMessageElement();
};

const onMouseDown = function () {
  removeMessageElement();
};

const onEscKeydown = function (evt) {
  window.util.onEscEvent(evt, removeMessageElement);
};

const addMessageRemovers = function () {
  document.addEventListener(`keydown`, onEscKeydown);
  document.addEventListener(`mousedown`, onMouseDown);
};

const removeMessageElement = function () {
  const selector = isError ? `.error` : `.success`;

  document.querySelector(selector).remove();

  document.removeEventListener(`keydown`, onEscKeydown);
  document.removeEventListener(`mousedown`, onMouseDown);
};

const onErrorSend = function (message) {
  isError = true;

  const errorElement = errorTemplate.cloneNode(true);
  errorElement.querySelector(`.error__message`).textContent = message;
  errorElement.querySelector(`.error__button`).addEventListener(`click`, onErrorMessageClick);
  mainElement.appendChild(errorElement);

  addMessageRemovers();
};

const onSuccessSend = function () {
  isError = false;

  const successElement = successTemplate.cloneNode(true);
  mainElement.appendChild(successElement);

  addMessageRemovers();
};

window.message = {
  onErrorSend,
  onSuccessSend
};
