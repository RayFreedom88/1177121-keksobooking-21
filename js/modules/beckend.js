'use strict';

const URL_LOAD = `https://21.javascript.pages.academy/keksobooking/data`;
const URL_UPLOAD = `https://21.javascript.pages.academy/keksobooking`;
const OK_CODE = 200;
const TIMEOUT = 10000;

const request = function (onSuccess, onError, data) {
  let xhr = new XMLHttpRequest();
  xhr.responseType = `json`;
  xhr.timeout = TIMEOUT;

  xhr.addEventListener(`load`, () => {
    if (xhr.status === OK_CODE) {
      onSuccess(xhr.response);
    } else {
      onError(`Cтатус ответа: ` + xhr.status + ` ` + xhr.statusText);
    }
  });

  xhr.addEventListener(`error`, function () {
    onError(`Произошла ошибка соединения`);
  });

  xhr.addEventListener(`timeout`, () => {
    onError(`Запрос не успел выполниться за ` + xhr.timeout + `мс`);
  });

  if (data) {
    xhr.open(`POST`, URL_UPLOAD);
    xhr.send(data);
  } else {
    xhr.open(`GET`, URL_LOAD);
    xhr.send();
  }
};

window.backend = {
  load: request,
  save: request
};

