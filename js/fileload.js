'use strict';

(function () {
  // основная форма для создания объявления
  var adForm = document.querySelector('.ad-form');
  // поля формы для загрузки файлов:
  var avatar = adForm.querySelector('#avatar');
  var avatarImg = adForm.querySelector('.ad-form-header__preview img');
  //
  var adsPhotos = adForm.querySelector('#images');
  adsPhotos.multiple = true;
  var adsPhotoPreview = adForm.querySelector('.ad-form__photo');
  // типы файлов:
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  avatar.addEventListener('change', function () {
    setDataUrlSrc(avatar, 0, avatarImg);
  });

  adsPhotos.addEventListener('change', function () {
    for (var i = 0; i < adsPhotos.files.length; i++) {
      var adsPhotoPreviewImg = document.createElement('img');
      adsPhotoPreviewImg.style = 'height: 70px; width: 70px';
      var newPhotoBox = adsPhotoPreview.cloneNode(true);
      newPhotoBox.classList.remove('visually-hidden');
      newPhotoBox.appendChild(adsPhotoPreviewImg);
      setDataUrlSrc(adsPhotos, i, newPhotoBox.firstChild);
      document.querySelector('.ad-form__photo-container').appendChild(newPhotoBox);
    }

    /*     var adsPhotoPreviewImg = document.createElement('img');
    adsPhotoPreviewImg.style = 'height: 70px; width: 70px';
    adsPhotoPreview.appendChild(adsPhotoPreviewImg);
    setDataUrlSrc(adsPhotos, 0, adsPhotoPreviewImg);

    if (adsPhotos.files.length > 1) {
      for (var i = 1; i < adsPhotos.files.length; i++) {
        var newPhoto = adsPhotoPreview.cloneNode(true);
        setDataUrlSrc(adsPhotos, i, newPhoto.firstChild);
        document.querySelector('.ad-form__photo-container').appendChild(newPhoto);
      }
    } */
  });

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
