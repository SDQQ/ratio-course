export default function slider(slider) {
  slider = document.querySelector(slider)
  const sliderList = slider.querySelector('.slider__list')
  const sliderListItem = slider.querySelectorAll('.card')
  const prevNextButtonsWrap = slider.querySelector('.control-buttons__wrap')
  const prevBtn = slider.querySelector('.btn__prev')
  const nextBnt = slider.querySelector('.btn__next')
  const crumbBtnsWrap = slider.querySelector('.control-buttons__crumb-buttons-wrap')
  const crumbBtns = slider.querySelectorAll('.control-buttons__crumb-buttons-wrap button')
  const arrowBtn = slider.querySelectorAll('.control-buttons__wrap .btn')
  const svgBtn = slider.querySelectorAll('.btn__slider-svg')

  let current = 0
  let minSliderItemWidth = 0
  let lastSliderIndex = sliderListItem.length - 1

  function btnsHandler(e) {
    const isCurrentChanged = current
    if (e.path.includes(prevBtn) && current > 0) current--
    if (e.path.includes(nextBnt) && current < lastSliderIndex) current++
    if (isCurrentChanged === current) return
    setCrumb()
    setItem()
    checkButtons()
  }

  function checkButtons() {
    svgBtn.forEach(item => item.setAttribute('viewBox', '0 0 42 16'))
    arrowBtn.forEach(item => item.removeAttribute("disabled"))
    if (current === 0) {
      arrowBtn[0].setAttribute("disabled", "disabled")
      svgBtn[0].setAttribute("viewBox", "0 0 22 16")
      return
    }
    if (current === lastSliderIndex) {
      arrowBtn[1].setAttribute("disabled", "disabled")
      svgBtn[1].setAttribute("viewBox", "20 0 22 16")
    }
  }

  function calcMinSliderItemWidth() {
    const arr = [...sliderListItem].map(item => item.offsetWidth)
    minSliderItemWidth = Math.min(...arr)
    setItem()
  }

  function setCrumb() {
    crumbBtns.forEach(item => item.classList.remove('btn__crumb--active'))
    crumbBtns[current].classList.add('btn__crumb--active')
  }

  function setItem() {
    let transformMargin = 0
    sliderListItem.forEach((item, index) => {
      item.classList.remove('card--active')
      if (index < current) {
        const margin = +window.getComputedStyle(item).getPropertyValue('margin-right').split('px')[0]
        transformMargin += minSliderItemWidth + margin
      }
    })
    sliderListItem[current].classList.add('card--active')
    sliderList.style.transform = `translateX(-${transformMargin}px)`
  }

  function crumbHandler(e) {
    const target = e.target
    if (target.tagName === 'BUTTON') {
      crumbBtns.forEach((item, index) => {
        if (target === item) {
          current = index
          setCrumb()
          setItem()
          checkButtons()
        }
      })
    }
  }

  function initListeners() {
    prevNextButtonsWrap.addEventListener('click', btnsHandler)
    crumbBtnsWrap.addEventListener('click', crumbHandler)
    sliderList.addEventListener('transitionend', calcMinSliderItemWidth)
  }

  function removeListeners() {
    prevNextButtonsWrap.removeEventListener('click', btnsHandler)
    crumbBtnsWrap.removeEventListener('click', crumbHandler)
    sliderList.removeEventListener('transitionend', calcMinSliderItemWidth)
  }

  calcMinSliderItemWidth()
  checkButtons()

  return {
    initListeners, removeListeners
  }
}
