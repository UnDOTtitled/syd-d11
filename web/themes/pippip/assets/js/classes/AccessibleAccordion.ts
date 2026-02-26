/**
 * Accessible accordion following W3C ARIA Authoring Practices Guide.
 * Expects markup: .js-accordion root with .js-accordion__trigger buttons and
 * .js-accordion__panel regions (ids and ARIA set in Twig).
 * Single-open by default; first panel opened on init.
 */

interface AccordionItem {
  button: HTMLButtonElement;
  panel: HTMLElement;
  expanded: boolean;
}

export default class AccessibleAccordion {
  private rootEl: HTMLElement;
  private items: AccordionItem[] = [];

  constructor(domNode: HTMLElement) {
    this.rootEl = domNode;
    this.items = this.gatherItems();
    if (this.items.length === 0) return;

    this.items.forEach((item) => {
      item.button.addEventListener('click', () => this.onButtonClick(item));
    });

    // First panel open by default (W3C-style)
    this.openPanel(this.items[0]);
  }

  private gatherItems(): AccordionItem[] {
    const triggers = this.rootEl.querySelectorAll<HTMLButtonElement>('.js-accordion__trigger');
    const result: AccordionItem[] = [];

    triggers.forEach((button) => {
      const controlsId = button.getAttribute('aria-controls');
      if (!controlsId) return;
      const panel = document.getElementById(controlsId);
      if (!panel) return;
      const expanded = button.getAttribute('aria-expanded') === 'true';
      result.push({ button, panel, expanded });
    });

    return result;
  }

  private onButtonClick(clickedItem: AccordionItem): void {
    const nextOpen = !clickedItem.expanded;
    this.toggle(clickedItem, nextOpen);
  }

  private toggle(item: AccordionItem, open: boolean): void {
    if (open === item.expanded) return;

    // Single-open: close all others when opening one
    if (open) {
      this.items.forEach((other) => {
        if (other !== item && other.expanded) this.toggle(other, false);
      });
    }

    item.expanded = open;
    item.button.setAttribute('aria-expanded', String(open));
    if (open) {
      item.panel.removeAttribute('hidden');
    } else {
      item.panel.setAttribute('hidden', '');
    }
  }

  openPanel(item: AccordionItem): void {
    this.toggle(item, true);
  }

  closePanel(item: AccordionItem): void {
    this.toggle(item, false);
  }
}
