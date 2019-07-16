'use strict';

(function () {
  var PIN_MAIN_MARKER_TRANSLATE_Y = -6; // transform у псевдоэлемента, для вычисления точных размеров метки

  // основная форма для создания объявления
  var adForm = document.querySelector('.ad-form');
  var adFormHeader = adForm.querySelector('.ad-form-header');
  var adFormFieldsets = adForm.querySelectorAll('.ad-form__element');
  var adFormAddress = adForm.querySelector('#address');
  var adFormReset = adForm.querySelector('.ad-form__reset');
  // форма с фильтрами
  var filtersForm = document.querySelector('.map__filters');
  var filters = filtersForm.querySelectorAll('.map__filter');
  var features = filtersForm.querySelector('.map__features');
  // Карта и параметры меток
  var mapBlock = document.querySelector('.map');
  var pinMain = mapBlock.querySelector('.map__pin--main');
  var pinMainHeight = pinMain.offsetHeight + parseInt(getComputedStyle(pinMain, '::after').height, 10) + PIN_MAIN_MARKER_TRANSLATE_Y;
  var pinMainLocationX;
  var pinMainLocationY;
  var pinMainDefaultX = pinMain.style.left;
  var pinMainDefaultY = pinMain.style.top;
  window.isPageActive = false;

  // перевод страницы в начальноне состояние
  switchPageToInitialState();

  adFormReset.addEventListener('click', function () {
    setTimeout(function () {
      switchPageToInitialState();
    }, 100);
  });

  pinMain.addEventListener('mousedown', pinMainMousedownHandler);

  // ------------------

  // обработчик нужен, чтоб отследить первое перемещение метки:
  function pinMainMousedownHandler() {
    document.addEventListener('mousemove', writePinMainLocationToInput);
    document.addEventListener('mousemove', buttonStartMoveHandler);
    document.addEventListener('mouseup', function buttonMouseUpHandler() {
      document.removeEventListener('mousemove', buttonStartMoveHandler);
      document.removeEventListener('mousemove', writePinMainLocationToInput);
      document.removeEventListener('mouseup', buttonMouseUpHandler);
    });

    // первое перемещение метки переводит страницу в активное состояние:
    function buttonStartMoveHandler(e) {
      if (e.movementX !== 0 | e.movementY !== 0) {
        window.switchPageToActiveState();
        document.removeEventListener('mousemove', buttonStartMoveHandler);
      }
    }
  }
  // обработчик для активации страницы с клавиатуры
  function pinMainEnterHandler(e) {
    window.util.isEnterEvent(e, function () {
      document.addEventListener('keyup', function documentKeyUpHandler() {
        pinMain.blur();
        document.removeEventListener('keyup', documentKeyUpHandler);
        window.createErrorMessage('для загрузки похожих объявлений переместите метку!');
      });
    });
  }

  // возвращает метку на начальные координаты
  function setPinMainDefaultPosition() {
    pinMain.style.left = pinMainDefaultX;
    pinMain.style.top = pinMainDefaultY;
  }

  // записывает координаты главной метки в input с адресом
  function writePinMainLocationToInput() {
    // вычислеие координат главной метки
    pinMainLocationX = Math.floor(pinMain.offsetLeft + pinMain.offsetWidth / 2);
    pinMainLocationY = (window.isPageActive) ?
      Math.floor(pinMain.offsetTop + pinMainHeight) :
      Math.floor(pinMain.offsetTop + pinMain.offsetHeight / 2);
    // запись в инпут
    adFormAddress.value = pinMainLocationX + ',' + pinMainLocationY;
  }

  // переход в исходное (неактивное состояние страницы)
  function switchPageToInitialState() {
    window.adsDefaultData = undefined;
    window.isPageActive = false;
    window.adFormPhotos = [];
    setPinMainDefaultPosition();
    // убираю пины
    window.deletePins();
    // убираю карточку
    if (document.querySelector('.map__card')) {
      document.querySelector('.map__card').remove();
    }
    adFormHeader.disabled = true;
    function setDisabledTrue(it) {
      it.disabled = true;
    }
    adFormFieldsets.forEach(setDisabledTrue);
    filters.forEach(setDisabledTrue);
    adForm.reset();
    filtersForm.reset();
    features.disabled = true;
    // возвращаю в первоначальный вид поля с фотографиями жилья и аватаркой
    adForm.querySelector('.ad-form-header__preview img').src = 'img/muffin-grey.svg';

    var adsPhotos = adForm.querySelectorAll('.ad-form__photo');
    var adsPhotosInput = adForm.querySelector('#images');
    adsPhotos[0].classList.remove('visually-hidden');
    // обработчик нужен, чтоб удалить пустышку при загрузке фоток в форму
    adsPhotosInput.addEventListener('change', function firstChangeHandler() {
      adsPhotos[0].classList.add('visually-hidden');
      adsPhotosInput.removeEventListener('change', firstChangeHandler);
    });
    if (adsPhotos[0].firstChild) {
      adsPhotos[0].firstChild.remove();
    }
    for (var i = 1; i < adsPhotos.length; i++) {
      adsPhotos[i].remove();
    }
    //
    writePinMainLocationToInput();
    //
    mapBlock.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    //
    pinMain.addEventListener('keydown', pinMainEnterHandler);
  }
  window.switchPageToInitialState = switchPageToInitialState;

  // переход в акивное состояние страницы
  function switchPageToActiveState() {
    window.isPageActive = true;
    adFormHeader.disabled = false;
    function setDisabledFalse(it) {
      it.disabled = false;
    }
    adFormFieldsets.forEach(setDisabledFalse);
    filters.forEach(setDisabledFalse);
    features.disabled = false;
    //
    mapBlock.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    window.checkGuestsNumber();
    //
    pinMain.removeEventListener('keydown', pinMainEnterHandler);
  }
  window.switchPageToActiveState = switchPageToActiveState;

})();
