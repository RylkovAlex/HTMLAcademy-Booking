'use strict';

(function () {
  // основная форма для создания объявления
  var adForm = document.querySelector('.ad-form');
  var adFormHeader = adForm.querySelector('.ad-form-header');
  var adFormFieldsets = adForm.querySelectorAll('.ad-form__element');
  var adFormAddress = adForm.querySelector('#address');
  // форма с фильтрами
  var filtersForm = document.querySelector('.map__filters');
  var filters = filtersForm.querySelectorAll('.map__filter');
  var features = filtersForm.querySelector('.map__features');
  // Карта и параметры меток
  var mapBlock = document.querySelector('.map');
  var pinMain = mapBlock.querySelector('.map__pin--main');
  var PIN_MAIN_MARKER_TRANSLATE_Y = -6; // transform у псевдоэлемента, для вычисления точных размеров метки
  var pinMainHeight = pinMain.offsetHeight + parseInt(getComputedStyle(pinMain, '::after').height, 10) + PIN_MAIN_MARKER_TRANSLATE_Y;
  var pinMainLocationX;
  var pinMainLocationY;
  var pinMainDefaultX = pinMain.style.left;
  var pinMainDefaultY = pinMain.style.top;
  window.isPageActive = false;

  switchPageToInitialState();

  // запись координат в инпут ещё до перевода страницы в активное состояние:
  writePinMainLocationToInput();

  pinMain.addEventListener('mousedown', function () {
    document.addEventListener('mousemove', buttonMoveHandler);

    // первое перемещение метки переводит страницу в активное состояние:
    document.addEventListener('mousemove', buttonStartMoveHandler);

    document.addEventListener('mouseup', function buttonMouseUpHandler() {
      document.removeEventListener('mousemove', buttonStartMoveHandler);
      document.removeEventListener('mousemove', buttonMoveHandler);
      document.removeEventListener('mouseup', buttonMouseUpHandler);
    });

    function buttonMoveHandler() {
      writePinMainLocationToInput();
    }

    // первое перемещение метки:
    function buttonStartMoveHandler() {
      window.switchPageToActiveState();
      document.removeEventListener('mousemove', buttonStartMoveHandler);
    }
  });

  // Далее вспомогательные функции:

  // Возвращает метку на начальные координаты
  function setPinMainDefaultPosition() {
    pinMain.style.left = pinMainDefaultX;
    pinMain.style.top = pinMainDefaultY;
  }

  // записывает координаты главной метки в input с адресом
  function writePinMainLocationToInput() {
    // вычислеие координат главной метки
    if (window.isPageActive) {
      pinMainLocationX = Math.floor(pinMain.offsetLeft + pinMain.offsetWidth / 2);
      pinMainLocationY = Math.floor(pinMain.offsetTop + pinMainHeight);
    } else {
      setPinMainDefaultPosition();
      pinMainLocationX = Math.floor(pinMain.offsetLeft + pinMain.offsetWidth / 2);
      pinMainLocationY = Math.floor(pinMain.offsetTop + pinMain.offsetHeight / 2);
    }
    // запись в инпут
    adFormAddress.value = pinMainLocationX + ',' + pinMainLocationY;
  }

  // переход в исходное (неактивное состояние страницы)
  function switchPageToInitialState() {
    window.isPageActive = false;
    adFormHeader.disabled = true;
    for (var i = 0; i < adFormFieldsets.length; i++) {
      adFormFieldsets[i].disabled = true;
    }
    //
    features.disabled = true;
    for (i = 0; i < filters.length; i++) {
      filters[i].disabled = true;
    }
    //
    mapBlock.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
  }
  window.switchPageToInitialState = switchPageToInitialState;

  // переход в акивное состояние страницы
  function switchPageToActiveState() {
    window.isPageActive = true;
    adFormHeader.disabled = false;
    for (var i = 0; i < adFormFieldsets.length; i++) {
      adFormFieldsets[i].disabled = false;
    }
    //
    features.disabled = false;
    for (i = 0; i < filters.length; i++) {
      filters[i].disabled = false;
    }
    //
    mapBlock.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
  }
  window.switchPageToActiveState = switchPageToActiveState;

})();
