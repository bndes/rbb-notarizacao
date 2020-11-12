class BRUpload {
  /**
   *
   * @param {*} name nome do componente
   * @param {*} component componente
   * @param {*} uploadFiles  promisse de status do upload
   */
  constructor(name, component, uploadFiles) {
    this.name = name
    this.component = component
    this._inputElement = this.component.querySelector('.upload-input')
    this._fileList = this.component.querySelector('.upload-list')
    this._btnUpload = this.component.querySelector('.upload-button')
    this._fileArray = []
    this._uploadFiles = uploadFiles
    this._setBehavior()
  }

  _setBehavior() {
    this.component.addEventListener(
      'dragenter',
      (event) => {
        this._drag(event)
      },
      false
    )

    this.component.addEventListener(
      'dragover',
      (event) => {
        this._drag(event)
      },
      false
    )

    this.component.addEventListener(
      'dragleave',
      (event) => {
        this._onDragEnd(event)
      },
      false
    )
    this.component.addEventListener(
      'dragend',
      (event) => {
        this._onDragEnd(event)
      },
      false
    )

    this.component.addEventListener(
      'drop',
      (event) => {
        this._drop(event)
      },
      false
    )
    if (this._btnUpload) {
      this._btnUpload.addEventListener(
        'click',
        (event) => {
          this._clickUpload()
        },
        false
      )
    }
    if (this._inputElement) {
      this._fileArray = Array.from(this._inputElement.files)
      this._inputElement.addEventListener(
        'change',
        (event) => {
          this._handleFiles(event)
        },
        false
      )
    }
  }

  _clickUpload() {
    this._inputElement.click()
  }
  _drag(event) {
    event.stopPropagation()
    event.preventDefault()
    this._btnUpload.classList.add('bg-support-01')
    // text-secondary-01
    this._btnUpload.classList.add('text-secondary-01')
  }
  _drop(event) {
    event.stopPropagation()
    event.preventDefault()
    this._btnUpload.className = this._btnUpload.className.replace(/\bbg-support-01\b/g, '')
    this._btnUpload.className = this._btnUpload.className.replace(/\btext-secondary-01\b/g, '')
    const dt = event.dataTransfer
    const { files } = dt
    this._handleFiles(files)
  }

  _onDragEnd(event) {
    event.stopPropagation()
    event.preventDefault()

    this._btnUpload.className = this._btnUpload.className.replace(/\bbg-support-01\b/g, '')
    this._btnUpload.className = this._btnUpload.className.replace(/\btext-secondary-01\b/g, '')
  }
  _handleFiles(files) {
    const newFiles = !files.length ? Array.from(this._inputElement.files) : Array.from(files)
    this._fileArray = this._fileArray.concat(newFiles)

    this._updateFileList()
  }
  _updateFileList() {
    if (!this._fileArray.length) {
      this._fileList.innerHTML = ''
      this._info.style.display = ''
    } else {
      this._fileList.innerHTML = ''

      for (let i = 0; i < this._fileArray.length; i++) {
        if ('nowait' in this._fileArray[i]) {
          if (this._fileArray[i].nowait) {
            this._renderItem(i)
          }
        } else {
          const loading = document.createElement('div')
          loading.setAttribute('sm', '')
          loading.classList.add('my-3')
          loading.setAttribute('loading', '')
          this._fileList.appendChild(loading)
          if (this._uploadFiles()) {
            this._uploadFiles().then(() => {
              this._fileArray[i].nowait = true
              this._updateFileList()
            })
          }
        }
      }
    }
  }

  _renderItem(position) {
    const li = document.createElement('div')
    li.className = 'item'
    this._fileList.appendChild(li)
    li.innerHTML = ''
    const name = document.createElement('div')
    name.className = 'name'
    li.appendChild(name)
    this._fileList.appendChild(li)
    const info = document.createElement('div')
    info.className = 'content'
    info.innerHTML = this._fileArray[position].name
    li.appendChild(info)
    const del = document.createElement('div')
    del.className = 'support'
    const btndel = document.createElement('button')
    const spanSize = document.createElement('span')
    spanSize.className = 'mr-1'
    spanSize.innerHTML = this._calcSize(this._fileArray[position].size)
    del.appendChild(spanSize)
    btndel.className = 'br-button'
    btndel.type = 'button'
    btndel.setAttribute('circle', '')
    btndel.setAttribute('mini', '')
    btndel.addEventListener(
      'click',
      () => {
        this._removeFile(position, event)
      },
      false
    )

    const img = document.createElement('i')
    img.className = 'fa fa-trash'
    btndel.appendChild(img)
    del.appendChild(btndel)
    li.appendChild(del)
    this._fileArray[position].nowait = true
  }

  _calcSize(nBytes) {
    let sOutput = ''
    for (
      let aMultiples = ['KB', 'MB', 'GB', 'TB'], nMultiple = 0, nApprox = nBytes / 1024;
      nApprox > 1;
      nApprox /= 1024, nMultiple++
    ) {
      sOutput = `${nApprox.toFixed(2)} ${aMultiples[nMultiple]}`
    }
    return sOutput
  }
  _removeFile(index, event) {
    event.stopPropagation()
    event.preventDefault()
    this._fileArray.splice(index, 1)
    this._updateFileList()
  }
}
const uploadList = []

function uploadTimeout() {
  return new Promise((resolve) => {
    //Colocar aqui um upload para o servidor e retirar o timeout
    return setTimeout(resolve, 3000)
  })
}

for (const brUpload of window.document.querySelectorAll('.br-upload')) {
  uploadList.push(new BRUpload('br-upload', brUpload, uploadTimeout))
}

export default BRUpload
