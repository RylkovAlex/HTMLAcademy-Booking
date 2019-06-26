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
  var roomsInput = adForm.querySelector('#room_number');
  var roomsOptions = roomsInput.querySelectorAll('option');
  var guestsInput = adForm.querySelector('#capacity');
  var guestsOptions = guestsInput.querySelectorAll('option');
  var submitButton = adForm.querySelector('.ad-form__submit');

  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    submitButton.disabled = true;
    window.backend.send(new FormData(adForm), formSuccessHandler, window.createErrorMessage);
  });

  function formSuccessHandler() {
    var successMessage = document.querySelector('#success')
      .content.querySelector('.success')
      .cloneNode(true);
    document.body.insertAdjacentElement('afterbegin', successMessage);
    setTimeout(function () {
      successMessage.remove();
      submitButton.disabled = false;
      window.switchPageToInitialState();
    }, 700);
  }

  // Обработчики на поля формы:
  houseTypeInput.addEventListener('change', checkPriceInput);
  timeIn.addEventListener('change', setTimeOutAsTimeIn);
  timeOut.addEventListener('change', setTimeInAsTimeOut);
  roomsInput.addEventListener('change', checkGuestsNumber);

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
  // TODO: здесь пока говнокод, надо ещё подумать...
  function checkGuestsNumber() {
    for (i = 0; i < guestsOptions.length; i++) {
      guestsOptions[i].selected = false;
      guestsOptions[i].disabled = true;
    }
    for (var i = 0; i < roomsOptions.length; i++) {
      if (roomsOptions[i].selected) {
        var roomValue = roomsOptions[i].value;
      }
    }
    if (roomValue === '100') {
      guestsOptions[guestsOptions.length - 1].disabled = false;
      guestsOptions[guestsOptions.length - 1].selected = true;
    } else {
      for (i = 0; i < guestsOptions.length; i++) {
        if (guestsOptions[i].value === roomValue) {
          guestsOptions[i].selected = true;
        }
        if (guestsOptions[i].value > roomValue | guestsOptions[i].value === '0') {
          guestsOptions[i].disabled = true;
        } else {
          guestsOptions[i].disabled = false;
        }
      }
    }
  }
  window.checkGuestsNumber = checkGuestsNumber;


})();
