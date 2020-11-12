import SwipeEventDispatcher from './swipe'
class BRWizard {
  constructor(name, component) {
    this.name = name
    this.component = component
    // DOM elements
    this.DOMstrings = {
      stepFormPanelClass: 'wizard-panel',
      stepFormPanels: document.querySelectorAll('.wizard-panel'),
      stepNextBtnClass: 'wizard-btn-next',
      stepPrevBtnClass: 'wizard-btn-prev',
      stepsBar: document.querySelector('.wizard-progress'),
      stepsBarClass: 'wizard-progress',
      stepsBtnClass: 'wizard-progress-btn',
      stepsBtns: document.querySelectorAll(`.wizard-progress-btn`),
      stepsForm: document.querySelector('.wizard-form'),
    }
    // remove class from a set of items
    this.removeAttributes = (elemSet, attrName) => {
      elemSet.forEach((elem) => {
        elem.removeAttribute(attrName)
      })
    }
    // return exect parent node of the element
    this.findParent = (elem, parentClass) => {
      let currentNode = elem
      while (!currentNode.classList.contains(parentClass)) {
        currentNode = currentNode.parentNode
      }
      return currentNode
    }
    // get active button step number
    this.getActiveStep = (elem) => {
      return Array.from(this.DOMstrings.stepsBtns).indexOf(elem)
    }
    // set all steps before clicked (and clicked too) to active
    this.setActiveStep = (activeStepNum) => {
      // remove active state from all the state
      this.removeAttributes(this.DOMstrings.stepsBtns, 'active')
      this.removeAttributes(this.DOMstrings.stepsBtns, 'inactive')
      // set picked items to active
      this.DOMstrings.stepsBtns.forEach((elem, index) => {
        if (index === activeStepNum) {
          elem.setAttribute('active', '')
          elem.focus()
        }
        if (index < activeStepNum) {
          elem.setAttribute('inactive', '')
        }
      })
    }
    // get active panel
    this.getActivePanel = () => {
      let activePanel
      this.DOMstrings.stepFormPanels.forEach((elem) => {
        if (elem.hasAttribute('active')) {
          activePanel = elem
        }
      })
      return activePanel
    }
    // open active panel (and close unactive panels)
    this.setActivePanel = (activePanelNum) => {
      // remove active class from all the panels
      this.removeAttributes(this.DOMstrings.stepFormPanels, 'active')
      // show active panel
      this.DOMstrings.stepFormPanels.forEach((elem, index) => {
        if (index === activePanelNum) {
          elem.setAttribute('active', '')
        }
      })
    }
    this.setStepsNum = () => {
      this.DOMstrings.stepsBtns.forEach((elem, index) => {
        elem.setAttribute('step', index + 1)
      })
    }
    this.setStep = (num) => {
      const activeStep = num <= this.DOMstrings.stepsBtns.length ? num - 1 : 0
      this.setActiveStep(activeStep)
      this.setActivePanel(activeStep)
    }
    this.collapseSteps = () => {
      this.component.setAttribute('collapsed', '')
    }
    this.expandSteps = () => {
      this.component.removeAttribute('collapsed')
    }
    this._setBehavior()
  }
  _setBehavior() {
    // STEPS BAR CLICK FUNCTION
    this.DOMstrings.stepsBar.addEventListener('click', (e) => {
      // check if click target is a step button
      const eventTarget = e.target
      if (!eventTarget.classList.contains(`${this.DOMstrings.stepsBtnClass}`)) {
        e.target.parentNode.click()
        return
      }
      // get active button step number
      const activeStep = this.getActiveStep(eventTarget)
      // set all steps before clicked (and clicked too) to active
      this.setActiveStep(activeStep)
      // open active panel
      this.setActivePanel(activeStep)
    })
    // PREV/NEXT BTNS CLICK
    this.DOMstrings.stepsForm.addEventListener('click', (e) => {
      const eventTarget = e.target
      // check if we clicked on `PREV` or NEXT` buttons
      if (
        !(
          eventTarget.classList.contains(`${this.DOMstrings.stepPrevBtnClass}`) ||
          eventTarget.classList.contains(`${this.DOMstrings.stepNextBtnClass}`)
        )
      ) {
        return
      }
      // find active panel
      const activePanel = this.findParent(eventTarget, `${this.DOMstrings.stepFormPanelClass}`)
      let activePanelNum = Array.from(this.DOMstrings.stepFormPanels).indexOf(activePanel)
      // set active step and active panel onclick
      if (eventTarget.classList.contains(`${this.DOMstrings.stepPrevBtnClass}`)) {
        activePanelNum -= 1
        activePanel.style.left = '1%'
      } else {
        activePanelNum += 1
        activePanel.style.left = '-1%'
      }
      this.setActiveStep(activePanelNum)
      this.setActivePanel(activePanelNum)
    })
    // Set Steps label number
    this.setStepsNum()
    // Set default active step
    if (this.component.hasAttribute('step')) {
      this.setStep(this.component.getAttribute('step'))
    }
    // set steps buttons grid style if it needs to scroll horizontaly
    if (this.component.hasAttribute('scroll') && !this.component.hasAttribute('vertical')) {
      const stepsWidth = Math.round(100 / this.DOMstrings.stepsBtns.length) - 0.5
      this.DOMstrings.stepsBar.style.gridTemplateColumns = `repeat(auto-fit, minmax(100px, ${stepsWidth}% ))`
    }
    // Swipe
    const dispatcher = new SwipeEventDispatcher(this.DOMstrings.stepsBar)
    if (this.component.hasAttribute('vertical')) {
      dispatcher.on('SWIPE_LEFT', () => {
        this.collapseSteps()
      })
      dispatcher.on('SWIPE_RIGHT', () => {
        this.expandSteps()
      })
      this.DOMstrings.stepsForm.ontouchstart = () => {
        this.collapseSteps()
      }
    } else {
      this.DOMstrings.stepsBar.ontouchstart = () => {
        this.expandSteps()
      }
      this.DOMstrings.stepsForm.ontouchstart = () => {
        this.collapseSteps()
      }
    }
  }
}
const wizardList = []
for (const brWizard of window.document.querySelectorAll('.br-wizard')) {
  wizardList.push(new BRWizard('br-wizard', brWizard))
}
export default BRWizard
