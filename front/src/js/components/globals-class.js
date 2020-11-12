import BRAccordion from './accordion'
import BRBreadcrumb from './breadcrumb'
import BRCard from './card'
import BRDatepicker from './datepicker'
import BRFooter from './footer'
import BRHeader from './header'
import BRInput from './input'
import BRList from './list'
import BRMenu from './menu'
import BRMessage from './message'
import BRModal from './modal'
import BRNotification from './notification'
import BRScrim from './scrim'
import BRSelect from './select'
import BRTable from './table'
import BRTabs from './tabs'
import BRTag from './tag'
import BRTagInput from './taginput'
import BRTooltip from './tooltip'
import BRUpload from './upload'
import BRWizard from './wizard'

export default class Globals {
  initInstanceAll() {
    this.initInstanceAccordion()
    this.initInstanceBreadcrumb()
    this.initInstanceCard()
    this.initInstanceDatepicker()
    this.initInstanceFooter()
    this.initInstanceHeader()
    this.initInstanceInput()
    this.initInstanceList()
    this.initInstanceMenu()
    this.initInstanceMessage()
    this.initInstanceModal()
    this.initInstanceNotification()
    this.initInstanceScrim()
    this.initInstanceSelect()
    this.initInstanceTable()
    this.initInstanceTabs()
    this.initInstanceTemplateBase()
    this.initInstanceTooltip()
    this.initInstanceUpload()
    this.initInstanceWizard()
  }
  initInstanceAccordion() {
    const accordionList = []
    for (const brAccordion of window.document.querySelectorAll('.br-accordion')) {
      accordionList.push(new BRAccordion('br-accordion', brAccordion))
    }
  }

  initInstanceBreadcrumb() {
    const breadcrumbList = []
    for (const brBreadcrumb of window.document.querySelectorAll('.br-breadcrumb')) {
      breadcrumbList.push(new BRBreadcrumb('br-breadcrumb', brBreadcrumb))
    }
  }

  initInstanceDatepicker() {
    const datepickerList = []
    for (const brDatepicker of window.document.querySelectorAll('.br-datepicker')) {
      datepickerList.push(new BRDatepicker('br-datepicker', brDatepicker))
    }
  }

  initInstanceFooter() {
    const footerList = []
    for (const brFooter of window.document.querySelectorAll('.br-footer')) {
      footerList.push(new BRFooter('br-footer', brFooter))
    }
  }

