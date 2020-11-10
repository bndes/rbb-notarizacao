import BRScrim from './scrim'
class BRModal {
  constructor(name, component) {
    this.name = name
    this.component = component
    this._setBehavior()
  }
  _setBehavior() {
    for (const brScrim of window.document.querySelectorAll('.br-scrim')) {
      const scrim = new BRScrim('br-scrim', brScrim)
      for (const button of window.document.querySelectorAll('.br-scrim + button')) {
        button.addEventListener('click', () => {
          scrim.showScrim()
        })
      }
    }
  }
}
export default BRModal
const modalList = []
for (const brModal of window.document.querySelectorAll('.br-modal')) {
  modalList.push(new BRModal('br-modal', brModal))
}
