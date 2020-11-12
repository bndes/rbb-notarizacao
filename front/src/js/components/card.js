class BRCard {
  constructor(name, component, id) {
    this.name = name
    this.component = component
    this.component.setAttribute('id', `card${id}`)
    this._setBehavior()
  }

  _setBehavior() {
    this._setFlipBehavior()
    this._setExpandBehavior()
    this._setDragBehavior()
  }

  _setFlipBehavior() {
    for (const flip of this.component.querySelectorAll('button.flip')) {
      flip.addEventListener('click', () => {
        if (this.component.getAttribute('flipped') === 'off') {
          this.component.setAttribute('flipped', 'on')
        } else {
          this.component.setAttribute('flipped', 'off')
        }
      })
    }
  }

  _setExpandBehavior() {
    for (const expand of this.component.querySelectorAll('button.expand')) {
      expand.addEventListener('click', () => {
        if (this.component.getAttribute('expanded') === 'off') {
          this.component.setAttribute('expanded', 'on')
        } else {
          this.component.setAttribute('expanded', 'off')
        }
      })
    }
  }

  _setDragBehavior() {
    for (const img of this.component.querySelectorAll('img')) {
      img.setAttribute('draggable', 'false')
    }
    for (const link of this.component.querySelectorAll('a')) {
      link.setAttribute('draggable', 'false')
    }
    this.component.addEventListener('dragstart', (event) => {
      event.stopPropagation()
      event.dataTransfer.setData('text/plain', this.component.getAttribute('id'))
      event.dropEffect = 'move'
    })
  }
}

const listCard = []
for (const [index, brCard] of window.document.querySelectorAll('.br-card').entries()) {
  listCard.push(new BRCard('br-card', brCard, index))
}

export default BRCard
