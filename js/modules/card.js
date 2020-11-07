'use strict';

let isEscEvent = window.util.isEscEvent;

let types = window.constants.TYPES;

let mapElement = window.mainElement.map;

let cardTemplate = document.querySelector(`#card`).content;

let onEscKeyDown = function (evt) {
  let popup = mapElement.querySelector(`.popup`);

  isEscEvent(evt, function () {
    if (popup !== null) {
      remove();
      document.removeEventListener(`keydown`, onEscKeyDown);
      window.pin.removeActive();
    }
  });
};

let create = function (booking) {
  let cardElement = cardTemplate.querySelector(`.map__card`).cloneNode(true);

  cardElement.querySelector(`.popup__avatar`).src = booking.author.avatar;
  cardElement.querySelector(`.popup__avatar`).alt = booking.offer.description;

  cardElement.querySelector(`.popup__title`).textContent = booking.offer.title;

  cardElement.querySelector(`.popup__text--address`).textContent = booking.offer.address;

  cardElement.querySelector(`.popup__text--price`).textContent = booking.offer.price + `₽/ночь`;

  cardElement.querySelector(`.popup__type`).textContent = types[booking.offer.type].ru;

  cardElement.querySelector(`.popup__text--capacity`).textContent = `${booking.offer.rooms} ${booking.offer.rooms === window.constants.GUESTS_COUNT ? `комната` : `комнаты`} для ${booking.offer.guests} ${booking.offer.guests === window.constants.GUESTS_COUNT ? `гостя` : `гостей`}`;

  cardElement.querySelector(`.popup__text--time`).textContent = `Заезд после ${booking.offer.checkin}, выезд до ${booking.offer.checkout}`;

  let featuresElement = cardElement.querySelector(`.popup__features`);
  let featureElements = cardElement.querySelectorAll(`.popup__feature`);

  for (let feature of featureElements) {
    if (booking.offer.features.indexOf(feature.classList[1].replace(`popup__feature--`, ``)) < 0) {
      feature.remove();
    }

    if (booking.offer.features.length === 0) {
      featuresElement.remove();
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

  let popupClose = cardElement.querySelector(`.popup__close`);

  document.addEventListener(`keydown`, onEscKeyDown);

  popupClose.addEventListener(`click`, function () {
    remove();
    window.pin.removeActive();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  return cardElement;
};

let remove = function () {
  let popup = mapElement.querySelector(`.popup`);

  if (popup !== null) {
    popup.remove();
  }
};

window.card = {
  create,
  remove
};

