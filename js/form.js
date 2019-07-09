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
  var guestsInput = adForm.querySelector('#capacity');
  var guestsOptions = guestsInput.querySelectorAll('option');
  var submitButton = adForm.querySelector('.ad-form__submit');

  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    submitButton.disabled = true;
    var formData = new FormData(adForm);
    formData.delete('images');
    for (var i = 0; i < window.adFormPhotos.length; i++) {
      formData.append('images', window.adFormPhotos[i]);
    }
    window.backend.send(formData, formSuccessHandler, window.createErrorMessage);
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
    }, 1000);
  }

  // Обработчики на поля формы:
  houseTypeInput.addEventListener('change', checkPriceInput);
  timeIn.addEventListener('change', setTimeOutAsTimeIn);
  timeOut.addEventListener('change', setTimeInAsTimeOut);
  roomsInput.addEventListener('change', checkGuestsNumber);

  // проверяет соответсввие минимальной цены и типа жилья
  function checkPriceInput() {
    var minpriceToHouse = {
      'bungalo': '0',
      'flat': '1000',
      'house': '5000',
      'palace': '10000'
    };
    hosePriceInput.placeholder = minpriceToHouse[houseTypeInput.value];
    hosePriceInput.min = minpriceToHouse[houseTypeInput.value];
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

  // проверяет значение guestsInput в зависимости от roomsInput
  function checkGuestsNumber() {
    var guestsToRoom = {
      1: [1],
      2: [1, 2],
      3: [1, 2, 3],
      100: [0]
    };
    // выключаю все варианты выбора в guestsInput
    for (var i = 0; i < guestsOptions.length; i++) {
      guestsOptions[i].selected = false;
      guestsOptions[i].disabled = true;
    }
    // допустимые значения для guestsInput:
    var guestAllowableValues = guestsToRoom[roomsInput.value];
    // первое из них выбираю по умолчанию
    guestsInput.querySelector('[value=\'' + guestAllowableValues[0] + '\']').selected = true;
    // и разрешаю выбрать допустимые:
    guestAllowableValues.forEach(allowGuestOptions);

    function allowGuestOptions(item) {
      var option = guestsInput.querySelector('[value=\'' + item + '\']');
      option.disabled = false;
    }
  }
  window.checkGuestsNumber = checkGuestsNumber;
})();
