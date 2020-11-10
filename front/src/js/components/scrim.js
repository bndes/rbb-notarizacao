class BRScrim {
  constructor(name, component) {
    this.name = name
    this.component = component
    this._setType()
    this._setBehavior()
  }
  _setType() {
    if (this.component.classList.contains('is-foco')) {
      this._type = 'is-foco'
    }
    if (this.component.classList.contains('is-legibilidade')) {
      this._type = 'is-legibilidade'
    }
    if (this.component.classList.contains('is-inibicao')) {
      this._type = 'is-inibicao'
    }
  }
  _setBehavior() {
    if (this.component.classList.contains('is-foco')) {
      this.component.addEventListener('click', (event) => {
        this._hideScrim(event)
      })
    }
  }
  _hideScrim(event) {
    event.currentTarget.classList.remove('is-active')
  }
  showScrim() {
    if (this._type === 'is-foco') {
      this.component.classList.add('is-active')
    }
  }
}
const scrimList = []
for (const brScrim of window.document.querySelectorAll('.br-scrim')) {
  scrimList.push(new BRScrim('br-scrim', brScrim))
}
export default BRScrim
for (const buttonBloco1 of window.document.querySelectorAll('.bloco1 button')) {
  buttonBloco1.addEventListener('click', () => {
    for (const brScrim of scrimList) {
      brScrim.showScrim()
    }
  })
}
