class BRTag {
  constructor(name, component) {
    this.name = name
    this.component = component
    this.DomList = []
    this._setBehavior()
    this.arrayOfList = []
  }
  _setBehavior() {
    for (const button of this.component.querySelectorAll('div.close button')) {
      button.addEventListener('click', () => {
        this.component.parentNode.removeChild(this.component)
      })
    }
  }
}
class BRTagChoice {
  constructor(name, component) {
    this.name = name
    this.component = component
    this.DomList = []
    this._setBehavior()
    this.arrayOfList = []
  }
  _setBehavior() {
    for (const button of this.component.querySelectorAll('.br-tag')) {
      button.addEventListener('click', (event) => {
        this._switchTag(event.currentTarget)
      })
    }
  }
  _switchTag(currentTag) {
    for (const tag of this.component.querySelectorAll('.br-tag')) {
      if (tag === currentTag) {
        tag.classList.add('active')
      } else {
        tag.classList.remove('active')
      }
    }
  }
}
class BRTagFilter {
  constructor(name, component) {
    this.name = name
    this.component = component
    this.DomList = []
    this._setBehavior()
    this.arrayOfList = []
  }
  _setBehavior() {
    for (const button of this.component.querySelectorAll('.br-tag')) {
      button.addEventListener('click', (event) => {
        this._switchTag(event.currentTarget)
      })
    }
  }
  _switchTag(currentTag) {
    currentTag.classList.toggle('active')
  }
}
const tagList = []
for (const brTag of window.document.querySelectorAll('.br-tag')) {
  tagList.push(new BRTag('br-tag', brTag))
}
const tagListChoice = []
for (const brTagChoice of window.document.querySelectorAll('.br-tag-list')) {
  tagListChoice.push(new BRTagChoice('br-tag-list', brTagChoice))
}
const tagListFilter = []
for (const brTagFilter of window.document.querySelectorAll('.br-tag-filter')) {
  tagListFilter.push(new BRTagFilter('br-tag-list', brTagFilter))
}
export default BRTag
