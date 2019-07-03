'use strict';
(function () {
  var filtersContainer = document.querySelector('.map__filters-container');
  var filters = filtersContainer.querySelectorAll('.map__filter');
  var quantity = 5;

  filters.forEach(function (it) {
    it.addEventListener('change', filter);
  });

  function filter() {
    var housingType = filtersContainer.querySelector('#housing-type').value;
    var housingPrice = filtersContainer.querySelector('#housing-price').value;
    var housingRooms = filtersContainer.querySelector('#housing-rooms').value;
    var housingGuests = filtersContainer.querySelector('#housing-guests').value;

    window.adsFilteredData = filterData(window.adsDefaultData, housingType, 'type');
    window.adsFilteredData = filterHousingPrice(window.adsFilteredData, housingPrice);
    window.adsFilteredData = filterData(window.adsFilteredData, housingRooms, 'rooms');
    window.adsFilteredData = filterData(window.adsFilteredData, housingGuests, 'guests');

    window.deletePins();
    window.insertPinsFragment(window.adsFilteredData, quantity);
  }

  /*   function HousingTypeChangeHandler() {
    window.adsFilteredData = filterHousingType(window.adsDefaultData);
    window.deletePins();
    window.insertPinsFragment(window.adsFilteredData, quantity);
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
        return (it.offer.price >= 10000 && it.offer.price <= 50000);
      },
      'low': function (it) {
        return (it.offer.price < 10000);
      },
      'high': function (it) {
        return (it.offer.price > 50000);
      }
    };
    if (value === 'any') {
      return data;
    }
    var filteredData = data.filter(filterCbToValue[value]);
    return filteredData;
  }

})();
