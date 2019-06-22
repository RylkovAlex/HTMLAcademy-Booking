'use strict';

(function () {
  // основная форма для создания объявления
  var adForm = document.querySelector('.ad-form');
  var adFormHeader = adForm.querySelector('.ad-form-header');
  var adFormFieldsets = adForm.querySelectorAll('.ad-form__pinMain');
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
  window.wasPinMoved = false;
  // Возвращает метку на начальные координаты
  function setPinMainDefaultPosition() {
    pinMain.style.left = pinMainDefaultX;
    pinMain.style.top = pinMainDefaultY;
  }
  // записывает координаты главной метки в input с адресом
  function writePinMainLocationToInput() {
    // вычислеие координат главной метки
    if (window.wasPinMoved) {
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

  window.writePinMainLocationToInput = writePinMainLocationToInput;

  // переход в исходное (неактивное состояние страницы)
  function switchPageToInitialState() {
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
    // Вставка в DOM фрагмента с метками:
    document.querySelector(' .map__pins').appendChild(window.getPinsFragment());
  }
  window.switchPageToActiveState = switchPageToActiveState;

  function startPage() {
    writePinMainLocationToInput();
    if (window.wasPinMoved) {
      switchPageToActiveState();
    }
  }

  startPage();
})();