  initInstanceHeader() {
    const headerList = []

    for (const brHeader of window.document.querySelectorAll('.br-header')) {
      headerList.push(new BRHeader('br-header', brHeader))
    }
  }
  initInstanceInput() {
    const countries = [
      'Afeganistão',
      'África do Sul',
      'Albânia',
      'Alemanha',
      'Andorra',
      'Angola',
      'Anguilla',
      'Antártida',
      'Antígua e Barbuda',
      'Antilhas Holandesas',
      'Arábia Saudita',
      'Argélia',
      'Argentina',
      'Armênia',
      'Aruba',
      'Austrália',
      'Áustria',
      'Azerbaijão',
      'Bahamas',
      'Bahrein',
      'Bangladesh',
      'Barbados',
      'Belarus',
      'Bélgica',
      'Belize',
      'Benin',
      'Bermudas',
      'Bolívia',
      'Bósnia-Herzegóvina',
      'Botsuana',
      'Brasil',
      'Brunei',
      'Bulgária',
      'Burkina Fasso',
      'Burundi',
      'Butão',
      'Cabo Verde',
      'Camarões',
      'Camboja',
      'Canadá',
      'Cazaquistão',
      'Chade',
      'Chile',
      'China',
      'Chipre',
      'Cingapura',
      'Colômbia',
      'Congo',
      'Coréia do Norte',
      'Coréia do Sul',
      'Costa do Marfim',
      'Costa Rica',
      'Croácia (Hrvatska)',
      'Cuba',
      'Dinamarca',
      'Djibuti',
      'Dominica',
      'Egito',
      'El Salvador',
      'Emirados Árabes Unidos',
      'Equador',
      'Eritréia',
      'Eslováquia',
      'Eslovênia',
      'Espanha',
      'Estados Unidos',
      'Estônia',
      'Etiópia',
      'Fiji',
      'Filipinas',
      'Finlândia',
      'França',
      'Gabão',
      'Gâmbia',
      'Gana',
      'Geórgia',
      'Gibraltar',
      'Grã-Bretanha (Reino Unido, UK)',
      'Granada',
      'Grécia',
      'Groelândia',
      'Guadalupe',
      'Guam (Território dos Estados Unidos)',
      'Guatemala',
      'Guernsey',
      'Guiana',
      'Guiana Francesa',
      'Guiné',
      'Guiné Equatorial',
      'Guiné-Bissau',
      'Haiti',
      'Holanda',
      'Honduras',
      'Hong Kong',
      'Hungria',
      'Iêmen',
      'Ilha Bouvet (Território da Noruega)',
      'Ilha do Homem',
      'Ilha Natal',
      'Ilha Pitcairn',
      'Ilha Reunião',
      'Ilhas Aland',
      'Ilhas Cayman',
      'Ilhas Cocos',
      'Ilhas Comores',
      'Ilhas Cook',
      'Ilhas Faroes',
      'Ilhas Falkland (Malvinas)',
      'Ilhas Geórgia do Sul e Sandwich do Sul',
      'Ilhas Heard e McDonald (Território da Austrália)',
      'Ilhas Marianas do Norte',
      'Ilhas Marshall',
      'Ilhas Menores dos Estados Unidos',
      'Ilhas Norfolk',
      'Ilhas Seychelles',
      'Ilhas Solomão',
      'Ilhas Svalbard e Jan Mayen',
      'Ilhas Tokelau',
      'Ilhas Turks e Caicos',
      'Ilhas Virgens (Estados Unidos)',
      'Ilhas Virgens (Inglaterra)',
      'Ilhas Wallis e Futuna',
      'índia',
      'Indonésia',
      'Irã',
      'Iraque',
      'Irlanda',
      'Islândia',
      'Israel',
      'Itália',
      'Jamaica',
      'Japão',
      'Jersey',
      'Jordânia',
      'Kênia',
      'Kiribati',
      'Kuait',
      'Laos',
      'Látvia',
      'Lesoto',
      'Líbano',
      'Libéria',
      'Líbia',
      'Liechtenstein',
      'Lituânia',
      'Luxemburgo',
      'Macau',
      'Macedônia (República Yugoslava)',
      'Madagascar',
      'Malásia',
      'Malaui',
      'Maldivas',
      'Mali',
      'Malta',
      'Marrocos',
      'Martinica',
      'Maurício',
      'Mauritânia',
      'Mayotte',
      'México',
      'Micronésia',
      'Moçambique',
      'Moldova',
      'Mônaco',
      'Mongólia',
      'Montenegro',
      'Montserrat',
      'Myanma',
      'Namíbia',
      'Nauru',
      'Nepal',
      'Nicarágua',
      'Níger',
      'Nigéria',
      'Niue',
      'Noruega',
      'Nova Caledônia',
      'Nova Zelândia',
      'Omã',
      'Palau',
      'Panamá',
      'Papua-Nova Guiné',
      'Paquistão',
      'Paraguai',
      'Peru',
      'Polinésia Francesa',
      'Polônia',
      'Porto Rico',
      'Portugal',
      'Qatar',
      'Quirguistão',
      'República Centro-Africana',
      'República Democrática do Congo',
      'República Dominicana',
      'República Tcheca',
      'Romênia',
      'Ruanda',
      'Rússia (antiga URSS) - Federação Russa',
      'Saara Ocidental',
      'Saint Vincente e Granadinas',
      'Samoa Americana',
      'Samoa Ocidental',
      'San Marino',
      'Santa Helena',
      'Santa Lúcia',
      'São Bartolomeu',
      'São Cristóvão e Névis',
      'São Martim',
      'São Tomé e Príncipe',
      'Senegal',
      'Serra Leoa',
      'Sérvia',
      'Síria',
      'Somália',
      'Sri Lanka',
      'St. Pierre and Miquelon',
      'Suazilândia',
      'Sudão',
      'Suécia',
      'Suíça',
      'Suriname',
      'Tadjiquistão',
      'Tailândia',
      'Taiwan',
      'Tanzânia',
      'Território Britânico do Oceano índico',
      'Territórios do Sul da França',
      'Territórios Palestinos Ocupados',
      'Timor Leste',
      'Togo',
      'Tonga',
      'Trinidad and Tobago',
      'Tunísia',
      'Turcomenistão',
      'Turquia',
      'Tuvalu',
      'Ucrânia',
      'Uganda',
      'Uruguai',
      'Uzbequistão',
      'Vanuatu',
      'Vaticano',
      'Venezuela',
      'Vietnã',
      'Zâmbia',
      'Zimbábue',
    ]
    const inputList = []
    for (const brInput of window.document.querySelectorAll('.br-input')) {
      inputList.push(new BRInput('br-input', brInput))
    }
    for (const brInput of inputList) {
      brInput.component.querySelectorAll('input.search-autocomplete').forEach(() => {
        brInput.setAutocompleteData(countries)
      })
    }
  }

