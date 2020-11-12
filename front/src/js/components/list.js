class BRList {
  constructor(name, component) {
    this.name = name
    this.component = component
    this.collapsible = this.name === 'br-list-collapsible'
    this.checkable = this.name === 'br-list-checkable'
    this.unique = component.hasAttribute('unique')
    this.horizontal = component.hasAttribute('horizontal')
    this.cols = this.horizontal ? component.querySelectorAll('.col') : []
    this.itens = component.querySelectorAll(':scope > .item')
    // suporte a colunas do bootstrap dentro da lista
    if (this.itens.length === 0) this.itens = component.querySelectorAll('div > .item')
    this._setBehavior()
  }
  // eslint-disable-next-line complexity
  _setBehavior() {
    if (this.collapsible) {
      this._closeAllItens()
      this.itens.forEach((item) => {
        item.addEventListener('click', (event) => {
          this._toggle(event, item)
        })
      })
    }
    if (this.checkable) {
      this.itens.forEach((item) => {
        this._setSelected(item)
        if (!item.hasAttribute('disabled')) {
          item.querySelector('.br-checkbox > input').addEventListener('click', (event) => {
            if (event.target.getAttribute('type') === 'checkbox') {
              this._check(event, item)
            }
          })
        }
      })
    }
    if (this.cols.length > 0) {
      const n = this.cols.length
      const pos = n > 6 && n % 2 === 1 ? n + 1 : n
      const resto = pos / Math.ceil(pos / 6)
      const equal = 100 / resto
      this.cols.forEach((col) => {
        col.style.flexBasis = `${equal}%`
      })
    }
  }
  _toggle(event, item) {
    if (!item.hasAttribute('active')) {
      if (this.unique) this._closeAllItens()
    }
    item.toggleAttribute('active')
    const icon = item.querySelector('.fa-angle-down')
      ? item.querySelector('.fa-angle-down')
      : item.querySelector('.fa-angle-up')
    if (icon) {
      icon.classList.toggle('fa-angle-down')
      icon.classList.toggle('fa-angle-up')
    }
  }

  _closeAllItens() {
    this.itens.forEach((item) => {
      item.removeAttribute('active')
      const icon = item.querySelector('.fa-angle-down')
        ? item.querySelector('.fa-angle-down')
        : item.querySelector('.fa-angle-up')
      if (icon) {
        icon.classList.add('fa-angle-down')
        icon.classList.remove('fa-angle-up')
      }
    })
  }
  _check(event, item) {
    item.classList.toggle('selected')
    this._setSelected(item)
  }
  _setSelected(item) {
    const br_checkbox = item.querySelector('.br-checkbox')
    const br_checkbox_input = br_checkbox.querySelector('input')
    const selected = item.classList.contains('selected')
    if (br_checkbox) {
      if (selected) {
        br_checkbox.classList.add('is-inverted')
        br_checkbox_input.setAttribute('checked', '')
        br_checkbox_input.checked = true
      } else {
        br_checkbox.classList.remove('is-inverted')
        br_checkbox_input.removeAttribute('checked')
        br_checkbox_input.checked = false
      }
    }
  }
}
const listList = []
for (const brList of window.document.querySelectorAll('.br-list[collapsible]')) {
  listList.push(new BRList('br-list-collapsible', brList))
}
for (const brList of window.document.querySelectorAll('.br-list[checkable]')) {
  listList.push(new BRList('br-list-checkable', brList))
}
export default BRList
