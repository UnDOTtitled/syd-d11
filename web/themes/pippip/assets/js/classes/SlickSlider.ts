// @ts-nocheck - because the jquery usage isnt competible with ts
import 'slick-carousel';
import $ from 'jquery';
import toggleDataAttr from '../utils/toggleDataAttr';

class SlickSlider {
  private mobileSlider: HTMLElement | null;
  private desktopSlider: HTMLElement | null;

  constructor() {
    this.mobileSlider = document.querySelector('.js-mobile-slider');
    this.desktopSlider = document.querySelector('.js-desktop-slider');
    this.toggleDataAttr = toggleDataAttr;

    console.log('SlickSlider');

    if (this.mobileSlider) {
      this.initMobileSlider();
    }

    if (this.desktopSlider) {
      this.initDesktopSlider();
      this.initDesktopSliderPause();
    }
  }

  private initMobileSlider() {
    if (window.innerWidth < 768) {
      $(this.mobileSlider).slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: false,
        prevArrow: "<button type='button' class='slick-prev pull-left'><img src='/themes/pippip/dist/img/icon-arrow-black-left.svg' alt='Left Arrow'></button>",
        nextArrow: "<button type='button' class='slick-next pull-right'><img src='/themes/pippip/dist/img/icon-arrow-black-right.svg' alt='Right Arrow'></button>",
        mobileFirst: true,
        responsive: [
          {
            breakpoint: 767,
            settings: "unslick"
          }
        ]
      });
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth < 768) {
        $(this.mobileSlider).slick('slickSetOption', 'responsive', [
          {
            breakpoint: 767,
            settings: "unslick"
          }
        ], true);
      }
    });
  }

  private initDesktopSlider() {
    $(this.desktopSlider!).slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      infinite: true,
      autoplay: true,
      centerMode: true,
      arrows: false,
      centerPadding: 0,
      dots: true,
    });
  }

  private initDesktopSliderPause() {
    const desktopSliderPause = document.querySelector('.js-desktop-slider-pause');
    if (desktopSliderPause) {
      desktopSliderPause.addEventListener('click', () => {
        const pauseStatus = document.body.getAttribute('data-pause');

        if (pauseStatus == null || pauseStatus == "false") {
          $(this.desktopSlider!).slick("slickPause");
        } else {
          $(this.desktopSlider!).slick("slickPlay");
        }

        this.toggleDataAttr(document.body, 'pause', 'true', 'false');
      });
    }
  }

  // private toggleDataAttr(element: HTMLElement, attribute: string, value1: string, value2: string) {
  //   const currentAttributeValue = element.getAttribute(attribute);
  //   const newValue = currentAttributeValue === value1 ? value2 : value1;
  //   element.setAttribute(attribute, newValue);
  // }
}

export default SlickSlider;