  initInstanceList() {
    const listList = []
    for (const brList of window.document.querySelectorAll('.br-list[collapsible]')) {
      listList.push(new BRList('br-list-collapsible', brList))
    }
    for (const brList of window.document.querySelectorAll('.br-list[checkable]')) {
      listList.push(new BRList('br-list-checkable', brList))
    }
  }

  initInstanceMenu() {
    const menuList = []
    for (const brMenu of window.document.querySelectorAll('.br-menu')) {
      menuList.push(new BRMenu('br-menu', brMenu))
    }
  }
  initInstanceMessage() {
    const alertList = []
    for (const brMessage of window.document.querySelectorAll('.br-message')) {
      alertList.push(new BRMessage('br-message', brMessage))
    }
  }

  initInstanceModal() {
    const modalList = []
    for (const brModal of window.document.querySelectorAll('.br-modal')) {
      modalList.push(new BRModal('br-modal', brModal))
    }
    for (const brScrim of window.document.querySelectorAll('.br-scrim')) {
      const scrim = new BRScrim('br-scrim', brScrim)
      for (const button of window.document.querySelectorAll('.br-scrim + button')) {
        button.addEventListener('click', () => {
          scrim.showScrim()
        })
      }
    }
  }

  initInstanceNotification() {
    const notificationList = []
    for (const brNotification of window.document.querySelectorAll('.br-notification')) {
      notificationList.push(new BRNotification('br-notification', brNotification))
    }
  }

  initInstanceScrim() {
    const scrimList = []
    for (const brScrim of window.document.querySelectorAll('.br-scrim')) {
      scrimList.push(new BRScrim('br-scrim', brScrim))
    }
    for (const buttonBloco1 of window.document.querySelectorAll('.bloco1 button')) {
      buttonBloco1.addEventListener('click', () => {
        for (const brScrim of scrimList) {
          brScrim.showScrim()
        }
      })
    }
  }

  initInstanceSelect() {
    const selectList = []
    for (const brSelect of window.document.querySelectorAll('.br-select')) {
      selectList.push(new BRSelect('br-select', brSelect))
    }
  }

  initInstanceTable() {
    const tableList = []
    for (const [index, brTable] of window.document.querySelectorAll('.br-table').entries()) {
      tableList.push(new BRTable('br-table', brTable, index))
    }
  }

  initInstanceTabs() {
    const abasList = []
    for (const brTabs of window.document.querySelectorAll('.br-tabs')) {
      abasList.push(new BRTabs('br-tabs', brTabs))
    }
  }

  initInstanceTag() {
    const tagList = []
    for (const brTag of window.document.querySelectorAll('.br-tag')) {
      tagList.push(new BRTag('br-tag', brTag))
    }
  }

  initInstanceTagInput() {
    const tagInputList = []
    for (const brTag of window.document.querySelectorAll('.br-tag-input')) {
      tagInputList.push(new BRTagInput('br-tag-input', brTag))
    }
  }

  initInstanceTooltip() {
    const tooltipList = []
    for (const brTooltip of window.document.querySelectorAll('.br-tooltip')) {
      tooltipList.push(new BRTooltip('br-tooltip', brTooltip))
    }
  }

  initInstanceUpload() {
    const uploadList = []
    for (const brUpload of window.document.querySelectorAll('.br-upload')) {
      uploadList.push(new BRUpload('br-upload', brUpload))
    }
  }

  initInstanceWizard() {
    const wizardList = []
    for (const brWizard of window.document.querySelectorAll('.br-wizard')) {
      wizardList.push(new BRWizard('br-wizard', brWizard))
    }
  }

  initInstanceTemplateBase() {
    const templateBaseList = []
    for (const brTemplateBase of window.document.querySelectorAll('.template-base')) {
      templateBaseList.push(new BRTemplateBase('template-base', brTemplateBase))
    }
  }

  initInstanceBreadcrumb() {
    const breadcrumbList = []
    for (const brBreadcrumb of window.document.querySelectorAll('.br-breadcrumb')) {
      breadcrumbList.push(new BRBreadcrumb('br-breadcrumb', brBreadcrumb))
    }
  }

  initInstanceCard() {
    const listCard = []
    for (const brCard of window.document.querySelectorAll('.br-card')) {
      listCard.push(new BRCard('br-card', brCard))
    }
  }
}
