'use strict';

(function () {
  // Карта и параметры меток
  var TOP_BORDER = 130;
  var mapBlock = document.querySelector('.map');
  var pinMain = mapBlock.querySelector('.map__pin--main');
  var PIN_MAIN_MARKER_TRANSLATE_Y = -6; // transform у псевдоэлемента, для вычисления точных размеров метки
  var pinMainHeight = pinMain.offsetHeight + parseInt(getComputedStyle(pinMain, '::after').height, 10) + PIN_MAIN_MARKER_TRANSLATE_Y; // 81px
  var pinMainMoveContainer = document.querySelector('.map__pins');
  var pinMainMoveZone = window.util.getCoords(pinMainMoveContainer);

  pinMain.addEventListener('mousedown', function (mousedownEvt) {
    // текущие координаты метки:
    var pinMainCoords = window.util.getCoords(pinMain);
    // текущие координаты курсора
    var Coords = {
      x: mousedownEvt.clientX,
      y: mousedownEvt.clientY
    };
    // смещение курсора относительно левого-верхнего угла элемента
    var shiftX = mousedownEvt.clientX - pinMainCoords.left;
    var shiftY = mousedownEvt.clientY - pinMainCoords.top;
    // подготовка к перемещению
    pinMain.style.position = 'absolute';
    pinMain.style.zIndex = 10;
    // реализует перемещение
    function buttonMoveHandler(moveEvt) {
      window.wasPinMoved = true;
      moveEvt.preventDefault();
      // расчёт смещения
      var shift = {
        x: Coords.x - moveEvt.clientX,
        y: Coords.y - moveEvt.clientY
      };
      // границы области для перемещения
      if ((moveEvt.clientX > pinMainMoveZone.left + shiftX) &&
          (moveEvt.clientX < pinMainMoveZone.right - pinMain.offsetWidth + shiftX) &&
          (moveEvt.clientY < pinMainMoveZone.bottom - pinMainHeight + shiftY) &&
          (moveEvt.clientY > pinMainMoveZone.top + shiftY + TOP_BORDER)
      ) {
        // перезапись координат курсора
        Coords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };
        // перемещение элемента на вычисленное смещение
        pinMain.style.top = (pinMain.offsetTop - shift.y) + 'px';
        pinMain.style.left = (pinMain.offsetLeft - shift.x) + 'px';
        // запись координат метки в инпут
        window.writePinMainLocationToInput();
      }
    }

    // первое перемещение метки переводит страницу в активное состояние:
    function buttonStartMoveHandler() {
      window.switchPageToActiveState();
      document.removeEventListener('mousemove', buttonStartMoveHandler);
    }

    function buttonMouseUpHandler() {
      document.removeEventListener('mousemove', buttonMoveHandler);
      document.removeEventListener('mouseup', buttonMouseUpHandler);
      document.removeEventListener('mousemove', buttonStartMoveHandler);
    }

    document.addEventListener('mousemove', buttonMoveHandler);
    document.addEventListener('mousemove', buttonStartMoveHandler);
    document.addEventListener('mouseup', buttonMouseUpHandler);

  });

  pinMain.ondragstart = function () {
    return false;
  };

})();
