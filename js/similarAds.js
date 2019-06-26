'use strict';
/* всё, что ниже пока просто задел на будущее по ТЗ: */

(function () {
  var mapBlock = document.querySelector('.map');
  var selectedPin;
  var card = document.querySelector('#card')
      .content.querySelector('.map__card')
      .cloneNode(true);

  mapBlock.addEventListener('click', function (evt) {
    if (selectedPin) {
      selectedPin.classList.remove('map__pin--active');
    }
    selectedPin = evt.target;
    if (selectedPin.tagName.toLowerCase() === 'img') {
      selectedPin = selectedPin.parentElement;
    }
    if (selectedPin.getAttribute('class') === 'map__pin') {
      removeCard();
      selectedPin.classList.add('map__pin--active');
      showCard();
    }
  });

  function showCard() {
    mapBlock.appendChild(card);
  }

  function removeCard() {
    card.remove();
  }
})();
