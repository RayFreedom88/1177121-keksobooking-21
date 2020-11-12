'use strict';

const types = window.constants.TYPES;

const adFormElement = document.querySelector(`.ad-form`);
const adFormFieldsetElements = adFormElement.querySelectorAll(`fieldset`);

const pinAddressInputElement = adFormElement.querySelector(`#address`);

const selectTypeElement = adFormElement.querySelector(`#type`);
const inputPriceElement = adFormElement.querySelector(`#price`);

const roomNumberElement = adFormElement.querySelector(`#room_number`);
const numberSeatsElement = adFormElement.querySelector(`#capacity`);

const selectTimeInElement = adFormElement.querySelector(`#timein`);
const selectTimeOutElement = adFormElement.querySelector(`#timeout`);

const adFormResetElement = adFormElement.querySelector(`.ad-form__reset`);

const numberGuest = window.constants.NUMBER_GUEST;

const mapFilterElements = window.filter.element.form.querySelectorAll(`.map__filter`);

// отключение ручного редактирования поля адреса формы

pinAddressInputElement.readOnly = true;

// поиск адрема метки

const setAddressCoords = function (coordsX, coordsY) {
  pinAddressInputElement.value = coordsX + `,` + coordsY;
};

// блокировка форм

const setDisabled = function (items) {
  for (let i = 0; i < items.length; i++) {
    items[i].disabled = true;
  }
};

const setFormDisabled = function () {
  setDisabled(adFormFieldsetElements);
  setDisabled(mapFilterElements);
};

// активация форм

const setActive = function (items) {
  for (let i = 0; i < items.length; i++) {
    items[i].disabled = false;
  }
};

const setFormActive = function () {
  setActive(adFormFieldsetElements);
  setActive(mapFilterElements);
};

// валидация типа жилья и цены за ночь

const onTypeSelectChange = function () {
  inputPriceElement.min = types[selectTypeElement.value].min;
  inputPriceElement.placeholder = types[selectTypeElement.value].min;
};

selectTypeElement.addEventListener(`change`, onTypeSelectChange);

// валидация количество комнат и количеста мест

const disableNumberSeatsOptions = function (list) {
  const capacityOptions = numberSeatsElement.querySelectorAll(`option`);

  for (let i = 0; i < capacityOptions.length; i++) {
    capacityOptions[i].disabled = true;
  }

  numberGuest[list].forEach(function (item) {
    numberSeatsElement.querySelector(`[value="${item}"]`).disabled = false;
    numberSeatsElement.value = item;
  });
};

const onRoomNumberSelectChange = function () {
  disableNumberSeatsOptions(roomNumberElement.value);
};

roomNumberElement.addEventListener(`change`, onRoomNumberSelectChange);

// валидация времени заезда и выезда

const onTimeInSelectChange = function () {
  selectTimeOutElement.value = selectTimeInElement.value;
};

const onTimeOutSelectChange = function () {
  selectTimeInElement.value = selectTimeOutElement.value;
};

selectTimeInElement.addEventListener(`change`, onTimeInSelectChange);
selectTimeOutElement.addEventListener(`change`, onTimeOutSelectChange);

// отправка формы

const onError = function () {
  window.message.onErrorSend(`Ошибка загрузки объявления`);
};

const onSuccess = function () {
  window.message.onSuccessSend();
  window.main.deactivatePage();
};

const onFormSubmit = function (evt) {
  evt.preventDefault();
  window.backend.save(onSuccess, onError, new FormData(adFormElement));
};

adFormElement.addEventListener(`submit`, onFormSubmit);

// сброс настроек формы

adFormResetElement.addEventListener(`click`, function (evt) {
  evt.preventDefault();
  window.main.deactivatePage();
});

window.form = {
  element: {
    ad: adFormElement,
    pinAddressInput: pinAddressInputElement,
  },

  setAddressCoords,
  setDisabled: setFormDisabled,
  setActive: setFormActive,
  onTypeSelectChange
};

