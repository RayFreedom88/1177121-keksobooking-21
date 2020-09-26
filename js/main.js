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


let mapElement = document.querySelector(`.map`);
let mapPinsElement = mapElement.querySelector(`.map__pins`);

let getActivePage = function () {
  mapElement.classList.remove(`map--faded`);
};
getActivePage();

let getRandomValue = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

let getRandomElement = function (items) {
  return items[Math.round(Math.random() * (items.length - 1))];
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
        features: getRandomElement(FEATURES),
        description: getRandomElement(DESCRIPTIONS),
        photos: getRandomElement(PHOTOS) // может быть сюда стоит добавить циклы, чтобы было несколько фотографий? => см. ниже комментарий.
      },

      location: {
        x: getRandomValue(MIN_LOCATION_X, MAX_LOCATION_X),
        y: getRandomValue(MIN_LOCATION_Y, MAX_LOCATION_Y),
      },
    });
  }

  return mocks;
};

let getPin = function (object) {
  let pinTemplate = document.querySelector(`#pin`).content;
  let pinElement = pinTemplate.querySelector(`.map__pin`).cloneNode(true);

  pinElement.querySelector(`img`).src = object.author.avatar;
  pinElement.querySelector(`img`).alt = object.offer.description;

  let locationX = object.location.x - MIN_WIDTH_PINS + `px`;
  let locationY = object.location.y - MIN_HEIGHT_PINS + `px`;

  pinElement.style.left = locationX;
  pinElement.style.top = locationY;

  mapPinsElement.appendChild(pinElement);

  return pinElement;
};

let createPins = function (objects) {
  let fragment = document.createDocumentFragment();

  objects.forEach(function (object) {
    fragment.appendChild(getPin(object));
  });
  mapPinsElement.appendChild(fragment);
};

let getCard = function (object) {
  let cardTemplate = document.querySelector(`#card`).content;
  let cardElement = cardTemplate.querySelector(`.map__card`).cloneNode(true);

  cardElement.querySelector(`.popup__avatar`).src = object.author.avatar;
  cardElement.querySelector(`.popup__avatar`).alt = object.offer.description;

  cardElement.querySelector(`.popup__title`).textContent = object.offer.title;

  cardElement.querySelector(`.popup__text--address`).textContent = object.offer.address;

  cardElement.querySelector(`.popup__text--price`).textContent = object.offer.price + `₽/ночь`;

  cardElement.querySelector(`.popup__type`).textContent = object.offer.type;

  cardElement.querySelector(`.popup__text--capacity`).textContent = `${object.offer.rooms} ${object.offer.rooms === 1 ? `комната` : `комнаты`} для ${object.offer.gusts} ${object.offer.gusts === 1 ? `гостя` : `гостей`}`;

  cardElement.querySelector(`.popup__text--time`).textContent = `Заезд после ${object.offer.checkin}, выезд до ${object.offer.checkout}`;

  let featureItems = cardElement.querySelectorAll(`.popup__feature`);

  for (let feature of featureItems) {
    if (object.offer.features.indexOf(feature.classList[1].replace(`popup__feature--`, ``)) < 0) {
      feature.remove();
    }
  }

  cardElement.querySelector(`.popup__description`).textContent = object.offer.description;
  // и здесь надо будет сделать цикл с добавлением фотографий из объекта?
  cardElement.querySelector(`.popup__photo`).src = object.offer.photos;

  return cardElement;
};

let createCards = function (objects) {
  let fragment = document.createDocumentFragment();

  objects.forEach(function (object) {
    fragment.appendChild(getCard(object));
  });
  mapPinsElement.appendChild(fragment);
};

let BookingsMock = getBookingsMock();

createPins(BookingsMock);
createCards(BookingsMock);

