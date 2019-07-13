'use strict';

(function () {
  var mapBlock = document.querySelector('.map');
  var selectedPin;
  var lastSelectedPin;
  var pinCard;
  window.houseType = {
    'bungalo': 'Бунгало',
    'flat': 'Квартира',
    'house': 'Дом',
    'palace': 'Дворец'
  };

  // обработчик клика по карте
  mapBlock.addEventListener('click', mapBlockClickHandler);

  function mapBlockClickHandler(evt) {
    // смотрю куда вообще кликнули
    selectedPin = evt.target;
    if (selectedPin.tagName.toLowerCase() === 'img') {
      selectedPin = selectedPin.parentElement;
    }
    // если клик пришёлся на пин, то обрабатываю его:
    if (selectedPin.getAttribute('class') === 'map__pin') {
      // если какая-то карточка открыта, то убираю её
      if (pinCard) {
        pinCard.remove();
        lastSelectedPin.classList.remove('map__pin--active');
      }
      // нахожу данные по выбранному объявлению
      var cardData = window.adsDefaultData.filter(function (it) {
        return (it.location.x === selectedPin.locX && it.location.y === selectedPin.locY);
      })[0];
      // добавляю класс active выбранному пину
      selectedPin.classList.add('map__pin--active');
      lastSelectedPin = selectedPin;
      // готовлю под него карточку
      pinCard = renderCard(cardData);
      // вставляю её в DOM
      mapBlock.appendChild(pinCard);
      // вешаю обработчики на закрытие
      var closeButton = pinCard.querySelector('.popup__close');
      closeButton.addEventListener('click', closeCardPopUp);
      document.addEventListener('keydown', closeButtonEscHandler);
    }
    function closeCardPopUp() {
      lastSelectedPin.classList.remove('map__pin--active');
      closeButton.removeEventListener('click', closeCardPopUp);
      document.removeEventListener('keydown', closeButtonEscHandler);
      pinCard.remove();
    }

    function closeButtonEscHandler(e) {
      window.util.isEscEvent(e, closeCardPopUp);
    }
  }

  // создаёт новую карточку по шаблону и заполняет её содержимое
  function renderCard(data) {
    // карточка объявления по шаблону и её элементы:
    var card = document.querySelector('#card')
          .content.querySelector('.map__card')
          .cloneNode(true);
    var avatar = card.querySelector('.popup__avatar');
    var title = card.querySelector('.popup__title');
    var address = card.querySelector('.popup__text--address');
    var price = card.querySelector('.popup__text--price');
    var type = card.querySelector('.popup__type');
    var capacity = card.querySelector('.popup__text--capacity');
    var checkInOut = card.querySelector('.popup__text--time');
    var description = card.querySelector('.popup__description');
    // массив с данными по объектам карточки, который используется при её заполнении
    var cardFrame = [
      new CardElement(avatar, 'src', data.author.avatar),
      new CardElement(title, 'textContent', data.offer.title),
      new CardElement(address, 'textContent', data.offer.address),
      new CardElement(price, 'textContent', data.offer.price),
      new CardElement(type, 'textContent', data.offer.type),
      new CardElement(capacity, 'textContent', getCapacity()),
      new CardElement(description, 'textContent', data.offer.description),
      new CardElement(checkInOut, 'textContent', 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout)
    ];
    // Сам рендеринг содержимого:
    cardFrame.forEach(function (it) {
      setElementContent(it['element'], it['key'], it['elementData']);
    });
    getFeatures();
    getPhotos();
    return card;
    // ф-ия конструктор объектов карточки
    function CardElement(name, key, dataForRender) {
      this.element = name;
      this.key = key;
      this.elementData = dataForRender;
    }
    // определяет содержимое для блока capacity
    function getCapacity() {
      if (data.offer.rooms) {
        return (data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей');
      }
      return ('Комнат нет!');
    }
    // заполняет контентом элементы карточки
    function setElementContent(element, key, elementData) {
      if (elementData) {
        element[key] = elementData;
      } else {
        element.remove();
      }
    }
    // заполняет блок преимуществ у карточки
    function getFeatures() {
      var featuresNode = card.querySelector('.popup__features');
      var cardFeatures = [];
      var features = data.offer.features;
      if (features.length > 0) {
        features.forEach(function (item) {
          var selector = '.popup__feature--' + item;
          // создаю новый массив из тех элементов, которые есть в объявлении:
          cardFeatures.push(featuresNode.querySelector(selector));
        });
        // удаляю всех детей у featuresNode:
        while (featuresNode.firstChild) {
          featuresNode.removeChild(featuresNode.firstChild);
        }
        // вставляю в featuresNode элементы из массива cardFeatures
        cardFeatures.forEach(function (item) {
          featuresNode.appendChild(item);
        });
      } else {
        featuresNode.remove();
      }
    }
    // заполняет блок с фотографиями у карточки
    function getPhotos() {
      var photos = card.querySelector('.popup__photos');
      var photo = photos.querySelector('.popup__photo');
      if (data.offer.photos.length > 0) {
        photo.src = data.offer.photos[0];
        if (data.offer.photos.length > 1) {
          for (var i = 1; i < data.offer.photos.length; i++) {
            var newPhoto = photo.cloneNode(true);
            newPhoto.src = data.offer.photos[i];
            photos.appendChild(newPhoto);
          }
        }
      } else {
        photos.remove();
      }
    }
  }

})();
