class BRSelect {
  constructor(name, component) {
    this.name = name
    this.component = component
    this._setUpBrSelect()
  }
  _setUpBrSelect() {
    for (const select of this.component.querySelectorAll('select')) {
      this.component.appendChild(this._buildSelectionField(select))
      this.component.appendChild(this._buildOptionsList(select))
    }
    this._setBehavior()
  }
  _buildSelectionField(select) {
    const selectionField = window.document.createElement('button')
    selectionField.setAttribute('class', 'select-selected unselected')
    if (select.disabled) {
      selectionField.setAttribute('disabled', 'disabled')
    }
    selectionField.appendChild(
      this._buildOptionItem(select.options[select.selectedIndex].innerHTML)
    )
    selectionField.appendChild(this._buildIcon())
    return selectionField
  }
  _buildOptionItem(text) {
    const optionItem = window.document.createElement('span')
    optionItem.innerHTML = text
    return optionItem
  }
  _buildIcon() {
    const icon = window.document.createElement('i')
    icon.setAttribute('class', 'fas fa-chevron-down')
    return icon
  }
  _buildOptionsList(select) {
    const optionsList = window.document.createElement('div')
    optionsList.setAttribute('class', 'select-items select-hide')
    for (const option of select.options) {
      const optionField = window.document.createElement('button')
      optionField.appendChild(this._buildOptionItem(option.innerHTML))
      optionsList.appendChild(optionField)
    }
    return optionsList
  }
  _setBehavior() {
    for (const itemSelected of this.component.querySelectorAll('.select-selected')) {
      itemSelected.addEventListener('click', (event) => {
        event.stopPropagation()
        itemSelected.nextElementSibling.classList.toggle('select-hide')
        this._closeSelects(itemSelected)
        window.document.addEventListener('click', () => {
          this._closeSelects()
        })
      })
    }
    for (const item of this.component.querySelectorAll('.select-items button')) {
      item.addEventListener('click', () => {
        for (const select of this.component.querySelectorAll('select')) {
          for (const [index, option] of Array.from(select.options).entries()) {
            if (option.innerHTML === item.firstChild.innerHTML) {
              select.selectedIndex = index
              select.dispatchEvent(new Event('change'))
              item.parentNode.previousSibling.firstChild.innerHTML = item.firstChild.innerHTML
              item.parentNode.previousSibling.setAttribute('class', 'select-selected')
              item.parentNode.classList.add('select-hide')
              for (const optionItem of item.parentNode.querySelectorAll('button')) {
                if (optionItem === item) {
                  optionItem.setAttribute('class', 'same-as-selected')
                } else {
                  optionItem.removeAttribute('class')
                }
              }
            }
          }
        }
      })
    }
  }
  _closeSelects(element) {
    for (const brSelect of window.document.querySelectorAll('.br-select')) {
      for (const itemSelected of brSelect.querySelectorAll('.select-selected')) {
        if (itemSelected !== element) {
          for (const optionsList of brSelect.querySelectorAll('.select-items')) {
            optionsList.classList.add('select-hide')
            window.document.removeEventListener('click', this._closeSelects)
          }
        }
      }
    }
  }
  _deleteSelect() {
    for (const selectionField of this.component.querySelectorAll('button.select-selected')) {
      selectionField.remove()
    }
    for (const optionsList of this.component.querySelectorAll('div.select-items')) {
      optionsList.remove()
    }
  }
  updateSelect() {
    this._deleteSelect()
    this._setUpBrSelect()
  }
}
// TODO: Refatorar e incluir na classe
const selectList = []
for (const brSelect of window.document.querySelectorAll('.br-select')) {
  selectList.push(new BRSelect('br-select', brSelect))
}
export default BRSelect
