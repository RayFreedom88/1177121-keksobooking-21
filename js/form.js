'use strict';

(function () {
  let adFormElement = window.main.getAdFormElement;

  let selectTypeElement = adFormElement.querySelector(`#type`);
  let inputPriceElement = adFormElement.querySelector(`#price`);

  let roomNumberElement = adFormElement.querySelector(`#room_number`);
  let numberSeatsElement = adFormElement.querySelector(`#capacity`);

  let selectTimeInElement = adFormElement.querySelector(`#timein`);
  let selectTimeOutElement = adFormElement.querySelector(`#timeout`);

  let adFormResetElement = adFormElement.querySelector(`.ad-form__reset`);

  let types = {
    palace: {
      ru: `Дворец`,
      min: `10000`
    },
    flat: {
      ru: `Квартира`,
      min: `1000`
    },
    house: {
      ru: `Дом`,
      min: `5000`
    },
    bungalow: {
      ru: `Бунгало`,
      min: `0`
    }
  };

  let numberGuest = {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    100: [0]
  };

  // отключение ручного редактирования поля адреса формы

  window.main.getPinAddressInputElement.readOnly = true;

  // валидация типа жилья и цены за ночь

  let onTypeSelectChange = function () {
    inputPriceElement.min = types[selectTypeElement.value].min;
    inputPriceElement.placeholder = types[selectTypeElement.value].min;
  };

  selectTypeElement.addEventListener(`change`, onTypeSelectChange);

  // валидация количество комнат и количеста мест

  let disableNumberSeatsOptions = function (list) {
    let capacityOptions = numberSeatsElement.querySelectorAll(`option`);

    for (let i = 0; i < capacityOptions.length; i++) {
      capacityOptions[i].disabled = true;
    }

    numberGuest[list].forEach(function (item) {
      numberSeatsElement.querySelector(`[value="${item}"]`).disabled = false;
      numberSeatsElement.value = item;
    });
  };

  let onRoomNumberSelectChange = function () {
    disableNumberSeatsOptions(roomNumberElement.value);
  };

  roomNumberElement.addEventListener(`change`, onRoomNumberSelectChange);

  // валидация времени заезда и выезда

  let onTimeInSelectChange = function () {
    selectTimeOutElement.value = selectTimeInElement.value;
  };

  let onTimeOutSelectChange = function () {
    selectTimeInElement.value = selectTimeOutElement.value;
  };

  selectTimeInElement.addEventListener(`change`, onTimeInSelectChange);
  selectTimeOutElement.addEventListener(`change`, onTimeOutSelectChange);

  // отправка формы

  let onError = function () {
    window.message.onErrorSend(`Ошибка загрузки объявления`);
  };

  let onSuccess = function () {
    window.message.onSuccessSend();
    window.main.getDeactivePage();
  };

  let onFormSubmit = function (evt) {
    evt.preventDefault();
    window.backend.save(onSuccess, onError, new FormData(adFormElement));
  };

  adFormElement.addEventListener(`submit`, onFormSubmit);

  adFormResetElement.addEventListener(`click`, function (evt) {
    evt.preventDefault();
    window.main.getDeactivePage();
  });
})();
