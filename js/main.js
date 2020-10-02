'use strict';

const USERS_COUNT = 8;
const AVATARS = [
  `img/avatars/user01.png`,
  `img/avatars/user02.png`,
  `img/avatars/user03.png`,
  `img/avatars/user04.png`,
  `img/avatars/user05.png`,
  `img/avatars/user06.png`,
  `img/avatars/user07.png`,
  `img/avatars/user08.png`
];
const TITLE = [
  `Первый заголовок`,
  `Второй заголовок`,
  `Третий заголовок`,
  `Четвертый заголовок`,
  `Пятый заголовок`,
  `Шестой заголовок`,
  `Седьмой заголовк`,
  `Восьмой заголовок`
];
const TYPES = [`palace`, `flat`, `house`, `bungalo`];
const TIMES = [`12:00`, `13:00`, `14:00`];
const FEATURES = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
const DESCRIPTIONS = [
  `Первое описание`,
  `Второе описание`,
  `Третье описание`,
  `Четвертое описание`,
  `Пятое описание`,
  `Шестое описание`,
  `Седьмое описание`,
  `Восьмое описание`
];
const PHOTOS = [
  `http://o0.github.io/assets/images/tokyo/hotel1.jpg`,
  `http://o0.github.io/assets/images/tokyo/hotel2.jpg`,
  `http://o0.github.io/assets/images/tokyo/hotel3.jpg`
];
const MIN_LOCATION_X = 0;
const MAX_LOCATION_X = document.querySelector(`.map`).offsetWidth;
const MIN_LOCATION_Y = 130;
const MAX_LOCATION_Y = 630;
const MIN_WIDTH_PINS = 50;
const MIN_HEIGHT_PINS = 70;
let COORDS_X = 600;
let COORDS_Y = 350;
let numberGuest = {
  1: [1],
  2: [1, 2],
  3: [1, 2, 3],
  100: [0]
};

let mapElement = document.querySelector(`.map`);
let mapPinMainElement = document.querySelector(`.map__pin--main`);
let mapPinsElement = mapElement.querySelector(`.map__pins`);
let mapFiltersElements = document.querySelectorAll(`.map__filter`);
let adFormElement = document.querySelector(`.ad-form`);
let adFormFieldsetElements = document.querySelectorAll(`fieldset`);
let pinAddressInputElement = document.querySelector(`input[name="address"]`);
let roomNumberElement = adFormElement.querySelector(`#room_number`);
let numberSeatsElement = adFormElement.querySelector(`#capacity`);

let getRandomValue = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

let getRandomElement = function (items) {
  return items[Math.round(Math.random() * (items.length - 1))];
};

let getRandomArray = function (item) {
  let array = [];
  let randomNumber;

  if (Array.isArray(item)) {
    randomNumber = Math.floor(Math.random() * 7);
    for (let i = 0; i < randomNumber; i++) {
      array.push(item[i]);
    }
  } else {
    randomNumber = Math.floor(Math.random() * 4);
    for (let i = 0; i < randomNumber; i++) {
      array.push(item);
    }
  }

  return array;
};

let getBookingsMock = function () {
  let mocks = [];
  for (let i = 0; i < USERS_COUNT; i++) {
    mocks.push({
      author: {
        avatar: AVATARS[i],
      },
      offer: {
        title: getRandomElement(TITLE),
        address: getRandomValue(MIN_LOCATION_X, MAX_LOCATION_X) + `, ` + getRandomValue(MIN_LOCATION_Y, MAX_LOCATION_Y),
        price: getRandomValue(1, 1000),
        type: getRandomElement(TYPES),
        rooms: getRandomValue(1, 3),
        gusts: getRandomValue(1, 10),
        checkin: getRandomElement(TIMES),
        checkout: getRandomElement(TIMES),
        features: getRandomArray(FEATURES),
        description: getRandomElement(DESCRIPTIONS),
        photos: getRandomArray(getRandomElement(PHOTOS))
      },

      location: {
        x: getRandomValue(MIN_LOCATION_X, MAX_LOCATION_X),
        y: getRandomValue(MIN_LOCATION_Y, MAX_LOCATION_Y),
      },
    });
  }

  return mocks;
};

