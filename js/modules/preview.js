'use strict';

const FILE_TYPES = [`gif`, `jpg`, `jpeg`, `png`];

let Photo = {
  WIDTH: 70,
  HEIGTH: 70,
  ALT: `Фотография жилья`
};

let form = window.main.adFormElement;

let fileChooserAvatar = form.querySelector(`.ad-form-header__upload input[type=file]`);
let previewAvatar = form.querySelector(`.ad-form-header__upload img`);
let defaultAvatar = previewAvatar.src;

let photoContainer = form.querySelector(`.ad-form__photo-container`);
let fileChooserPhotos = form.querySelector(`.ad-form__upload input[type=file]`);
let previewPhoto = form.querySelector(`.ad-form__photo`);

let previews = [];

let showPreview = function (element, preview) {
  let file = element.files[0];
  let fileName = file.name.toLowerCase();

  let matches = FILE_TYPES.some(function (it) {
    return fileName.endsWith(it);
  });

  if (matches) {
    let reader = new FileReader();

    reader.addEventListener(`load`, function () {
      preview(reader.result);
    });

    reader.readAsDataURL(file);
  }
};

fileChooserAvatar.addEventListener(`change`, function () {
  showPreview(fileChooserAvatar, function (image) {
    previewAvatar.src = image;
  });
});

fileChooserPhotos.addEventListener(`change`, function () {
  showPreview(fileChooserPhotos, createPhotoElement);
});

let createPhotoElement = function (src) {
  let element = document.createElement(`div`);
  element.classList.add(`ad-form__photo`);

  let photoElement = document.createElement(`img`);
  photoElement.src = src;
  photoElement.width = Photo.WIDTH;
  photoElement.height = Photo.HEIGTH;
  photoElement.alt = Photo.ALT;

  element.appendChild(photoElement);
  previews.push(element);
  photoContainer.insertBefore(element, previewPhoto);
};

let resetPreview = function () {
  if (previews) {
    previews.forEach(function (element) {
      element.remove();
    });
  }

  previews = [];
  previewAvatar.src = defaultAvatar;
};

window.preview = {
  resetPreview: resetPreview
};
