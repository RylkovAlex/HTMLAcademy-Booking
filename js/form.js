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
    }, 1000);
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
  // проверяет значение guestsInput в зависимости от roomsInput
  // TODO: коряво, но пока не знаю, как сделать лучше:
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
    // смотрю, какое кол-во комнат выбрано в roomsInput
    var selectedRoom = roomsInput.value;
    // разрешенные значения для guestsInput:
    var guestAllowableValues = guestsToRoom[selectedRoom];
    // первое из них выбираю по умолчанию
    guestsInput.querySelector('[value=\'' + guestAllowableValues[0] + '\']').selected = true;
    // остальные разрешаю выбрать:
    guestAllowableValues.forEach(allowGuestOptions);

    function allowGuestOptions(item) {
      var option = guestsInput.querySelector('[value=\'' + item + '\']');
      option.disabled = false;
    }
  }
  window.checkGuestsNumber = checkGuestsNumber;
})();
