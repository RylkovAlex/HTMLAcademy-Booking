'use strict';

(function () {
  var mapBlock = document.querySelector('.map');
  var selectedPin;
  var pinCard;
  window.houseType = {
    'bungalo': 'Бунгало',
    'flat': 'Квартира',
    'house': 'Дом',
    'palace': 'Дворец'
  };

  mapBlock.addEventListener('click', function (evt) {
    // если уже была выбрана, то удаляю ей класс active
    if (selectedPin) {
      selectedPin.classList.remove('map__pin--active');
    }
    // если какая-то карточка открыта, то убираю её
    if (pinCard) {
      pinCard.remove();
    }
    // смотрю куда кликнули
    selectedPin = evt.target;
    if (selectedPin.tagName.toLowerCase() === 'img') {
      selectedPin = selectedPin.parentElement;
    }
    // если клик пришёлся на пин, то обрабатываю его:
    if (selectedPin.getAttribute('class') === 'map__pin') {
      // нахожу данные по выбранному объявлению
      var cardData = window.adsDefaultData.filter(function (it) {
        return (it.location.x === selectedPin.locX && it.location.y === selectedPin.locY);
      })[0];
      // добавляю класс active выбранному пину
      selectedPin.classList.add('map__pin--active');
      // готовлю под него карточку
      pinCard = renderCard(cardData);
      console.log(cardData);
      // вставляю её в DOM
      mapBlock.appendChild(pinCard);
    }
  });

  function renderCard(data) {
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

    if (data.author.avatar) {
      avatar.src = data.author.avatar;
    } else {
      avatar.remove();
    }

    if (data.offer.title) {
      title.textContent = data.offer.title;
    } else {
      title.remove();
    }

    if (data.offer.address) {
      address.textContent = data.offer.address;
    } else {
      address.remove();
    }

    if (data.offer.price) {
      price.textContent = data.offer.price + '₽/ночь';
    } else {
      price.remove();
    }

    if (data.offer.type) {
      type.textContent = window.houseType[data.offer.type];
    } else {
      type.remove();
    }

    if (data.offer.rooms > 0) {
      capacity.textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
    } else {
      capacity.remove();
    }

    if (data.offer.description) {
      description.textContent = data.offer.description;
    } else {
      description.remove();
    }

    checkInOut.textContent = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout;
    getFeatures();
    getPhotos();

    return card;

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
