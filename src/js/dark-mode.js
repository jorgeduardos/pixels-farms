// ************************************** //
//              DARK MODE                 //
// ************************************** //
let darkModeState = false;

const inputDark = document.getElementById("dark-mode");

// MediaQueryList object
const useDark = window.matchMedia("(prefers-color-scheme: dark)");

// Toggles the "dark-mode" class
function toggleDarkMode(state) {
  document.documentElement.classList.toggle("dark-mode", state);
  darkModeState = state;
  inputDark.checked = darkModeState;
}

// Sets localStorage state
function setDarkModeLocalStorage(state) {
  localStorage.setItem("dark-mode", state);
}

// Initial setting
if(localStorage.getItem("dark-mode") == null || localStorage.getItem("dark-mode") == undefined){
    toggleDarkMode(useDark.matches);
    setDarkModeLocalStorage(darkModeState);

    console.log('dark mode: ', darkModeState)
}else{
    toggleDarkMode((localStorage.getItem("dark-mode")) === 'true');

    console.log('dark mode: ', darkModeState)
}

// Listen for changes in the OS settings.
// Note: the arrow function shorthand works only in modern browsers, 
// for older browsers define the function using the function keyword.

useDark.addEventListener('change', (evt) => toggleDarkMode(evt.matches));

// Toggles the "dark-mode" class on click and sets localStorage state
inputDark.addEventListener("click", () => {
  darkModeState = !darkModeState;

  toggleDarkMode(darkModeState);
  setDarkModeLocalStorage(darkModeState);

  console.log('dark mode: ', darkModeState)
});
