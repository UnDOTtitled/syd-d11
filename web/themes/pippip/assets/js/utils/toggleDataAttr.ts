export default function toggleDataAttr(
  el: Element,
  dataname: string,
  onState: string,
  offState: string
) {
  el.setAttribute(
    `data-${dataname}`,
    el.getAttribute(`data-${dataname}`) === onState ? offState : onState
  )
}
