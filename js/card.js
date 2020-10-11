'use strict';

(function () {
  let map = window.map.mapElement;
  let onEscKeyDown = window.card.onEscKeyDown;

  let getCard = function (booking) {
    let cardTemplate = document.querySelector(`#card`).content;
    let cardElement = cardTemplate.querySelector(`.map__card`).cloneNode(true);

    cardElement.querySelector(`.popup__avatar`).src = booking.author.avatar;
    cardElement.querySelector(`.popup__avatar`).alt = booking.offer.description;

    cardElement.querySelector(`.popup__title`).textContent = booking.offer.title;

    cardElement.querySelector(`.popup__text--address`).textContent = booking.offer.address;

    cardElement.querySelector(`.popup__text--price`).textContent = booking.offer.price + `₽/ночь`;

    cardElement.querySelector(`.popup__type`).textContent = booking.offer.type;

    cardElement.querySelector(`.popup__text--capacity`).textContent = `${booking.offer.rooms} ${booking.offer.rooms === 1 ? `комната` : `комнаты`} для ${booking.offer.gusts} ${booking.offer.gusts === 1 ? `гостя` : `гостей`}`;

    cardElement.querySelector(`.popup__text--time`).textContent = `Заезд после ${booking.offer.checkin}, выезд до ${booking.offer.checkout}`;

    let featureItems = cardElement.querySelectorAll(`.popup__feature`);

    for (let i = 0; i < featureItems.length; i++) {
      if (featureItems[i].indexOf === booking.offer.features[i]) {
        featureItems[i].style.opacity = 0.3;
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
      removePopup();

      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    return cardElement;
  };

  let removePopup = function () {
    let popup = map.querySelector(`.popup`);

    if (popup !== null) {
      popup.remove();
    }
  };

  window.card = {
    getCard: getCard,
    removePopup: removePopup
  };
})();
