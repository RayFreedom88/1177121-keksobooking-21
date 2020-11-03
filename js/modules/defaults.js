'use strict';

let defaults = {
  MAX_COUNT: 5,

  MIN_WIDTH_PINS: 50,
  MIN_HEIGHT_PINS: 70,

  MIN_LOCATION_X: 0,
  MAX_LOCATION_X: document.querySelector(`.map`).offsetWidth,

  MIN_LOCATION_Y: 130,
  MAX_LOCATION_Y: 630,

  COORDS_X: 630,
  COORDS_Y: 375,

  types: {
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

window.defaults = defaults;
