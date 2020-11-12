class BRTabs {
  constructor(name, component) {
    this.name = name
    this.component = component
    this._setBehavior()
  }
  _setBehavior() {
    for (const ancor of this.component.querySelectorAll(
      '.tab-nav .tab-item:not([not-tab="true"]) button'
    )) {
      ancor.addEventListener(
        'click',
        (event) => {
          this._switchTab(event.currentTarget.parentElement)
          this._switchContent(event.currentTarget.parentElement)
        },
        false
      )
    }
  }
  _switchTab(currentTab) {
    for (const tabItem of this.component.querySelectorAll(
      '.tab-nav .tab-item:not([not-tab="true"])'
    )) {
      if (tabItem === currentTab) {
        tabItem.classList.add('is-active')
      } else {
        tabItem.classList.remove('is-active')
      }
    }
  }
  _switchContent(currentTab) {
    for (const button of currentTab.querySelectorAll('button')) {
      for (const tabPanel of this.component.querySelectorAll('.tab-content .tab-panel')) {
        if (button.getAttribute('data-panel') === tabPanel.getAttribute('id')) {
          tabPanel.classList.add('is-active')
        } else {
          tabPanel.classList.remove('is-active')
        }
      }
    }
  }
}
const abasList = []
for (const brTabs of window.document.querySelectorAll('.br-tabs')) {
  abasList.push(new BRTabs('br-tabs', brTabs))
}
export default BRTabs
