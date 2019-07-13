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
  // обработчик отправки
  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    submitButton.disabled = true;
    var formData = new FormData(adForm);
    formData.delete('images');
    window.adFormPhotos.forEach(function (it) {
      formData.append('images', it);
    });
    window.backend.send(formData, formSuccessHandler, window.createErrorMessage);
  });
  // обработчик успеха
  function formSuccessHandler() {
    var successMessage = document.querySelector('#success')
      .content.querySelector('.success')
      .cloneNode(true);
    successMessage.style.zIndex = 100;
    document.body.insertAdjacentElement('afterbegin', successMessage);
    document.addEventListener('click', removeSuccessMessage);
    document.addEventListener('keydown', successMessageEscHandler);
    function successMessageEscHandler(e) {
      window.util.isEscEvent(e, removeSuccessMessage);
    }
    function removeSuccessMessage() {
      successMessage.remove();
      submitButton.disabled = false;
      window.switchPageToInitialState();
      document.removeEventListener('click', removeSuccessMessage);
      document.removeEventListener('keydown', successMessageEscHandler);
    }
  }

  // Обработчики на поля формы:
  houseTypeInput.addEventListener('change', checkPriceInput);
  timeIn.addEventListener('change', function () {
    setOption1AsOption2(timeOutOptions, timeInOptions);
  });
  timeOut.addEventListener('change', function () {
    setOption1AsOption2(timeInOptions, timeOutOptions);
  });
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

  function setOption1AsOption2(options1, options2) {
    options2.forEach(function (it, i) {
      if (it.selected) {
        options1[i].selected = true;
      }
    });
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
    guestsOptions.forEach(function (option) {
      option.selected = false;
      option.disabled = true;
    });
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
