/* eslint-disable complexity */
class BRHeader {
  constructor(name, component) {
    this.name = name
    this.component = component
    this.flex_container = component.querySelector('.flex-container')
    this.login = component.querySelector('.login')
    this.login_btn = component.querySelector('.login button')
    this.avatar = component.querySelector('.avatar')
    this.links_btn = component.querySelector('.links button')
    this.functions_btn = component.querySelector('.functions button')
    this.menu = component.querySelector('.menu')
    this.search = component.querySelector('.search')
    this.search_btn = component.querySelector('.search-btn button')
    this.search_input = component.querySelector('.search input')
    this.search_close = component.querySelector('.search .search-close')
    this.sticky = component.hasAttribute('sticky')
    this._setBehavior()
  }
  _setBehavior() {
    // Inicializa Layout
    this.avatar.setAttribute('hidden', '')
    if (this.sticky) {
      //this.component.style.paddingTop = `${this.flex_container.offsetHeight}px`
      //this.component.setAttribute('compact', '')
      const compact = this.component.hasAttribute('compact')
      const noSubtitle = this.component.hasAttribute('no-subtitle')
      window.onscroll = () => {
        if (window.pageYOffset > this.component.offsetTop) {
          this.component.classList.add('sticky')
          if (!compact) this.component.setAttribute('compact', '')
          if (!noSubtitle) this.component.setAttribute('no-subtitle', '')
        } else {
          this.component.classList.remove('sticky')
          if (!compact) this.component.removeAttribute('compact', '')
          if (!noSubtitle) this.component.removeAttribute('no-subtitle')
        }
      }
    }
    // Ações de bootões
    if (this.login_btn) {
      this.login_btn.addEventListener('click', () => {
        this.avatar.toggleAttribute('hidden')
        this.login.toggleAttribute('hidden')
      })
    }
    if (this.links_btn) {
      this.links_btn.addEventListener('click', (event) => {
        this._openPop(event)
      })
    }
    if (this.functions_btn) {
      this.functions_btn.addEventListener('click', (event) => {
        this._openPop(event)
      })
    }
    if (this.search_btn) {
      this.search_btn.addEventListener('click', (event) => {
        this._openPop(event)
      })
    }
    if (this.search_input) {
      this.search_input.addEventListener('focus', (event) => {
        this.search.setAttribute('active', '')
        this.menu.style.display = 'none'
      })
    }
    if (this.search_close) {
      this.search_close.addEventListener('click', (event) => {
        this.search.removeAttribute('active')
        this.menu.style.display = 'flex'
      })
    }
  }
  _openPop() {
    let parentTag = event.target.parentNode
    while (parentTag.tagName != 'DIV') {
      parentTag = parentTag.parentNode
    }
    const btnEvent = parentTag.querySelector(':scope > button')
    btnEvent.setAttribute('active', '')
    const ul = parentTag.querySelector('ul')
    let popmenu = this.component.querySelector('.popmenu')
    let popParent
    if (popmenu) {
      popParent = popmenu.parentNode
      const popParentBtn = popParent.querySelector(':scope > button')
      if (popParentBtn) popParentBtn.removeAttribute('active')
      popmenu.removeAttribute('active')
      popParent.removeAttribute('active')

      popmenu.parentNode.removeChild(popmenu)
    }
    // Menu de lista
    if (ul) {
      if (popParent !== ul.parentNode) {
        this.search_btn.removeAttribute('active')
        popmenu = document.createElement('div')
        popmenu.innerHTML = ul.outerHTML
        popmenu.classList.add('popmenu')
        ul.parentNode.appendChild(popmenu)
      }
    }
    // Menu de busca
    else {
      popmenu = document.createElement('div')
      popmenu.classList.add('popmenu')
      popmenu.innerHTML = this.search.outerHTML
      const popclose = popmenu.querySelector('.search-close')
      const search = popmenu.querySelector('.search')
      // Maximiza tamanho do search no menu compacto
      if (this.component.hasAttribute('compact')) {
        search.style.height = `${this.flex_container.offsetHeight}px`
      } else {
        popmenu.style.height = `${this.flex_container.offsetHeight}px`
      }
      this.flex_container.prepend(popmenu)
      // Ação do botão de fechar popmenu
      popclose.addEventListener('click', () => {
        popmenu.removeAttribute('active')
        if (popmenu.parentNode) popmenu.parentNode.removeAttribute('active')
        this.search_btn.removeAttribute('active')
        this.menu.style.display = 'flex'
        this._closePop()
      })
      // Foca no input após abrir a busca
      setTimeout(() => {
        return search.querySelector('input').focus()
      }, 500)
    }
    // Visibilidade do popmenu
    const set = popmenu.style.display ? true : false
    popmenu.setAttribute('active', '')
    if (popmenu.parentNode) popmenu.parentNode.setAttribute('active', '')
    // eslint-disable-next-line prettier/prettier
    popmenu.style.display = set ? popmenu.style.display === 'none' ? 'flex' : 'none' : 'flex'
  }
  _closePop() {
    const popmenu = this.component.querySelector('.popmenu')
    popmenu.parentNode.removeChild(popmenu)
  }
}

const headerList = []

for (const brHeader of window.document.querySelectorAll('.br-header')) {
  headerList.push(new BRHeader('br-header', brHeader))
}
export default BRHeader
