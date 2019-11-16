(function () {

  class CreditCard {

    constructor () {
      this._balance = 0
    }

    addMoney = amount => {
      let balance = this._balance

      balance += amount
      this._balance = balance
      return 'You have successfully add money to your account.'
    }

    showBalance = () => {
      let balance = parseFloat(this._balance).toFixed(2)
      return `Your balance is $${balance}`
    }

  }

  class Atm {

    constructor () {
      this._moneyAmount = 0
      this._banknoteValues = {
        50: 0,
        100: 0,
        200: 0,
        500: 0,
        1000: 0
      }
    }

    getBanknotesQuantity = () => {
      let availableBanknotes = []
      const bankNoteValues = this._banknoteValues

      for (const nominal in bankNoteValues) {
        availableBanknotes.push(` nominal - ${nominal} quantity - ${bankNoteValues[nominal]}`)
      }

      return `Banknote quantity: ${availableBanknotes}`
    }

    addMoney = (amount, bankNotes = []) => {
      const $this = this
      let sum = 0

      bankNotes.forEach(function (el) {
        if ($this._banknoteValues.hasOwnProperty(el)) {
          sum += el
          $this._banknoteValues[el] += 1
        } else {
          sum = 0
          return false
        }
      })

      if (amount === sum) {
        let balance = this._moneyAmount

        balance += amount
        this._moneyAmount = balance
        return 'You have successfully add money to ATM.'
      } else {
        return 'Something went wrong.'
      }

    }

    showBalance = () => {
      let availableBanknotes = []

      for (const value in this._banknoteValues) {
        if (this._banknoteValues[value] > 0) {
          availableBanknotes.push(value)
        }
      }

      return `ATM's balance is $${this._moneyAmount}. Available banknotes: ${availableBanknotes}`
    }

    withdrawCash = (card, amount) => {
      let banknotesArray = []
      const $this = this
      const banknoteValues = this._banknoteValues

      if (card._balance < amount) {
        return 'You don\'t have enough money.'
      } else if (this._moneyAmount < amount) {
        return 'There is not enough money in the ATM.'
      } else if (amount !== 0 && amount % 50 === 0 && card._balance >= amount && this._moneyAmount >= amount) {

        function getAllSubsetsInSet (set) {
          let result = []
          let mask = 1

          do {
            let maskString = mask.toString(2).padStart(set.length, '0')
            result.push(set.filter((item, index) => maskString[index] === '1'))
            mask++
          } while (mask < (2 ** set.length))

          return result
        }

        function getMoney (currencies, limits, amount) {
          const sorted = currencies.sort((a, b) => b - a)

          let workingLimits = {
            ...limits
          }
          let workingAmount = amount
          let result = {}

          for (let i = 0; i < sorted.length; i++) {
            let currentCurrency = sorted[i]
            let desiredBanknotes = Math.floor(workingAmount / currentCurrency)
            let availableBanknotes = workingLimits[currentCurrency]
            let banknotesToBeUsed = (availableBanknotes < desiredBanknotes) ? availableBanknotes : desiredBanknotes

            workingAmount = (workingAmount - (banknotesToBeUsed * currentCurrency))
            workingLimits[currentCurrency] = availableBanknotes - banknotesToBeUsed
            result[currentCurrency] = banknotesToBeUsed
          }

          Object.keys(result).forEach(key => result[key] === 0 && delete result[key])

          if (workingAmount > 0) {
            return {
              result: {},
              error: true
            }
          }

          return {
            result: result,
            error: false
          }
        }

        function withdraw (amount) {
          let limits = banknoteValues
          let currencies = Object.keys(limits).map(item => Number(item))
          let allCurrencyCombinations = getAllSubsetsInSet(currencies)
          let resultsForEachCombination = allCurrencyCombinations.map(combination => {
            return getMoney(combination, limits, amount)
          })

          let succeedResults = resultsForEachCombination.filter(variant => !variant.error)
          if (succeedResults.length) {
            $this._moneyAmount -= amount
            card._balance -= amount
            card._falseTries = 0

            const successResult = succeedResults[0]['result']
            Object.keys(successResult).forEach(key => successResult[key] === false && delete successResult[key])

            for (const nominal in successResult) {
              banknotesArray.push(` nominal - ${nominal}, quantity - ${successResult[nominal]}`)
              $this._banknoteValues[nominal] -= successResult[nominal]
            }

            return `Thank you, here is your money - $${amount}: ${banknotesArray}`
          }

          return 'Sorry, there are no available banknotes'

        }

        return withdraw(amount)

      }

    }

  }

  // Card
  const message = document.getElementById('message')
  const keyboardButtons = document.getElementsByClassName('keyboard-button')
  const numberInput = document.getElementById('input')
  const deleteButton = document.getElementById('delete')
  const submitButton = document.getElementById('submit')
  const addMoneyButton = document.getElementById('add-money')
  const checkBalanceButton = document.getElementById('check-balance')
  const withdrawCashButton = document.getElementById('withdraw-cash')
  const cancelButton = document.getElementById('cancel')
  let moneyAmount

  for (let i = 0; i < keyboardButtons.length; i++) {
    keyboardButtons[i].addEventListener('click', function (e) {
      const value = this.getAttribute('data-value')
      let numberInputValue = numberInput.value

      numberInput.value = numberInputValue + value
      numberInput.dispatchEvent(new Event('change'))
      e.preventDefault()
    })
  }

  deleteButton.addEventListener('click', function (e) {
    numberInput.value = numberInput.value.slice(0, -1)
    numberInput.dispatchEvent(new Event('change'))
    e.preventDefault()
  })

  addMoneyButton.addEventListener('click', function (e) {
    numberInput.addEventListener('change', function () {
      if (this.value.length > 0) {
        submitButton.classList.remove('disabled')
      } else {
        submitButton.classList.add('disabled')
      }
    })
    message.innerText = 'Enter money amount you want to add to your account'
    submitButton.addEventListener('click', function (ev) {
      message.innerText = creditCard.addMoney(parseInt(numberInput.value))
      ev.stopImmediatePropagation()
      ev.preventDefault()
    })
    e.preventDefault()
  })

  checkBalanceButton.addEventListener('click', function (e) {
    numberInput.value = ''
    message.innerText = creditCard.showBalance()
    submitButton.classList.add('disabled')
    e.preventDefault()
  })

  withdrawCashButton.addEventListener('click', function (e) {
    numberInput.addEventListener('change', function () {
      if (this.value.length > 0) {
        submitButton.classList.remove('disabled')
      } else {
        submitButton.classList.add('disabled')
      }
    })
    numberInput.value = ''
    message.innerText = 'Enter amount of money you want to withdraw'
    submitButton.addEventListener('click', function (ev) {
      moneyAmount = numberInput.value
      message.innerText = atm.withdrawCash(creditCard, moneyAmount)
      moneyAmount = 0
      numberInput.value = ''
      ev.stopImmediatePropagation()
      ev.preventDefault()
    })
    e.preventDefault()
  })

  cancelButton.addEventListener('click', function (e) {
    numberInput.value = ''
    submitButton.classList.add('disabled')
    e.preventDefault()
  })

  // ATM
  const keyboardButtonsBack = document.getElementsByClassName('keyboard-button-back')
  const noteInputs = document.getElementsByClassName('note-input-quantity')
  const numberInputBack = document.getElementById('input-back')
  const adminMessage = document.getElementById('admin-message')
  const checkAtmBalanceButton = document.getElementById('check-atm-balance')
  const addMoneyToAtmButton = document.getElementById('add-money-atm')
  const atmSubmitButton = document.getElementById('atm-submit')
  const atmCancelButton = document.getElementById('atm-cancel')
  const atmDeleteButton = document.getElementById('atm-delete')
  const atmBanknotesQuantityButton = document.getElementById('atm-banknotes-quantity')

  for (let i = 0; i < keyboardButtonsBack.length; i++) {
    keyboardButtonsBack[i].addEventListener('click',function (e) {
      const value = this.getAttribute('data-value')
      let numberInputValue = numberInputBack.value

      numberInputBack.value = numberInputValue + value
      numberInputBack.dispatchEvent(new Event('change'))
      e.preventDefault()
    })
  }

  checkAtmBalanceButton.addEventListener('click', function (e) {
    hideInputNotes()
    numberInputBack.value = ''
    adminMessage.innerText = atm.showBalance()
    e.preventDefault()
  })

  addMoneyToAtmButton.addEventListener('click', function (e) {
    adminMessage.innerText = 'Enter money and banknotes amount you want to add'
    displayInputNotes()
    numberInputBack.addEventListener('change', function () {
      if (this.value.length > 0) {
        atmSubmitButton.classList.remove('disabled')
      } else {
        atmSubmitButton.classList.add('disabled')
      }
    })
    atmSubmitButton.addEventListener('click', function (ev) {
      let atmNotesArray = []
      const oneThousandNotesValue = document.getElementById('one-thousand-notes').value
      const fiveHundredNotesValue = document.getElementById('five-hundred-notes').value
      const twoHundredNotesValue = document.getElementById('two-hundred-notes').value
      const oneHundredNotesValue = document.getElementById('one-hundred-notes').value
      const fiftyNotesValue = document.getElementById('fifty-notes')

      if (oneThousandNotesValue > 0 || oneThousandNotesValue !== '') {
        let result = []
        for (let i = 0; i < oneThousandNotesValue; i++) {
          result.push(1000)
          atmNotesArray.push(result)
        }
      }

      if (fiveHundredNotesValue > 0 || fiveHundredNotesValue !== '') {
        let result = []
        for (let i = 0; i < fiveHundredNotesValue; i++) {
          result.push(500)
          atmNotesArray.push(result)
        }
      }

      if (twoHundredNotesValue > 0 || twoHundredNotesValue !== '') {
        let result = []
        for (let i = 0; i < twoHundredNotesValue; i++) {
          result.push(200)
          atmNotesArray.push(result)
        }
      }

      if (oneHundredNotesValue > 0 || oneHundredNotesValue !== '') {
        let result = []
        for (let i = 0; i < oneHundredNotesValue; i++) {
          result.push(100)
          atmNotesArray.push(result)
        }
      }

      if (fiftyNotesValue > 0 || fiftyNotesValue !== '') {
        let result = []
        for (let i = 0; i < fiftyNotesValue; i++) {
          result.push(50)
          atmNotesArray.push(result)
        }
      }
      adminMessage.innerText = atm.addMoney(parseInt(numberInputBack.value), atmNotesArray.flat())
      ev.stopImmediatePropagation()
      ev.preventDefault()
    })
    e.preventDefault()
  })

  function displayInputNotes() {
    for (let i = 0; i < noteInputs.length; i++) {
      noteInputs[i].style.display = 'block'
      noteInputs[i].value = ''
    }
  }

  function hideInputNotes() {
    for (let i = 0; i < noteInputs.length; i++) {
      noteInputs[i].style.display = 'none'
      noteInputs[i].value = ''
    }
  }

  atmCancelButton.addEventListener('click', function (e) {
    numberInputBack.value = ''
    atmSubmitButton.classList.add('disabled')
    e.preventDefault()
  })

  atmDeleteButton.addEventListener('click', function (e) {
    numberInputBack.value = numberInputBack.value.slice(0, -1)
    numberInputBack.dispatchEvent(new Event('change'))
    e.preventDefault()
  })

  atmBanknotesQuantityButton.addEventListener('click', function (e) {
    hideInputNotes()
    numberInputBack.value = ''
    adminMessage.innerText = atm.getBanknotesQuantity()
    atmSubmitButton.classList.add('disabled')
    e.preventDefault()
  })

  let atm = new Atm()
  let creditCard = new CreditCard()

})()
