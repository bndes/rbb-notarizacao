class BRTemplateBase {
  constructor(name, component) {
    this.name = name
    this.component = component
    this.header = component.querySelector('.br-header')
    this.btn_menu = component.querySelector('.br-header .menu button')
    this.close_menu = component.querySelector('.br-menu .close-menu button')
    this.scrim_menu = component.querySelector('.scrim-menu')
    this.cm_header = component.querySelector('.context-menu .header')
    this.context_menu = component.querySelector('.context-menu')
    this.notification = component.querySelector('.br-notification')
    this._setBehavior()
  }

  _setBehavior() {
    if (this.btn_menu) {
      this.btn_menu.addEventListener('click', () => {
        this._openMenu()
      })
    }
    if (this.close_menu) {
      this.close_menu.addEventListener('click', () => {
        this._closeMenu()
      })
    }
    if (this.scrim_menu) {
      this.scrim_menu.addEventListener('click', () => {
        this._closeMenuOut()
      })
    }
    if (this.cm_header) {
      this.cm_header.addEventListener('click', () => {
        this._toggleContextMenu()
      })
    }
    if (this.context_menu) {
      this.context_menu.addEventListener('click', () => {
        this._closeContextMenu()
      })
    }
    if (this.notification) {
      setTimeout(() => {
        this.notification.style =
          'position: absolute; left: auto; display: unset; top: 54px; bottom: auto; right: -8px;'
        this.notification.querySelector('.arrow').style =
          'position: absolute; left: auto; right: 28px;'
      }, 500)
    }
  }
  _openMenu() {
    //this.scrim_menu.style.display = 'unset'
    this.scrim_menu.setAttribute('show', '')
  }
  _closeMenu() {
    this.scrim_menu.removeAttribute('show')
  }
  _closeMenuOut() {
    if (event.target === this.scrim_menu) {
      this._closeMenu()
    }
  }
  _closeContextMenu() {
    if (event.target === this.context_menu) {
      this._toggleContextMenu()
    }
  }
  _toggleContextMenu() {
    this.context_menu.toggleAttribute('show')
    const cMenu = this.cm_header
    const icon = cMenu.querySelector('.fa-angle-down')
      ? cMenu.querySelector('.fa-angle-down')
      : cMenu.querySelector('.fa-angle-up')
    if (icon) {
      icon.classList.toggle('fa-angle-down')
      icon.classList.toggle('fa-angle-up')
    }
  }
}

const templateBaseList = []
for (const brTemplateBase of window.document.querySelectorAll('.template-base')) {
  templateBaseList.push(new BRTemplateBase('template-base', brTemplateBase))
}

export default BRTemplateBase
