'use strict';

window.backend = (function () {
  var POST_URL = 'https://js.dump.academy/keksobooking';
  var GET_URL = 'https://js.dump.academy/keksobooking/data';
  var TIME_OUT = 10000; // 10s

  return {
    load: function (onLoad, onError) {
      var xhr = createJsonXhr();
      addXhrListeners(xhr, onLoad, onError);
      xhr.open('GET', GET_URL);
      xhr.send();
    },

    send: function (data, onLoad, onError) {
      var xhr = createJsonXhr();
      addXhrListeners(xhr, onLoad, onError);
      xhr.open('POST', POST_URL);
      xhr.send(data);
    }
  };

  function createJsonXhr() {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    return xhr;
  }

  function addXhrListeners(xhr, action, errorAction) {
    xhr.addEventListener('load', function () {
      var errorMessage;
      switch (xhr.status) {
        case 200:
          action(xhr.response);
          break;
        case 400:
          errorMessage = 'Неверный запрос на сервер';
          break;
        case 401:
          errorMessage = 'Пользователь не авторизован';
          break;
        case 404:
          errorMessage = 'Запрашиваемый ресурс не найден';
          break;
        default:
          errorMessage = 'Статус ответа: ' + xhr.status + ' ' + xhr.statusText;
      }
      if (errorMessage) {
        errorAction(errorMessage);
        throw new Error('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      errorAction('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      errorAction('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIME_OUT;
  }

})();
