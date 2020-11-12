import { createPopper, right } from '@popperjs/core'
class BRTooltip {
  constructor(name, component) {
    this.name = name
    this.component = component
    this.activator = component.previousSibling.previousSibling
    const place = component.getAttribute('place')
    const positions = ['top', 'right', 'bottom', 'left']
    this.popover = component.hasAttribute('popover')
    this.notification = component.classList.contains('br-notification')
    this.timer = component.getAttribute('timer')
    this.active = component.hasAttribute('active')
    this.placement = positions.includes(place) ? place : this.notification ? 'bottom' : 'top'
    this.popperInstance = null
    this.showEvents = ['mouseenter', 'focus']
    this.hideEvents = ['mouseleave', 'blur']
    this._create()
    this._setBehavior()
  }
  _setBehavior() {
    // Ação de abrir padrao ao entrar no ativador
    if (this.activator) {
      this.showEvents.forEach((event) => {
        this.activator.addEventListener(event, (otherEvent) => {
          this._show(otherEvent)
        })
      })
    }
    // Adiciona ação de fechar ao botao do popover
    if (this.popover || this.notification) {
      const [close] = this.component.querySelectorAll('.close')
      close.addEventListener('click', (event) => {
        this._hide(event)
      })
      if (this.notification) {
        setTimeout(() => {
          this.notification.style =
            'position: absolute; left: auto; display: unset; top: 54px; bottom: auto; right: -8px;'
          this.notification.querySelector('.arrow').style =
            'position: absolute; left: auto; right: 28px;'
        }, 500)
      }
      // Ação de fechar padrao ao sair do ativador
    } else {
      this.hideEvents.forEach((event) => {
        this.activator.addEventListener(event, (otherEvent) => {
          this._hide(otherEvent)
        })
      })
    }
    // Abre os elementos que devem aparecer já ativos
    if (this.active) {
      this._show(event)
    }
  }
  _create() {
    this._setLayout()
    //Cria a instancia do popper
    if (this.notification) {
      this.component.setAttribute('notification', '')
      this.popperInstance = createPopper(this.activator, this.component, {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 10],
            },
          },
          {
            name: 'preventOverflow',
            options: {
              //rootBoundary: 'viewport',
              altAxis: true, // false by default
              mainAxis: true, // true by default
            },
          },
        ],
        placement: this.placement,
        strategy: 'absolute',
      })
    } else {
      this.popperInstance = createPopper(this.activator, this.component, {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 8],
            },
          },
        ],
        placement: this.placement,
      })
    }
  }
  _destroy() {
    if (this.popperInstance) {
      const refpopover = this.component
      setTimeout(() => {
        refpopover.style.display = 'none'
      }, 500)
    }
  }
  _show(event) {
    this.component.style.display = 'unset'
    this.component.setAttribute('data-show', '')
    // Importante pois "display: none" conflitua com a instancia do componente e precisa ser setado aqui já que pelo css ativa o efeito fade no primeiro carregamento
    //this.component.style.visibility = "visible";
    if (this.timer) {
      setTimeout(this._hide, this.timer, event, this.component)
    }
  }
  _hide(event, component) {
    // data-show é o atributo que controla a visibilidade
    if (this.component) {
      this.component.removeAttribute('data-show')
      this._destroy()
    } else if (component) {
      component.removeAttribute('data-show')
      component.style.display = 'none'
    }
  }
  _setLayout() {
    // Cria a setinha que aponta para o item que criou o tooltip
    const arrow = document.createElement('div')
    arrow.setAttribute('data-popper-arrow', '')
    arrow.classList.add('arrow')
    this.component.appendChild(arrow)
    // Cria o icone de fechar do po over
    if (this.popover || this.notification) {
      const close = document.createElement('button')
      close.setAttribute('type', 'button')
      close.classList.add('close')
      const ico = document.createElement('i')
      ico.classList.add('fas', 'fa-times')
      close.appendChild(ico)
      this.component.appendChild(close)
    }
  }
}
const tooltipList = []
for (const brTooltip of window.document.querySelectorAll('.br-tooltip')) {
  tooltipList.push(new BRTooltip('br-tooltip', brTooltip))
}
export default BRTooltip
