'use strict';

let mainElement = document.querySelector(`main`);

let errorTemplate = document.querySelector(`#error`).content.querySelector(`.error`);
let successTemplate = document.querySelector(`#success`).content.querySelector(`.success`);

let onResultSend = function (message) {
  if (message) {
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

    let cloneErrorElement = errorTemplate.cloneNode(true);
    cloneErrorElement.querySelector(`.error__message`).textContent = message;
    cloneErrorElement.querySelector(`.error__button`).addEventListener(`click`, onErrorMessageClick);
    mainElement.appendChild(cloneErrorElement);

    document.addEventListener(`keydown`, onErrorMessageEscKeydown);
    document.addEventListener(`mousedown`, onErrorMessageMouseDown);
  } else {
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

    let cloneSuccessElement = successTemplate.cloneNode(true);
    mainElement.appendChild(cloneSuccessElement);

    document.addEventListener(`keydown`, onSuccessMessageEscKeydown);
    document.addEventListener(`mousedown`, onSuccessMessageMouseDown);
  }
};

// let errorMessageClose = function () {
//   let errorElement = document.querySelector(`.error`);
//   errorElement.remove();
//   document.removeEventListener(`keydown`, onErrorMessageEscKeydown);
//   document.removeEventListener(`mousedown`, onErrorMessageMouseDown);
// };

// let onErrorMessageClick = function () {
//   errorMessageClose();
// };

// let onErrorMessageMouseDown = function () {
//   errorMessageClose();
// };

// let onErrorMessageEscKeydown = function (evt) {
//   window.util.isEscEvent(evt, errorMessageClose);
// };

// let successMessageClose = function () {
//   let successElement = document.querySelector(`.success`);
//   successElement.remove();
//   document.removeEventListener(`keydown`, onSuccessMessageEscKeydown);
//   document.removeEventListener(`mousedown`, onSuccessMessageMouseDown);
// };

// let onSuccessMessageMouseDown = function () {
//   successMessageClose();
// };

// let onSuccessMessageEscKeydown = function (evt) {
//   window.util.isEscEvent(evt, successMessageClose);
// };

window.message = {
  onErrorSend: onResultSend,
  onSuccessSend: onResultSend
};
