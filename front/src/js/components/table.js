/* eslint-disable complexity */
class BRTable {
  constructor(name, component, sequence) {
    this.name = name
    this.component = component
    this._sequence = sequence
    this._setBehavior()
  }
  _setBehavior() {
    this._cloneHeader()
    this._setHeaderWidth()
    this._toogleSearch()
    this._toogleGrid()
    this._setClickActions()
  }
  _cloneHeader() {
    for (const responsive of this.component.querySelectorAll('.responsive')) {
      this._setSyncScroll(responsive)
    }
    const scrollerTag = document.createElement('div')
    this._setSyncScroll(scrollerTag)
    scrollerTag.classList.add('scroller')
    for (const header of this.component.querySelectorAll('table thead tr th')) {
      const clonedHeader = document.createElement('div')
      clonedHeader.classList.add('item')
      clonedHeader.innerHTML = header.innerHTML
      if (header.offsetWidth) {
        clonedHeader.style.flex = `1 0 ${header.offsetWidth}px`
      }
      scrollerTag.appendChild(clonedHeader)
      if (clonedHeader.firstElementChild) {
        if (clonedHeader.firstElementChild.classList.contains('br-checkbox')) {
          const clonedCheckboxId = `headers-${this.component.id}-check-all`
          for (const checkboxInput of clonedHeader.firstElementChild.querySelectorAll('input')) {
            checkboxInput.id = clonedCheckboxId
          }
          for (const checkboxLabel of clonedHeader.firstElementChild.querySelectorAll('label')) {
            checkboxLabel.setAttribute('for', clonedCheckboxId)
          }
        }
      }
    }
    const headersTag = document.createElement('div')
    headersTag.classList.add('headers')
    headersTag.appendChild(scrollerTag)
    let isResponsive = false
    for (const child of this.component.querySelectorAll('.br-table > div')) {
      if (child.classList.contains('responsive')) {
        child.insertAdjacentElement('beforebegin', headersTag)
        isResponsive = true
      }
    }
    if (!isResponsive) {
      this.component.appendChild(headersTag)
    }
  }
  _setSyncScroll(element) {
    element.classList.add('syncscroll')
    element.setAttribute('name', `table-${this._sequence}`)
  }
  _setHeaderWidth() {
    for (const clonedHeader of this.component.querySelectorAll('.headers > div')) {
      for (const [index, header] of this.component
        .querySelectorAll('table thead tr th')
        .entries()) {
        clonedHeader.children[index].style.flex = `1 0 ${header.offsetWidth}px`
      }
    }
  }
  _toogleSearch() {
    for (const searchBar of this.component.querySelectorAll('.search-bar')) {
      for (const searchTrigger of this.component.querySelectorAll('.search-trigger')) {
        searchTrigger.addEventListener('click', () => {
          searchBar.classList.add('is-active')
        })
      }
      for (const searchClose of searchBar.querySelectorAll('.search-close')) {
        searchClose.addEventListener('click', () => {
          searchBar.classList.remove('is-active')
        })
      }
    }
  }
  _toogleGrid() {
    for (const gridLTrigger of this.component.querySelectorAll('.grid-large-trigger')) {
      gridLTrigger.addEventListener('click', () => {
        this.component.classList.remove('is-grid-small')
      })
    }
    for (const gridSTrigger of this.component.querySelectorAll('.grid-small-trigger')) {
      gridSTrigger.addEventListener('click', () => {
        this.component.classList.add('is-grid-small')
      })
    }
  }
  _setClickActions() {
    const headerCheckbox = this.component.querySelector(".headers [name='check'] [type='checkbox']")
    const tableCheckboxes = this.component.querySelectorAll(
      "tbody [name='check'] [type='checkbox']"
    )
    const selectedBar = this.component.querySelector('.selected-bar')
    const info_select_all = this.component.querySelector('.selected-bar .info .select-all')
    if (tableCheckboxes) {
      for (const checkbox of tableCheckboxes) {
        checkbox.addEventListener('click', () => {
          this._checkRow(checkbox, selectedBar, tableCheckboxes, headerCheckbox)
        })
      }
    }
    if (headerCheckbox) {
      headerCheckbox.addEventListener('click', () => {
        this._checkAllTable(selectedBar, tableCheckboxes, headerCheckbox)
      })
    }
    if (info_select_all) {
      info_select_all.addEventListener('click', () => {
        this._checkAllTable(selectedBar, tableCheckboxes, headerCheckbox)
      })
    }
  }
  _setRow(checkbox, check) {
    const tr = checkbox.parentNode.parentNode.parentNode
    if (check) {
      tr.classList.add('is-selected')
      checkbox.parentNode.classList.add('is-inverted')
      checkbox.checked = true
    } else {
      tr.classList.remove('is-selected')
      checkbox.parentNode.classList.remove('is-inverted')
      checkbox.checked = false
    }
  }
  _checkRow(checkbox, selectedBar, tableCheckboxes, headerCheckbox) {
    const check = checkbox.checked
    this._setRow(checkbox, check)
    this._setSelectedBar(check ? 1 : -1, selectedBar, tableCheckboxes, headerCheckbox)
  }
  _checkAllRows(tableCheckboxes) {
    for (const checkbox of tableCheckboxes) {
      this._setRow(checkbox, true)
    }
  }
  _uncheckAllRows(tableCheckboxes) {
    for (const checkbox of tableCheckboxes) {
      this._setRow(checkbox, false)
    }
  }
  _checkAllTable(selectedBar, tableCheckboxes, headerCheckbox) {
    let count = tableCheckboxes.length
    const info_count = selectedBar.querySelector('.info .count')
    const total = parseInt(info_count.innerHTML, 10)
    if (total === count) {
      this._uncheckAllRows(tableCheckboxes)
      count = -1 * count
    } else {
      this._checkAllRows(tableCheckboxes)
    }
    this._setSelectedBar(count, selectedBar, tableCheckboxes, headerCheckbox)
  }
  _setSelectedBar(count, selectedBar, tableCheckboxes, headerCheckbox) {
    const info_count = selectedBar.querySelector('.info .count')
    const info_text = selectedBar.querySelector('.info .text')
    const [mobile_ico] = selectedBar.querySelector('.info .select-all').children
    const total = count < 2 ? parseInt(info_count.innerHTML, 10) + count : count
    if (total > 0) {
      selectedBar.classList.add('is-active')
      info_count.innerHTML = total
      info_text.innerHTML = total > 1 ? 'itens selecionados' : 'item selecionado'
      if (headerCheckbox) headerCheckbox.parentNode.classList.add('is-checking')
      if (mobile_ico) {
        mobile_ico.classList.add('fa-minus-square')
        mobile_ico.classList.remove('fa-check-square')
      }
      if (total === tableCheckboxes.length) {
        if (headerCheckbox) {
          headerCheckbox.checked = true
          headerCheckbox.parentNode.classList.remove('is-checking')
        }
        if (mobile_ico) {
          mobile_ico.classList.remove('fa-minus-square')
          mobile_ico.classList.add('fa-check-square')
        }
      }
    } else {
      info_count.innerHTML = 0
      if (headerCheckbox) {
        headerCheckbox.checked = false
        headerCheckbox.parentNode.classList.remove('is-checking')
      }
      if (mobile_ico) {
        mobile_ico.classList.remove('fa-check-square')
        mobile_ico.classList.add('fa-minus-square')
      }
      selectedBar.classList.remove('is-active')
    }
  }
  /**
   * @fileoverview syncscroll - scroll several areas simultaniously
   * @version 0.0.3
   *
   * @license MIT, see http://github.com/asvd/intence
   * @copyright 2015 asvd <heliosframework@gmail.com>
   */
  static _syncscroll() {
    const scroll = 'scroll'
    const elems = document.getElementsByClassName(`sync${scroll}`)
    const EventListener = 'EventListener'
    const length = 'length'
    const names = {}
    // clearing existing listeners
    let i, j, el, found, name
    for (name in names) {
      if (names.hasOwnProperty(name)) {
        for (i = 0; i < names[name][length]; i++) {
          names[name][i][`remove${EventListener}`](scroll, names[name][i].syn, 0)
        }
      }
    }
    // setting-up the new listeners
    for (i = 0; i < elems[length]; i++) {
      found = j = 0
      el = elems[i]
      if (!(name = el.getAttribute('name'))) {
        // name attribute is not set
        continue
      }
      el = el[`${scroll}er`] || el // needed for intence
      // searching for existing entry in array of names;
      // searching for the element in that entry
      for (; j < (names[name] = names[name] || [])[length]; j++) {
        found |= names[name][j] === el
      }
      if (!found) {
        names[name].push(el)
      }
      el.eX = el.eY = 0
      this._elSyn(el, name, scroll, elems, EventListener, length, names)
    }
  }
  static _elSyn(el, name, scroll, elems, EventListener, length, names) {
    const addEventListener = `add${EventListener}`
    const client = 'client'
    const Height = 'Height'
    const Left = 'Left'
    const Math_round = Math.round
    const Top = 'Top'
    const Width = 'Width'
    el[addEventListener](
      scroll,
      () => {
        const otherElems = names[name]
        let scrollX = el[scroll + Left]
        let scrollY = el[scroll + Top]
        const xRate = scrollX / (el[scroll + Width] - el[client + Width])
        const yRate = scrollY / (el[scroll + Height] - el[client + Height])
        const updateX = scrollX !== el.eX
        const updateY = scrollY !== el.eY
        el.eX = scrollX
        el.eY = scrollY
        otherElems.forEach((element) => {
          if (element !== el) {
            if (
              updateX &&
              Math_round(
                element[scroll + Left] -
                  (scrollX = element.eX = Math_round(
                    xRate * (element[scroll + Width] - element[client + Width])
                  ))
              )
            ) {
              element[scroll + Left] = scrollX
            }
            if (
              updateY &&
              Math_round(
                element[scroll + Top] -
                  (scrollY = element.eY = Math_round(
                    yRate * (element[scroll + Height] - element[client + Height])
                  ))
              )
            ) {
              element[scroll + Top] = scrollY
            }
          }
        })
      },
      0
    )
  }
}
const tableList = []
for (const [index, brTable] of window.document.querySelectorAll('.br-table').entries()) {
  tableList.push(new BRTable('br-table', brTable, index))
}
BRTable._syncscroll()
export default BRTable
