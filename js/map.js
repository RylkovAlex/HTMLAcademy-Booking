'use strict';

(function () {
  // Карта и параметры меток
  var TOP_BORDER = 130;
  var mapBlock = document.querySelector('.map');
  var pinMain = mapBlock.querySelector('.map__pin--main');
  // TODO: понять как получать translate из CSS
  var PIN_MAIN_MARKER_TRANSLATE_Y = -6; // transform у псевдоэлемента, для вычисления точных размеров метки
  var pinMainHeight = pinMain.offsetHeight + parseInt(getComputedStyle(pinMain, '::after').height, 10) + PIN_MAIN_MARKER_TRANSLATE_Y; // 81px
  var pinMainMoveContainer = document.querySelector('.map__pins');

  pinMain.addEventListener('mousedown', function (mousedownEvt) {
    moveElement(mousedownEvt, pinMain, pinMainMoveContainer);
  });

  // Вспомогательные функции:

  function moveElement(mousedownEvt, element, zone) {
    // рассчёт координат контейнера, внутри которого планируется перемещение:
    var moveZone = window.util.getCoords(zone);
    // текущие координаты метки:
    var elementCoords = window.util.getCoords(element);
    // начальные координаты курсора
    /* TODO: я не пойму, как их можно привязать к функции обработки перемещения, чтобы сделать её универсальной, здесь простая передача параметром не сработает, нужно как-то через замыкание делать;
    пробовал использовать вместо этих координат .movementX и Y внутри обработчика mousemove, но тогда будут
    проблемы на границах... в общем пока так оставил, буду думать*/
    var cursorCoords = {
      x: mousedownEvt.clientX,
      y: mousedownEvt.clientY
    };
    // смещение курсора относительно левого-верхнего угла элемента
    var shiftX = mousedownEvt.clientX - elementCoords.left;
    var shiftY = mousedownEvt.clientY - elementCoords.top;
    // рассчёт границ области перемещения:
    moveZone.left = moveZone.left + shiftX;
    moveZone.right = moveZone.right - pinMain.offsetWidth + shiftX;
    moveZone.bottom = moveZone.bottom - pinMainHeight + shiftY;
    moveZone.top = moveZone.top + shiftY + TOP_BORDER;
    // подготовка к перемещению
    element.style.position = 'absolute';
    element.style.zIndex = 10;

    document.addEventListener('mousemove', buttonMoveHandler);
    document.addEventListener('mouseup', buttonMouseUpHandler);

    // функция для реализации перемещения:
    function changeElementPosition(moveEvt, elem, left, right, bottom, top) {
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
        elem.style.top = (elem.offsetTop - shift.y) + 'px';
        elem.style.left = (elem.offsetLeft - shift.x) + 'px';
        // перезапись стартовых координат курсора на новые, текущие
        cursorCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };
      }
    }

    // обработчик mousemove:
    function buttonMoveHandler(moveEvt) {
      changeElementPosition(moveEvt, pinMain, moveZone.left, moveZone.right, moveZone.bottom, moveZone.top);
    }
    // обработчик mouseUp
    function buttonMouseUpHandler() {
      // удаление обработчиков
      document.removeEventListener('mousemove', buttonMoveHandler);
      document.removeEventListener('mouseup', buttonMouseUpHandler);
    }
  }

})();