let getPin = function (booking) {
  let pinTemplate = document.querySelector(`#pin`).content;
  let pinElement = pinTemplate.querySelector(`.map__pin`).cloneNode(true);

  pinElement.querySelector(`img`).src = booking.author.avatar;
  pinElement.querySelector(`img`).alt = booking.offer.description;

  let locationX = booking.location.x - MIN_WIDTH_PINS + `px`;
  let locationY = booking.location.y - MIN_HEIGHT_PINS + `px`;

  pinElement.style.left = locationX;
  pinElement.style.top = locationY;

  mapPinsElement.appendChild(pinElement);

  return pinElement;
};

let createPins = function (bookings) {
  let fragment = document.createDocumentFragment();

  bookings.forEach(function (booking) {
    fragment.appendChild(getPin(booking));
  });
  mapPinsElement.appendChild(fragment);
};

let getCard = function (booking) {
  let cardTemplate = document.querySelector(`#card`).content;
  let cardElement = cardTemplate.querySelector(`.map__card`).cloneNode(true);

  cardElement.querySelector(`.popup__avatar`).src = booking.author.avatar;
  cardElement.querySelector(`.popup__avatar`).alt = booking.offer.description;

  cardElement.querySelector(`.popup__title`).textContent = booking.offer.title;

  cardElement.querySelector(`.popup__text--address`).textContent = booking.offer.address;

  cardElement.querySelector(`.popup__text--price`).textContent = booking.offer.price + `₽/ночь`;

  cardElement.querySelector(`.popup__type`).textContent = booking.offer.type;

  cardElement.querySelector(`.popup__text--capacity`).textContent = `${booking.offer.rooms} ${booking.offer.rooms === 1 ? `комната` : `комнаты`} для ${booking.offer.gusts} ${booking.offer.gusts === 1 ? `гостя` : `гостей`}`;

  cardElement.querySelector(`.popup__text--time`).textContent = `Заезд после ${booking.offer.checkin}, выезд до ${booking.offer.checkout}`;

  let featureItems = cardElement.querySelectorAll(`.popup__feature`);

  for (let i = 0; i < featureItems.length; i++) {
    if (featureItems[i].indexOf === booking.offer.features[i]) {
      featureItems[i].style.opacity = 0.3;
    }
  }

  cardElement.querySelector(`.popup__description`).textContent = booking.offer.description;

  let cardPhotos = cardElement.querySelector(`.popup__photos`);
  let cardPhotoImage = cardPhotos.querySelector(`.popup__photo`);

  if (booking.offer.photos.length > 0) {
    cardPhotoImage.remove();
    for (let photo of booking.offer.photos) {
      let clonePhoto = document.querySelector(`#card`).content.querySelector(`.popup__photo`).cloneNode(true);
      clonePhoto.src = photo;
      cardPhotos.appendChild(clonePhoto);
    }
  } else {
    cardPhotos.remove();
  }

  return cardElement;
};

let createCards = function (bookings) {
  let fragment = document.createDocumentFragment();

  bookings.forEach(function (booking) {
    fragment.appendChild(getCard(booking));
  });
  mapPinsElement.appendChild(fragment);
};

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

// блокировка форм

let setFormDisabled = function (items) {
  for (let i = 0; i < items.length; i++) {
    items[i].disabled = true;
  }
};

setFormDisabled(adFormFieldsetElements);
setFormDisabled(mapFiltersElements);

// активация страницы + вызов отрисовки пинов и карточек

let setFormActive = function (items) {
  for (let i = 0; i < items.length; i++) {
    items[i].disabled = false;
  }
};

let setAddressCoords = function (coordsX, coordsY) {
  pinAddressInputElement.value = coordsX + `,` + coordsY;
};

let render = function () {
  let bookingsMock = getBookingsMock();

  createPins(bookingsMock);
  createCards(bookingsMock);
};

let activePage = function () {
  setFormActive(adFormFieldsetElements);
  setFormActive(mapFiltersElements);
  mapElement.classList.remove(`map--faded`);
  adFormElement.classList.remove(`ad-form--disabled`);
  setAddressCoords(COORDS_X, COORDS_Y);
  render();
};

let getActivePage = function (evt) {
  if (evt.key === `Enter` || evt.button === 0) {
    activePage();
  }
};

mapPinMainElement.addEventListener(`mousedown`, getActivePage);
mapPinMainElement.addEventListener(`keydown`, getActivePage);
