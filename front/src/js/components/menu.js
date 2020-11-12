class BRMenu {
  constructor(name, component) {
    this.name = name
    this.component = component
    this.folders = this.component.querySelectorAll('.folder')
    this.main = this.folders.length >= 2
    this._setBehavior()
  }

  _setBehavior() {
    this._closeAllSubmenus()
    this._setHref()
    // Menu do tipo principal para ação de colapsar
    if (this.main) {
      this.folders.forEach((folder, i, arr) => {
        const header = folder.querySelector('.header')
        const submenu = folder.querySelector('ul')
        // Abre o ultimo menu
        // eslint-disable-next-line no-plusplus
        if (arr.length === ++i) {
          submenu.removeAttribute('hidden')
        }
        // Ação do header
        header.addEventListener('click', (event) => {
          this._toggleCollapse(event, header)
        })
      })
    } else {
      // Menu tipo Auxiliar e parte inter do Principal
      const submenu = this.component.querySelector('.folder > ul')
      submenu.removeAttribute('hidden')
    }
    this.folders.forEach((folder) => {
      const itens = folder.querySelectorAll('.item')
      itens.forEach((item) => {
        if (!item.hasAttribute('disabled')) {
          // Testa se o item tem um submenu
          const submenu = item.parentNode.querySelector('ul')
          if (submenu) {
            // Ação dos itens com submenu
            item.addEventListener('click', (event) => {
              if (!item.hasAttribute('disabled')) this._itemClick(folder, item, submenu)
            })
          } else {
            // Ação dos itens com links
            item.addEventListener('click', (event) => {
              if (!item.hasAttribute('disabled')) this._linkClick(item)
            })
          }
        }
      })
    })
    this._showLinked()
  }

  _showLinked() {
    const linked = this.component.querySelector('.item[linked]')
    if (linked) {
      const steps = []
      let parentLink = linked
      while (!parentLink.classList.contains('folder')) {
        parentLink = parentLink.parentNode
        if (
          this.main
            ? parentLink.tagName == 'LI' || parentLink.tagName == 'DIV'
            : parentLink.tagName == 'LI'
        ) {
          steps.unshift(parentLink.querySelector('a'))
        }
      }
      steps.forEach((step) => {
        const subfolder = step.parentNode.querySelector('ul')
        if (!subfolder) step.click()
        else if (subfolder.hasAttribute('hidden')) step.click()
      })
    }
  }

  _setHref() {
    const tagsA = this.component.querySelectorAll('.folder a')
    tagsA.forEach((link) => {
      const href = link.hasAttribute('href') ? link.getAttribute('href') : ''
      if (href.trim().length < 1) link.setAttribute('href', 'javascript:void(0);')
    })
  }
  _toggleCollapse(event, header) {
    this.folders.forEach((folder) => {
      const ul1 = folder.querySelector('ul')
      const _header = folder.querySelector('.header')
      const icon = folder.querySelector('.header .fa-angle-down')
        ? folder.querySelector('.header .fa-angle-down')
        : folder.querySelector('.header .fa-angle-up')
      _header.removeAttribute('hidden')

      if (header == _header) {
        ul1.toggleAttribute('hidden')
        icon.classList.toggle('fa-angle-down')
        icon.classList.toggle('fa-angle-up')
        if (!ul1.hasAttribute('hidden')) this._showOnlyLastActive(folder)
      } else {
        ul1.setAttribute('hidden', '')
        icon.classList.add('fa-angle-down')
        icon.classList.remove('fa-angle-up')
      }
    })
  }

  _linkClick(link) {
    const linked = this.component.querySelectorAll('[linked]')
    linked.forEach((_link) => {
      _link.removeAttribute('linked')
    })
    link.setAttribute('linked', '')
  }

  _itemClick(folder, item, submenu) {
    submenu.toggleAttribute('hidden')
    item.toggleAttribute('active')
    // Posibilita o uso de um item com submenu como link
    if (item.hasAttribute('active')) this._linkClick(item)
    else item.removeAttribute('linked')
    const icon = item.querySelector('.fa-angle-right')
      ? item.querySelector('.fa-angle-right')
      : item.querySelector('.fa-angle-left')
    icon.classList.toggle('fa-angle-left')
    icon.classList.toggle('fa-angle-right')
    this._showOnlyLastActive(folder)
    this._toggleSiblingsItens(item)
  }
  _closeAllSubmenus() {
    const submenus = this.component.querySelectorAll('ul')
    submenus.forEach((submenu) => {
      submenu.setAttribute('hidden', '')
    })
  }
  _toggleAllHeaders(hidden) {
    const headers = this.component.querySelectorAll('.header')
    headers.forEach((header) => {
      if (hidden) header.setAttribute('hidden', '')
      else header.removeAttribute('hidden')
    })
  }

  _toggleSiblingsItens(item) {
    const li = item.parentNode.parentNode.querySelectorAll(':scope > li')
    li.forEach((sibling) => {
      sibling.toggleAttribute('hidden')
    })
    item.parentNode.toggleAttribute('hidden')
  }
  _showOnlyLastActive(folder) {
    const actives = folder.querySelectorAll('.item[active]')
    const header = folder.querySelector('.header')
    const hasActive = actives.length > 0
    this._toggleAllHeaders(true)
    if (hasActive) {
      if (header) header.removeAttribute('hidden')
      actives.forEach((active, i, arr) => {
        // eslint-disable-next-line no-plusplus
        if (arr.length === ++i) {
          active.removeAttribute('hidden')
        } else {
          active.setAttribute('hidden', '')
        }
      })
    } else {
      this._toggleAllHeaders(false)
    }
  }
}

const menuList = []
for (const brMenu of window.document.querySelectorAll('.br-menu')) {
  menuList.push(new BRMenu('br-menu', brMenu))
}

function itemMenuClick() {
  this.setAttribute('linked', '')
}
export default BRMenu
