
import focusTrap from 'focus-trap-js';

class ModalFocusTrap {
  private ModalContainer: HTMLElement;
  private ModalToggler: any;
  private ModalTogglers: NodeListOf<Element>;
  private focusableElements: NodeListOf<HTMLElement>;
  private firstElement: HTMLElement | null;
  private firstToggle:  Element & HTMLElement | null;
  private dataAttBody: string | null;
  private clickedOnceVar: Boolean;

  constructor(ModalContainer: HTMLElement) {
    this.ModalContainer = ModalContainer;
    this.ModalTogglers = document.querySelectorAll(`.js-modal-toggle[data-modal-toggler="${this.ModalContainer.dataset.modal}"]`);

    this.clickedOnceVar = false;
    this.bindings();
  }

  private bindings() {
    if (this.ModalTogglers) {
      this.togglerClick();
    }
  }

  private togglerClick() {
    
    this.ModalTogglers.forEach((currentToggler, index) => {

      currentToggler.addEventListener("click", e => {
        this.ModalToggler = e.target;

        if (this.clickedOnceVar == false) {
          this.toggleModal();
        }
  
        this.clickedOnceVar == true;
      }, {passive: true});
    });
  }

  private toggleModal() {

    this.focusableElements = this.ModalContainer.querySelectorAll('a, button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), td > div');
    this.firstElement = this.focusableElements[0] ? this.focusableElements[0] : null;

    const targetElement = document.body;
    const observer = new MutationObserver(mutations => {

      mutations.forEach(mutation => {

        if (mutation.type === 'attributes' && mutation.attributeName === `data-${this.ModalContainer.dataset.modal}`) {
          this.dataAttBody = document.body.getAttribute(`data-${this.ModalContainer.dataset.modal}`);

          setTimeout(() => {
            if (this.dataAttBody == "open") {
              this.firstElement.focus();
              document.addEventListener("keydown", (e) => {
                if (e.key === "Escape") {
                  document.body.setAttribute(`data-${this.ModalContainer.dataset.modal}`, 'closed')
                } else {
                  focusTrap(e, this.ModalContainer);
                }
              }, {passive: true});
            } else if (this.dataAttBody == "closed" || this.dataAttBody == null)  {
              this.ModalToggler.focus();
            }
          }, 500);
        }
      });
    });

    observer.observe(targetElement, { attributes: true });
  }
}

export default ModalFocusTrap;
