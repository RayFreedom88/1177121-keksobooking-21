'use strict';

let filterFormElement = window.main.getMapFiltersContainer.querySelector(`form`);

let priceMap = {
  'low': {
    start: 0,
    end: 10000
  },
  'middle': {
    start: 10000,
    end: 50000
  },
  'high': {
    start: 50000,
    end: Infinity
  }
};

let filterElements = Array.from(filterFormElement.children);

let filterValidation = {
  'housing-type': function (data, filter) {
    return filter.value === data.offer.type;
  },

  'housing-price': function (data, filter) {
    return data.offer.price >= priceMap[filter.value].start && data.offer.price < priceMap[filter.value].end;
  },

  'housing-rooms': function (data, filter) {
    return filter.value === data.offer.rooms.toString();
  },

  'housing-guests': function (data, filter) {
    return filter.value === data.offer.guests.toString();
  },

  'housing-features': function (data, filter) {
    let inputCheckElements = Array.from(filter.querySelectorAll(`input[type=checkbox]:checked`));

    return inputCheckElements.every(function (current) {
      return data.offer.features.some(function (feature) {
        return feature === current.value;
      });
    });
  }
};


let filterData = function (data) {
  return data.filter(function (item) {
    return filterElements.every(function (filter) {
      return (filter.value === `any`) ? true : filterValidation[filter.id](item, filter);
    });
  });
};

let onFilterFormChange = window.debounce(function () {
  window.card.removePopup();
  window.pin.removePins();
  window.main.createPins(filterData(window.main.offers()).slice(0, window.main.MAX_COUNT));
});

filterFormElement.addEventListener(`change`, onFilterFormChange);

window.filter = filterData;
