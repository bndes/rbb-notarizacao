import datepicker from 'js-datepicker'
import { throwError } from 'rxjs'
class BRDatepicker {
  constructor(name, component, configData) {
    this.name = name
    this.component = component
    // Mensagens de erro padrao
    this._ERRO_1 = 'Data inicial maior que data final '
    this._ERRO_2 = 'Data final maior que data inicial '
    this._ERRO_3 = 'Data deve ser superior a '
    this._ERRO_4 = 'Data deve ser inferior a '
    this._ERRO_5 = 'Data deve estar entre '
    this._ERRO_5_AND = ' e '
    // Configuração padrão do datepicker
    this._formatter = (input, date) => {
      const value = date.toLocaleDateString('pt-BR')
      input.value = value // => '1/1/2099'
    }
    this._onShow = (instance) => {
      instance.el.value = ''
    }
    this._onHide = (instance) => {
      const erro = this._validDate(instance)
      if (instance.dateSelected && !erro) {
        instance.el.value = instance.dateSelected.toLocaleDateString('pt-BR')
        this._validDate(instance)
      }
    }
    this._position = 'bl'
    this._customDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
    this._customMonths = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ]
    this._customOverlayMonths = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ]
    this._overlayButtom = 'Confirma'
    this._overlayPlaceholder = 'Digite um ano'
    // this._maxDate = new Date();
    this._minDate = new Date(2019, 0, 1)
    this._respectDisabledReadOnly = true
    this._noWeekends = false
    this._disableYearOverlay = true
    this._id = `dtp${Math.floor(Math.random() * 100)}`
    this._datepickerProperties = [
      'onSelect',
      'onShow',
      'onHide',
      'onMonthChange',
      'formatter',
      'position',
      'startDay',
      'customDays',
      'customMonths',
      'customOverlayMonths',
      'overlayButtom',
      'overlayPlaceholder',
      'events',
      'alwaysShow',
      'dateSelected',
      'maxDate',
      'minDate',
      'startDate',
      'showAllDates',
      'respectDisabledReadOnly',
      'noWeekends',
      'disabler',
      'disableDates',
      'disableMobile',
      'disableYearOverlay',
      'disabled',
      'id',
    ]
    for (const inputDate of this.component.querySelectorAll('input')) {
      this.picker = datepicker(inputDate, this._configDatepicker(configData))
    }
    this._setBehavior()
  }
  _configDatepicker(configData) {
    const pickerConfig = {}
    for (const key of this._datepickerProperties) {
      pickerConfig[key] = configData ? configData[key] || this[`_${key}`] : this[`_${key}`]
    }
    return pickerConfig
  }
  _setBehavior() {
    for (const datepickerButton of this.component.querySelectorAll('button.icon')) {
      datepickerButton.addEventListener('click', (event) => {
        this._toggleDatepicker(event)
      })
    }
    this.picker.el.addEventListener('keyup', (event) => {
      this._maskDate(event)
    })
  }
  // Funcao para ativar e/ou desativar o componente
  _toggleDatepicker(event) {
    if (!this.component.classList.contains('is-disabled')) {
      event.stopPropagation()
      this.picker.calendarContainer.classList.contains('qs-hidden')
        ? this.picker.show()
        : this.picker.hide()
    }
  }
  // Função para mascarar a data no formato dd/mm/yyyy ao digitar no campo
  _maskDate(event) {
    const date = event.target.value
    if (event.key === 'Enter') {
      this.picker.hide()
      this._focusNextElement()
      return
    }
    const v = date.replace(/\D/g, '').slice(0, 8)
    if (v.length >= 5) {
      event.target.value = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`
      return
    }
    if (v.length >= 3) {
      event.target.value = `${v.slice(0, 2)}/${v.slice(2)}`
      return
    }
    event.target.value = v
  }
  // Funcao para mudar o foco para o proximo elemento
  _focusNextElement() {
    const inputs = Array.prototype.slice.call(
      document.querySelectorAll("input:not([disabled]):not([class='qs-overlay-year']), select")
    )
    const index = (inputs.indexOf(document.activeElement) + 1) % inputs.length
    const input = inputs[index]
    input.focus()
    input.select()
  }
  // Funcao para transferir o valor digitado no input para o componente
  _validDate(instance) {
    const stringDate = instance.el.value
    let range
    const msg_error = []
    try {
      range = instance.getRange()
    } catch (error) {
      throwError(error)
    }
    const date = new Date(stringDate.split('/').reverse().join('/'))
    let valid = false
    if (isFinite(date)) {
      valid = true
      if (range) {
        if (instance.first) {
          if (range.end) {
            valid = !(date > range.end)
            if (!valid) msg_error.push(this._ERRO_1)
          }
        } else if (range.start) {
          valid = !(date < range.start)
          if (!valid) msg_error.push(this._ERRO_2)
        }
      }
      // Validação da data para o minDate e maxDate
      if (instance.minDate && instance.maxDate) {
        valid = !!(date >= instance.minDate && date <= instance.maxDate)
        if (!valid)
          msg_error.push(
            this._ERRO_5 +
              instance.minDate.toLocaleDateString() +
              this._ERRO_5_AND +
              instance.maxDate.toLocaleDateString()
          )
      } else if (instance.minDate) {
        valid = date >= instance.minDate
        if (!valid) msg_error.push(this._ERRO_3 + instance.minDate.toLocaleDateString())
      } else if (instance.maxDate) {
        valid = date <= instance.maxDate
        if (!valid) msg_error.push(this._ERRO_4 + instance.maxDate.toLocaleDateString())
      }
      // Muda a data apenas se for valida
      if (msg_error.length === 0) {
        instance.setDate(date, 1)
        this._showSucess(instance)
      } else {
        this._showError(instance, msg_error)
      }
    }
    return msg_error
  }
  // Funcao mostrar os erros no campo de feedback
  _showError(instance, msg_error) {
    this.component.classList.add('is-invalid')
    this.component.classList.remove('is-valid')
    for (const message of this.component.parentNode.querySelectorAll(
      'div.feedback.is-invalid span'
    )) {
      ;[message.innerText] = msg_error
    }
  }
  _showSucess() {
    this.component.classList.add('is-valid')
    this.component.classList.remove('is-invalid')
  }
  // Funcoes para ativar/desativar o componente
  disableDatepicker() {
    this.component.classList.add('is-disabled')
    this.picker.el.disabled = true
  }
  enableDatepicker() {
    this.component.classList.remove('is-disabled')
    this.picker.el.disabled = false
  }
}
const datepickerList = []
let configData = {}
for (const brDatepicker of window.document.querySelectorAll('.br-datepicker')) {
  if (brDatepicker.classList.contains('range')) {
    configData = { id: 'range-1' }
    datepickerList.push(new BRDatepicker('br-datepicker', brDatepicker, configData))
  } else {
    datepickerList.push(new BRDatepicker('br-datepicker', brDatepicker))
  }
}
export default BRDatepicker
