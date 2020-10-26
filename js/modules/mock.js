'use strict';

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

let USERS_COUNT = window.main.USERS_COUNT;

let MAX_LOCATION_X = window.main.MAX_LOCATION_X;
let MIN_LOCATION_X = window.main.MIN_LOCATION_X;

let MIN_LOCATION_Y = window.main.MIN_LOCATION_Y;
let MAX_LOCATION_Y = window.main.MAX_LOCATION_Y;

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

window.mock = {
  getBookingsMock: getBookingsMock
};

