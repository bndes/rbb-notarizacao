class BRBreadcrumb {
  constructor(name, component) {
    this.name = name
    this.component = component
    this._setBehavior()
  }
  _setBehavior() {
    window.addEventListener('load', () => {
      if (window.innerWidth < this.component.scrollWidth) {
        this.hideCrumbs()
      }
    })
  }
  hideCrumbs() {
    for (const crumb of this.component.querySelectorAll('li:not(:nth-child(1)):not(:last-child)')) {
      if (crumb.classList.contains('hidden')) {
        crumb.classList.remove('hidden')
        crumb.classList.add('more')
        crumb.addEventListener('click', () => {
          this._showCrumbs()
        })
      } else {
        crumb.classList.add('hidden')
      }
    }
  }
  _showCrumbs() {
    for (const crumb of this.component.querySelectorAll('li:not(:nth-child(1)):not(:last-child)')) {
      if (crumb.classList.contains('more')) {
        crumb.classList.remove('more')
        crumb.classList.add('hidden')
      } else {
        crumb.classList.remove('hidden')
      }
    }
  }
}
const breadcrumbList = []
for (const brBreadcrumb of window.document.querySelectorAll('.br-breadcrumb')) {
  breadcrumbList.push(new BRBreadcrumb('br-breadcrumb', brBreadcrumb))
}
export default BRBreadcrumb
