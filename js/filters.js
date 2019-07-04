'use strict';
(function () {
  var filtersContainer = document.querySelector('.map__filters-container');
  var filters = filtersContainer.querySelectorAll('.map__filter');
  var quantity = 5;

  var housingType = filtersContainer.querySelector('#housing-type');
  var housingPrice = filtersContainer.querySelector('#housing-price');
  var LOW_PRICE = 10000;
  var HIGH_PRICE = 50000;
  var housingRooms = filtersContainer.querySelector('#housing-rooms');
  var housingGuests = filtersContainer.querySelector('#housing-guests');
  var adsFilteredData;

  filters.forEach(function (it) {
    it.addEventListener('change', filter);
  });

  function filter() {
    adsFilteredData = filterData(window.adsDefaultData, housingType.value, 'type');
    adsFilteredData = filterHousingPrice(adsFilteredData, housingPrice.value);
    adsFilteredData = filterData(adsFilteredData, housingRooms.value, 'rooms');
    adsFilteredData = filterData(adsFilteredData, housingGuests.value, 'guests');

    window.deletePins();
    window.insertPinsFragment(adsFilteredData, quantity);
  }

  /*   function HousingTypeChangeHandler() {
    adsFilteredData = filterHousingType(window.adsDefaultData);
    window.deletePins();
    window.insertPinsFragment(adsFilteredData, quantity);
  } */

  function filterData(data, value, offerKey) {
    if (value === 'any') {
      return data;
    }
    var filteredData = data.filter(function (it) {
      return (it.offer[offerKey].toString() === value.toString());
    });
    return filteredData;
  }

  function filterHousingPrice(data, value) {
    var filterCbToValue = {
      'middle': function (it) {
        return (it.offer.price >= LOW_PRICE && it.offer.price <= HIGH_PRICE);
      },
      'low': function (it) {
        return (it.offer.price < LOW_PRICE);
      },
      'high': function (it) {
        return (it.offer.price > HIGH_PRICE);
      }
    };
    if (value === 'any') {
      return data;
    }
    var filteredData = data.filter(filterCbToValue[value]);
    return filteredData;
  }

})();
