'use strict';

(function () {
  let adFormElement = window.main.adFormElement;
  let pinAddressInputElement = document.querySelector(`#address`);

  let selectTypeElement = adFormElement.querySelector(`#type`);
  let inputPriceElement = adFormElement.querySelector(`#price`);

  let roomNumberElement = adFormElement.querySelector(`#room_number`);
  let numberSeatsElement = adFormElement.querySelector(`#capacity`);

  let selectTimeInElement = adFormElement.querySelector(`#timein`);
  let selectTimeOutElement = adFormElement.querySelector(`#timeout`);

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

  // валидация адреса

  pinAddressInputElement.readOnly = true;

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

  window.form = {
    pinAddressInputElement: pinAddressInputElement,
  };
})();
