'use strict';

(function () {
  // типы файлов:
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
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

  // превьюшка аватарке:
  avatar.addEventListener('change', function () {
    checkPhotosFile(avatar.files[0], function () {
      setDataUrlSrc(avatar.files[0], avatarImg);
    });
  });

  // превьюшки фотографиям жилья
  adsPhotos.addEventListener('change', function () {
    renderPhotos(adsPhotos.files);
  });

  // Drag-and-Drop документов:
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
    renderPhotos(evt.dataTransfer.files);
  }
  // TODO: исправить небольшой баг: если кидать файлы через инпут, то заглушка в разметке удаляется, а если через drag & drop, то остаётся

  function renderPhotos(files) {
    files.forEach = [].forEach;
    files.forEach(function (file) {
      // создаю новый узел с картинкой внутри
      var adsPhotoPreviewImg = document.createElement('img');
      adsPhotoPreviewImg.style = 'height: 70px; width: 70px';
      var newPhotoBox = adsPhotoPreview.cloneNode(true);
      newPhotoBox.classList.remove('visually-hidden');
      newPhotoBox.appendChild(adsPhotoPreviewImg);
      // прописываю src картинке
      var isError = checkPhotosFile(file, function () {
        window.adFormPhotos.push(file);
        setDataUrlSrc(file, newPhotoBox.firstChild);
      });
      // вставляю созданный узел в DOM
      if (!isError) {
        document.querySelector('.ad-form__photo-container').appendChild(newPhotoBox);
      }
    });
  }

  function checkPhotosFile(file, action) {
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
    if (matches) {
      action();
      return false;
    } else {
      window.createErrorMessage('Неправильный тип файла! Поддерживаемые форматы: gif, jpg, jpeg, png');
      return true;
    }
  }

  function setDataUrlSrc(file, img) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', function () {
      img.src = reader.result;
    });
  }
})();
