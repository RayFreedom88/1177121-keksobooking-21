'use strict';

const DEFAULT_FILTER_VALUE = `any`;

const mapElement = window.mainElement.map;
const mapFiltersContainer = mapElement.querySelector(`.map__filters-container`);
const mapFiltersElement = mapFiltersContainer.querySelector(`form`);

const priceMap = {
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

const filterElements = Array.from(mapFiltersElement.children);

const filterValidation = {
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


const filterData = function (data) {
  return data.filter(function (item) {
    return filterElements.every(function (filter) {
      return (filter.value === DEFAULT_FILTER_VALUE) ? true : filterValidation[filter.id](item, filter);
    });
  });
};

const onFilterFormChange = window.debounce(function () {
  window.card.remove();
  window.pin.remove();
  window.pin.render(filterData(window.main.offers()).slice(0, window.constants.MAX_COUNT));
});

mapFiltersElement.addEventListener(`change`, onFilterFormChange);

window.filter = {
  element: {
    container: mapFiltersContainer,
    form: mapFiltersElement,
  },

  filterData
};
