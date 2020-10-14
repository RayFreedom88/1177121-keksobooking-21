'use strict';

(function () {
  let URL_LOAD = `https://21.javascript.pages.academy/keksobooking/data`;
  let URL_UPLOAD = `https://21.javascript.pages.academy/keksobooking`;
  let TIMEOUT = 10000;

  let request = function (onSuccess, onError, data) {
    let xhr = new XMLHttpRequest();
    xhr.responseType = `json`;
    xhr.timeout = TIMEOUT;

    xhr.addEventListener(`load`, function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onError(`Cтатус ответа: ` + xhr.status + ` ` + xhr.statusText);
      }
    });

    xhr.addEventListener(`error`, function () {
      onError(`Произошла ошибка соединения`);
    });

    xhr.addEventListener(`timeout`, function () {
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
})();
