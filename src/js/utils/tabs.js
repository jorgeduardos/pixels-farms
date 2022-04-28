import { gsap, Elastic } from 'gsap';
const controls = document.querySelectorAll('.faq-control');

function openTab(panelChild) {
  gsap.to(panelChild, { height: 'auto', duration: .3, delay: .1 });
}

function closeTab(panelChild) {
  gsap.to(panelChild, {
    height: 0, duration: .3, onComplete: () => {
      panelChild.parentElement.setAttribute('aria-hidden', true);
    }
  });
}

if (controls) {
  controls.forEach(function (control) {
    let button = control.firstElementChild;
    let panel = control.nextElementSibling;

    button.addEventListener('click', (event) => {
      control.classList.toggle('open');
      let panelExpanded = control.classList.value.includes('open');
      button.setAttribute('aria-expanded', panelExpanded);

      if (panelExpanded) {
        panel.removeAttribute('aria-hidden');
        openTab(panel.firstElementChild);
      } else {
        closeTab(panel.firstElementChild);
      }
    });
  });
}