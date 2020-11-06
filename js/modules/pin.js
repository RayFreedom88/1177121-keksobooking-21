'use strict';

const MIN_WIDTH_PINS = window.constants.MIN_WIDTH_PINS;
const MIN_HEIGHT_PINS = window.constants.MIN_HEIGHT_PINS;

let mapElement = window.main.mapElement;

let mapPinsElement = mapElement.querySelector(`.map__pins`);
let mapFiltersContainer = window.main.mapFiltersContainer;

const getMapPinsElement = () => mapPinsElement;

let create = function (booking) {
  let pinTemplate = document.querySelector(`#pin`).content;
  let pinElement = pinTemplate.querySelector(`.map__pin`).cloneNode(true);

  pinElement.querySelector(`img`).src = booking.author.avatar;
  pinElement.querySelector(`img`).alt = booking.offer.description;

  let locationX = booking.location.x - MIN_WIDTH_PINS / 2 + `px`;
  let locationY = booking.location.y - MIN_HEIGHT_PINS + `px`;

  pinElement.style.left = locationX;
  pinElement.style.top = locationY;

  mapPinsElement.appendChild(pinElement);

  pinElement.addEventListener(`click`, function () {
    removeActive();
    pinElement.classList.add(`map__pin--active`);
    window.card.remove();

    mapElement.insertBefore(window.card.create(booking), mapFiltersContainer);
  });

  return pinElement;
};

let remove = function () {
  let pinsOnMap = mapElement.querySelectorAll(`.map__pin:not(.map__pin--main)`);

  if (pinsOnMap.length > 0) {
    pinsOnMap.forEach(function (pin) {
      pin.remove();
    });
  }
};

let removeActive = function () {
  let activePin = mapElement.querySelector(`.map__pin--active`);

  if (activePin !== null) {
    activePin.classList.remove(`map__pin--active`);
  }
};

window.pin = {
  mapPinsElement: getMapPinsElement(),
  create,
  remove,
  removeActive
};
