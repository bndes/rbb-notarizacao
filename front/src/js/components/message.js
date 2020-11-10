class BRAlert {
  constructor(name, component) {
    this.name = name
    this.component = component
    this._setBehavior()
  }
  _setBehavior() {
    for (const button of this.component.querySelectorAll('div.close button')) {
      button.addEventListener('click', () => {
        this._dismiss(this.component)
      })
    }
  }
  _dismiss(component) {
    component.parentNode.removeChild(component)
  }
}
/* Instancia a classe */
const alertList = []
for (const brAlert of window.document.querySelectorAll('.br-message')) {
  alertList.push(new BRAlert('br-message', brAlert))
}
export default BRAlert
