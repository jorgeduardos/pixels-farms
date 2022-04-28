function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function readyCookiesBanner() {
  const consentButton = document.querySelector('#cookies-button');
  if (consentButton) {
    consentButton.addEventListener('click', (event) => {
      document.querySelector('.js-cookies').classList.add('hidden');
      localStorage.setItem("cookies_banner", 1);
      setCookie('cookies_banner', 1, 7);
    });
  }
}



document.addEventListener('DOMContentLoaded', (event) => {
  if (localStorage.getItem("cookies_banner")) {
    if (document.querySelector('.js-cookies')) {
      document.querySelector('.js-cookies').parentElement.remove();
    }
  } else {
    setTimeout(function () {
      if (document.querySelector('.js-cookies')) {
        document.querySelector('.js-cookies').classList.remove('hidden')
        readyCookiesBanner();
      }
    }, 1000);
  }
});