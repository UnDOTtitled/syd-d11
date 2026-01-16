import 'focus-visible'
import FocusWithin from 'focus-within'
import zenscroll from 'zenscroll'
import LazyLoad from 'vanilla-lazyload'
import toggleDataAttr from './utils/toggleDataAttr'
import 'van11y-accessible-accordion-aria'
import baguetteBox from 'baguettebox.js'
// import ModalFocusTrap from './classes/ModalFocusTrap';
import YouTubePlayer, { YouTubePlayerOptions } from './classes/YtPlayer';
import SlickSlider from './classes/SlickSlider'; // Assuming SlickSlider.ts is in the same directory

//import Choices from 'choices.js';

/**
 * Focus within polyfill
 */
FocusWithin(document, {
  attr: false,
  className: 'focus-within',
})

/*
  Better <select> elements
  url: https://www.npmjs.com/package/choices.js
  -----------------------------------------------

  Usage:
  Selects all <select> elements by default

  Note: If not using, remove @import "../../node_modules/choices.js/assets/styles/scss/choices"; from `assets/sass/global.scss`
*/
// if (document.querySelectorAll('select').length > 0) {
//   const selectElements = new Choices('select');
// }

/*
  Image galleries
  url: https://www.npmjs.com/package/flickity
  -----------------------------------------------

  Usage:
  <div class="gallery">
      <a href="path-to-large-image" data-caption="">
          <img src="path-to-thumbnail" alt="" />
      </a>
  </div>

  Note: If not using, remove @import "../../node_modules/baguettebox.js/src/baguetteBox"; from `assets/sass/global.scss`
*/

if (document.querySelectorAll('.gallery')) {
  baguetteBox.run('.gallery')
}

/*
  Menu burger
*/
const menuBurgerBtn = document.querySelector('.a-nav-toggle')

function toggleNav() {
  toggleDataAttr(document.body, 'nav', 'open', 'closed')
}

if (menuBurgerBtn) {
  menuBurgerBtn.addEventListener('click', toggleNav)
}

/*
  Automatically set external links to have nofollow/noopener attrs
*/
const links = document.querySelectorAll('a')

links.forEach(link => {
  if (link.hostname != window.location.hostname) {
    link.setAttribute('rel', 'nofollow noopener')
  }
})

// LazyLoad
const lazyLoadImages = new LazyLoad()

/*
  Zenscroll
  - Set edge offset to 0 to prevnet breaking tab order
*/
zenscroll.setup(null, 0)


/*
  Skip to next
  
  Example of usage:

  <a href="javascript:void(0)" class="screen-readers js-skip-to-next" >
    <span class="screen-readers">Skip the {{ content.title[0]["#context"].value }} section</span>
  </a>
  
*/

const skipToNexts = document.querySelectorAll('.js-skip-to-next');

skipToNexts.forEach(skipToNext => {

  const eckWrapper = skipToNext.nextElementSibling as HTMLElement;

  skipToNext.addEventListener("click", () => {

    if (eckWrapper) {
      const focusableElements = eckWrapper.querySelectorAll(
        'a, button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), td > div'
      );

      focusableElements.forEach(focusableElement => {
        focusableElement.setAttribute("tabindex", "-1");
      })
    }
  });
  
});


/*
  ModalFocusTrap

const ModalContainers = document.querySelectorAll('.js-popup-modal');

if (ModalContainers) {
  ModalContainers.forEach((ModalContainer: HTMLElement) => {
    new ModalFocusTrap(ModalContainer);
  })
}

*/



/* 
*
Initiate Slider
*
*/
const slickSlider = new SlickSlider();



/* 
*
Initiate Youtube Api
*
*/
const videoId = document.querySelector('#ytplayer')?.getAttribute(`data-videoId`).substring(0, 11);

if (videoId) {
  const options: YouTubePlayerOptions = {
    height: '360',
    width: '640',
    videoId: videoId,
    playerVars: {
      autoplay: 1,
      controls: 0,
      showinfo: 0,
      loop: 1,
      mute: 1,
      rel: 1,
      playlist: videoId,
    },
  };

  const youTubePlayer = new YouTubePlayer(videoId, options);
}