'use strict';

let mainElement = document.querySelector(`main`);

let onErrorSend = function (message) {
  let errorTemplate = document.querySelector(`#error`).content.querySelector(`.error`);
  let errorElement = errorTemplate.cloneNode(true);
  errorElement.querySelector(`.error__message`).textContent = message;
  errorElement.querySelector(`.error__button`).addEventListener(`click`, onErrorMessageClick);
  mainElement.appendChild(errorElement);

  document.addEventListener(`keydown`, onErrorMessageEscKeydown);
  document.addEventListener(`mousedown`, onErrorMessageMouseDown);
};

let errorMessageClose = function () {
  let errorElement = document.querySelector(`.error`);
  errorElement.remove();
  document.removeEventListener(`keydown`, onErrorMessageEscKeydown);
  document.removeEventListener(`mousedown`, onErrorMessageMouseDown);
};

let onErrorMessageClick = function () {
  errorMessageClose();
};

let onErrorMessageMouseDown = function () {
  errorMessageClose();
};

let onErrorMessageEscKeydown = function (evt) {
  window.util.isEscEvent(evt, errorMessageClose);
};

let onSuccessSend = function () {
  let successTemplate = document.querySelector(`#success`).content.querySelector(`.success`);
  let successElement = successTemplate.cloneNode(true);
  mainElement.appendChild(successElement);

  document.addEventListener(`keydown`, onSuccessMessageEscKeydown);
  document.addEventListener(`mousedown`, onSuccessMessageMouseDown);
};

let successMessageClose = function () {
  let successElement = document.querySelector(`.success`);
  successElement.remove();
  document.removeEventListener(`keydown`, onSuccessMessageEscKeydown);
  document.removeEventListener(`mousedown`, onSuccessMessageMouseDown);
};

let onSuccessMessageMouseDown = function () {
  successMessageClose();
};

let onSuccessMessageEscKeydown = function (evt) {
  window.util.isEscEvent(evt, successMessageClose);
};

window.message = {
  onErrorSend,
  onSuccessSend
};
