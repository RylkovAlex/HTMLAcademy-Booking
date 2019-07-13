'use strict';

(function () {
  var TOP_BORDER = 130;
  var LOWER_BORDER = 704;
  var PIN_MAIN_MARKER_TRANSLATE_Y = -6; // transform у псевдоэлемента, для вычисления точных размеров метки

  // Карта и параметры метки:
  var mapBlock = document.querySelector('.map');
  var pinMain = mapBlock.querySelector('.map__pin--main');
  var pinMainHeight = pinMain.offsetHeight + parseInt(getComputedStyle(pinMain, '::after').height, 10) + PIN_MAIN_MARKER_TRANSLATE_Y; // 81px
  var pinMainMoveContainer = document.querySelector('.map__pins');

  // границы области, внутри которой планируется перемещение:
  var lowerBorder = LOWER_BORDER - pinMainHeight;
  var rightBorder = pinMainMoveContainer.offsetWidth - pinMain.offsetWidth;

  // init startCoords
  var startCoords = {
    x: 0,
    y: 0,
  };

  pinMain.addEventListener('mousedown', pinMainMousedownHandler);

  // -------------------

  function pinMainMousedownHandler(mousedownEvt) {
    // подготовка к перемещению:
    pinMain.style.position = 'absolute';
    pinMain.style.zIndex = 2;
    // запомнили положение курсора
    startCoords.x = mousedownEvt.clientX;
    startCoords.y = mousedownEvt.clientY;
    // добавили обработчики мыши
    document.addEventListener('mousemove', buttonMoveHandler);
    document.addEventListener('mouseup', buttonMouseupHandler);
  }

  function buttonMouseupHandler() {
    // убираем обработчики
    document.removeEventListener('mousemove', buttonMoveHandler);
    document.removeEventListener('mouseup', buttonMouseupHandler);
  }

  function buttonMoveHandler(moveEvt) {
    moveEvt.preventDefault();
    // расчёт смещения курсора относительно начального положения
    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };
    // меняем координаты курсора на новые (текущие)
    startCoords.x = moveEvt.clientX;
    startCoords.y = moveEvt.clientY;
    // вычисляем новые координаты для пина
    var offsetTop = pinMain.offsetTop - shift.y;
    var offsetLeft = pinMain.offsetLeft - shift.x;
    // проверка по оси Y
    // если пин выше чем нам надо, то присваем координате Y верхнюю границу
    if (offsetTop < TOP_BORDER) {
      offsetTop = TOP_BORDER;
      // если ниже, то нижнюю
    } else if (offsetTop >= lowerBorder) {
      offsetTop = lowerBorder;
    }
    // аналогично для оси X
    if (offsetLeft > rightBorder) {
      offsetLeft = rightBorder;
    } else if (offsetLeft < 0) {
      offsetLeft = 0;
    }
    // отрисовка смещенея пина через стили
    pinMain.style.top = offsetTop + 'px';
    pinMain.style.left = offsetLeft + 'px';
  }

})();
