'use strict';

(function () {
  // Карта и параметры меток
  var TOP_BORDER = 130;
  var mapBlock = document.querySelector('.map');
  var pinMain = mapBlock.querySelector('.map__pin--main');
  var PIN_MAIN_MARKER_TRANSLATE_Y = -6; // transform у псевдоэлемента, для вычисления точных размеров метки
  var pinMainHeight = pinMain.offsetHeight + parseInt(getComputedStyle(pinMain, '::after').height, 10) + PIN_MAIN_MARKER_TRANSLATE_Y; // 81px

  pinMain.addEventListener('mousedown', function (mousedownEvt) {
    // рассчёт координат контейнера, внутри которого планируется перемещение:
    var pinMainMoveContainer = document.querySelector('.map__pins');
    var pinMainMoveZone = window.util.getCoords(pinMainMoveContainer);
    // текущие координаты метки:
    var pinMainCoords = window.util.getCoords(pinMain);
    // начальные координаты курсора
    /* TODO: я не пойму, как их можно привязать к функции обработки перемещения, чтобы сделать её универсальной,
    здесь простая передача параметром не сработает */
    var cursorCoords = {
      x: mousedownEvt.clientX,
      y: mousedownEvt.clientY
    };
    // смещение курсора относительно левого-верхнего угла элемента
    var shiftX = mousedownEvt.clientX - pinMainCoords.left;
    var shiftY = mousedownEvt.clientY - pinMainCoords.top;
    // рассчёт границ области перемещения:
    pinMainMoveZone.left = pinMainMoveZone.left + shiftX;
    pinMainMoveZone.right = pinMainMoveZone.right - pinMain.offsetWidth + shiftX;
    pinMainMoveZone.bottom = pinMainMoveZone.bottom - pinMainHeight + shiftY;
    pinMainMoveZone.top = pinMainMoveZone.top + shiftY + TOP_BORDER;
    // подготовка к перемещению
    pinMain.style.position = 'absolute';
    pinMain.style.zIndex = 10;
    // функция для реализации перемещения:
    function moveElement(moveEvt, element, left, right, bottom, top) {
      moveEvt.preventDefault();
      // расчёт смещения курсора
      var shift = {
        x: cursorCoords.x - moveEvt.clientX,
        y: cursorCoords.y - moveEvt.clientY
      };
      // Если новое положение курсора попадает в границы области перемещения, то перемещаем метку:
      if ((moveEvt.clientX > left) &&
          (moveEvt.clientX < right) &&
          (moveEvt.clientY < bottom) &&
          (moveEvt.clientY > top)
      ) {
        // перемещение элемента на вычисленное смещение курсора
        element.style.top = (element.offsetTop - shift.y) + 'px';
        element.style.left = (element.offsetLeft - shift.x) + 'px';
        // перезапись стартовых координат курсора на новые, текущие
        cursorCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };
      }
    }

    // обработчик mousemove:
    function buttonMoveHandler(moveEvt) {
      moveElement(moveEvt, pinMain, pinMainMoveZone.left, pinMainMoveZone.right, pinMainMoveZone.bottom, pinMainMoveZone.top);
      window.writePinMainLocationToInput();
    }

    // первое перемещение метки переводит страницу в активное состояние:
    function buttonStartMoveHandler() {
      window.switchPageToActiveState();
      document.removeEventListener('mousemove', buttonStartMoveHandler);
    }

    function buttonMouseUpHandler() {
      // удаление обработчиков
      document.removeEventListener('mousemove', buttonMoveHandler);
      document.removeEventListener('mouseup', buttonMouseUpHandler);
      document.removeEventListener('mousemove', buttonStartMoveHandler);
    }

    document.addEventListener('mousemove', buttonMoveHandler);
    document.addEventListener('mousemove', buttonStartMoveHandler);
    document.addEventListener('mouseup', buttonMouseUpHandler);

  });

})();
