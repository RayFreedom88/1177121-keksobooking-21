'use strict';

const mapElement = document.querySelector(`.map`);
const mapPinMainElement = mapElement.querySelector(`.map__pin--main`);

window.mainElement = {
  map: mapElement,
  pin: mapPinMainElement,
};
