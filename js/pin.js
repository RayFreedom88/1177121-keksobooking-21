'use strict';

(function () {
  let map = window.map.mapElement;
  let MIN_WIDTH_PINS = window.main.MIN_WIDTH_PINS;
  let MIN_HEIGHT_PINS = window.main.MIN_HEIGHT_PINS;

  let mapPinsElement = map.querySelector(`.map__pins`);
  let mapFiltersContainer = map.querySelector(`.map__filters-container`);

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

    pinElement.addEventListener(`click`, function () {
      window.card.removePopup();

      map.insertBefore(window.card.getCard(booking), mapFiltersContainer);
    });

    return pinElement;
  };

  window.pin = {
    PinsElement: mapPinsElement,
    getPin: getPin
  };
})();
