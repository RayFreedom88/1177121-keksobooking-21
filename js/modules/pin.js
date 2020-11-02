'use strict';

let map = window.main.mapElement;
let MIN_WIDTH_PINS = window.main.MIN_WIDTH_PINS;
let MIN_HEIGHT_PINS = window.main.MIN_HEIGHT_PINS;

let mapPinsElement = map.querySelector(`.map__pins`);
let mapFiltersContainer = window.main.mapFiltersContainer;

const getMapPinsElement = () => mapPinsElement;

let getPin = function (booking) {
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
    removeActivePin();
    pinElement.classList.add(`map__pin--active`);
    window.card.removePopup();

    map.insertBefore(window.card.getCard(booking), mapFiltersContainer);
  });

  return pinElement;
};

let removePins = function () {
  let pinsOnMap = map.querySelectorAll(`.map__pin:not(.map__pin--main)`);

  if (pinsOnMap.length > 0) {
    pinsOnMap.forEach(function (pin) {
      pin.remove();
    });
  }
};

let removeActivePin = function () {
  let activePin = map.querySelector(`.map__pin--active`);

  if (activePin !== null) {
    activePin.classList.remove(`map__pin--active`);
  }
};

window.pin = {
  mapPinsElement: getMapPinsElement(),
  getPin: getPin,
  removePins: removePins,
  removeActivePin: removeActivePin
};
