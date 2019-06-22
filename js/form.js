'use strict';

(function () {
  // основная форма для создания объявления
  var adForm = document.querySelector('.ad-form');
  // поля формы
  var houseTypeInput = adForm.querySelector('#type');
  var hosePriceInput = adForm.querySelector('#price');
  var timeIn = adForm.querySelector('#timein');
  var timeOut = adForm.querySelector('#timeout');
  var timeInOptions = timeIn.querySelectorAll('option');
  var timeOutOptions = timeOut.querySelectorAll('option');

  var houseTypes = [
    {
      type: 'bungalo',
      minPrice: '0'
    },
    {
      type: 'flat',
      minPrice: '1000'
    },
    {
      type: 'house',
      minPrice: '5000'
    },
    {
      type: 'palace',
      minPrice: '10000'
    }
  ];

  // в зависимости от типа жилья меняет мин.цену и плейсхолдер
  function checkPriceInput() {
    for (var i = 0; i < houseTypes.length; i++) {
      if (houseTypes[i].type === houseTypeInput.value) {
        hosePriceInput.placeholder = houseTypes[i].minPrice;
        hosePriceInput.min = houseTypes[i].minPrice;
      }
    }
  }
  // синхронизирует время заезда и выезда
  function setTimeOutAsTimeIn() {
    for (var i = 0; i < timeInOptions.length; i++) {
      if (timeInOptions[i].selected) {
        timeOutOptions[i].selected = true;
      }
    }
  }
  // синхронизирует время вызда и заезда
  function setTimeInAsTimeOut() {
    for (var i = 0; i < timeOutOptions.length; i++) {
      if (timeOutOptions[i].selected) {
        timeInOptions[i].selected = true;
      }
    }
  }

  // Обработчики на поля формы:
  houseTypeInput.addEventListener('change', checkPriceInput);
  timeIn.addEventListener('change', setTimeOutAsTimeIn);
  timeOut.addEventListener('change', setTimeInAsTimeOut);
})();
