'use strict';

const FILE_TYPES = [`gif`, `jpg`, `jpeg`, `png`];

const Photo = {
  WIDTH: 70,
  HEIGTH: 70,
  ALT: `Фотография жилья`
};

const adFormElement = window.form.element.ad;

const fileChooserAvatar = adFormElement.querySelector(`.ad-form-header__upload input[type=file]`);
const previewAvatar = adFormElement.querySelector(`.ad-form-header__upload img`);
const defaultAvatar = previewAvatar.src;

const photoContainer = adFormElement.querySelector(`.ad-form__photo-container`);
const fileChooserPhotos = adFormElement.querySelector(`.ad-form__upload input[type=file]`);
const previewPhoto = adFormElement.querySelector(`.ad-form__photo`);

let previews = [];

const showPreview = function (element, preview) {
  const file = element.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some(function (it) {
    return fileName.endsWith(it);
  });

  if (matches) {
    let reader = new FileReader();

    reader.addEventListener(`load`, () => {
      preview(reader.result);
    });

    reader.readAsDataURL(file);
  }
};

fileChooserAvatar.addEventListener(`change`, () => {
  showPreview(fileChooserAvatar, function (image) {
    previewAvatar.src = image;
  });
});

fileChooserPhotos.addEventListener(`change`, () => {
  showPreview(fileChooserPhotos, createPhotoElement);
});

const createPhotoElement = function (src) {
  const element = document.createElement(`div`);
  element.classList.add(`ad-form__photo`);

  const photoElement = document.createElement(`img`);
  photoElement.src = src;
  photoElement.width = Photo.WIDTH;
  photoElement.height = Photo.HEIGTH;
  photoElement.alt = Photo.ALT;

  element.appendChild(photoElement);
  previews.push(element);
  photoContainer.insertBefore(element, previewPhoto);
};

const reset = function () {
  if (previews) {
    previews.forEach(function (element) {
      element.remove();
    });
  }

  previews = [];
  previewAvatar.src = defaultAvatar;
};

window.preview = {
  reset
};
