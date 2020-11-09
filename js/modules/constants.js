'use strict';

let constants = {
  COORDS_X: 570,
  COORDS_Y: 375,

  GUESTS_COUNT: 1,

  MAX_COUNT: 5,

  MIN_WIDTH_PINS: 50,
  MIN_HEIGHT_PINS: 70,

  MIN_LOCATION_X: 0,
  MAX_LOCATION_X: document.querySelector(`.map`).offsetWidth,

  MIN_LOCATION_Y: 130,
  MAX_LOCATION_Y: 630,

  NUMBER_GUEST: {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    100: [0]
  },

  TYPES: {
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
      ru: `Бунгало `,
      min: `0`
    }
  }
};

window.constants = constants;
