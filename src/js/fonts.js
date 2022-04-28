const FontFaceObserver = require('fontfaceobserver');
const mainFont = new FontFaceObserver('font-name');

Promise.all([mainFont.load()]).then(function () {
  document.querySelector('html').classList.add('fonts-loaded');
});