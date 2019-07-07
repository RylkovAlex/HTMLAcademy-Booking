'use strict';

(function () {
  // основная форма для создания объявления
  var adForm = document.querySelector('.ad-form');
  // поля формы для загрузки файлов:
  // аватар
  var avatar = adForm.querySelector('#avatar');
  var avatarImg = adForm.querySelector('.ad-form-header__preview img');
  // фото объявлений
  var adsPhotos = adForm.querySelector('#images');
  adsPhotos.multiple = true;
  var adsPhotoPreview = adForm.querySelector('.ad-form__photo');
  // типы файлов:
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  avatar.addEventListener('change', function () {
    setDataUrlSrc(avatar, 0, avatarImg);
  });

  adsPhotos.addEventListener('change', function () {
    renderPhotos(adsPhotos.files);
  });

  // --------- попробую реализовать Drag-and-Drop документов:
  var dropZone = adForm.querySelector('.ad-form__drop-zone');

  dropZone.addEventListener('dragover', function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  });
  dropZone.addEventListener('drop', filesDropHandler);
  function filesDropHandler(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    // TODO: как эти файлы передать внутрь adsPhotos, да ёщё так чтоб там сработало событие change
    // var files = evt.dataTransfer.files;
  }

  // ---------

  function renderPhotos(files) {
    for (var i = 0; i < files.length; i++) {
      // создаю новый узел с картинкой внутри
      var adsPhotoPreviewImg = document.createElement('img');
      adsPhotoPreviewImg.style = 'height: 70px; width: 70px';
      var newPhotoBox = adsPhotoPreview.cloneNode(true);
      newPhotoBox.classList.remove('visually-hidden');
      newPhotoBox.appendChild(adsPhotoPreviewImg);
      // прописываю src картинке
      setDataUrlSrc(adsPhotos, i, newPhotoBox.firstChild);
      // вставляю созданный узел в DOM
      document.querySelector('.ad-form__photo-container').appendChild(newPhotoBox);
    }
  }

  function setDataUrlSrc(fileInput, fileNumber, img) {
    var file = fileInput.files[fileNumber];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.addEventListener('load', function () {
        img.src = reader.result;
      });
    } else {
      throw new Error('Неправильный тип файла! Поддерживаемые форматы: gif, jpg, jpeg, png');
    }
  }


})();
