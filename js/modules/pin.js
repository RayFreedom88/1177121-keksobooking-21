'use strict';

const MIN_WIDTH_PINS = window.constants.MIN_WIDTH_PINS;
const MIN_HEIGHT_PINS = window.constants.MIN_HEIGHT_PINS;

const mapElement = window.mainElement.map;
const mapPinsElement = mapElement.querySelector(`.map__pins`);
const mapFiltersContainer = window.filter.element.container;

const pinTemplate = document.querySelector(`#pin`).content;

// функция создания пинов

const create = function (booking) {
  const pinElement = pinTemplate.querySelector(`.map__pin`).cloneNode(true);

  pinElement.querySelector(`img`).src = booking.author.avatar;
  pinElement.querySelector(`img`).alt = booking.offer.description;

  let locationX = booking.location.x - MIN_WIDTH_PINS / 2 + `px`;
  let locationY = booking.location.y - MIN_HEIGHT_PINS + `px`;

  pinElement.style.left = locationX;
  pinElement.style.top = locationY;

  mapPinsElement.appendChild(pinElement);

  pinElement.addEventListener(`click`, () => {
    removeActive();
    pinElement.classList.add(`map__pin--active`);
    window.card.remove();

    mapElement.insertBefore(window.card.create(booking), mapFiltersContainer);
  });

  return pinElement;
};

// функция отрисовки пинов

const render = function (bookings) {
  const fragment = document.createDocumentFragment();

  bookings.forEach(function (booking) {
    fragment.appendChild(create(booking));
  });

  mapPinsElement.appendChild(fragment);
};

// функции удаления пинов

const remove = function () {
  const pinsOnMap = mapElement.querySelectorAll(`.map__pin:not(.map__pin--main)`);

  if (pinsOnMap.length > 0) {
    pinsOnMap.forEach(function (pin) {
      pin.remove();
    });
  }
};

const removeActive = function () {
  const activePin = mapElement.querySelector(`.map__pin--active`);

  if (activePin !== null) {
    activePin.classList.remove(`map__pin--active`);
  }
};

window.pin = {
  create,
  render,
  remove,
  removeActive
};
