'use strict';
(function () {

  window.util = (function () {
    var ESC_KEYCODE = 27;
    var ENTER_KEYCODE = 13;

    return {
      // Возвращает случайное целое число между min (включительно) и max (не включая max)
      getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      },
      // action по нажатию на Esc
      isEscEvent: function (evt, action) {
        if (evt.keyCode === ESC_KEYCODE) {
          action();
        }
      },
      // action по нажатию на Enter
      isEnterEvent: function (evt, action) {
        if (evt.keyCode === ENTER_KEYCODE) {
          action();
        }
      },
      // вычисляет координаты элемента относительно страницы
      getCoords: function (elem) {
        var box = elem.getBoundingClientRect();
        return {
          top: box.top + pageYOffset,
          left: box.left + pageXOffset,
          right: box.left + pageXOffset + elem.offsetWidth,
          bottom: box.top + pageYOffset + elem.offsetHeight
        };
      },
      // случайная сортировка массива
      shuffle: function (arr) {
        var j;
        var temp;
        for (var i = arr.length - 1; i > 0; i--) {
          j = Math.floor(Math.random() * (i + 1));
          temp = arr[j];
          arr[j] = arr[i];
          arr[i] = temp;
        }
        return arr;
      }
    };
  })();

})();
