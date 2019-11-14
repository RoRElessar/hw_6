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

  class Atm extends CreditCard {

    constructor () {
      super()
      this._moneyAmount = 0
      this._bankNoteValues = {
        50: 0,
        100: 0,
        200: 0,
        500: 0,
        1000: 0
      }
    }

    addMoney = (amount, bankNotes = []) => {
      const $this = this
      let sum = 0

      bankNotes.forEach(function (el) {
        if ($this._bankNoteValues.hasOwnProperty(el)) {
          sum += el
          $this._bankNoteValues[el] += 1
        } else {
          sum = 0
          return false
        }
      })

      if (amount === sum) {
        let balance = this._moneyAmount

        balance += amount
        this._moneyAmount = balance
        console.log(this._bankNoteValues)
        return 'You have successfully add money to ATM.'
      } else {
        return 'Something went wrong.'
      }

    }

    showBalance = () => {
      let availableBanknotes = []

      for (const value in this._bankNoteValues) {
        if (this._bankNoteValues[value] > 0) {
          availableBanknotes.push(value)
        }
      }

      return `ATM's balance is $${this._moneyAmount}. Available banknotes: ${availableBanknotes}`
    }

    withdrawCash = (card, amount) => {

    }

  }

  let atm = new Atm()
  let creditCard = new CreditCard()

  console.log(creditCard.addMoney(500))
  console.log(creditCard.addMoney(500))
  console.log(creditCard.addMoney(100))
  console.log(creditCard.showBalance())
  console.log(atm.showBalance())
  console.log(atm.addMoney(500, [200, 200, 100]))
  console.log(atm.addMoney(500, [200, 200, 100]))
  console.log(atm.addMoney(500, [200, 200, 50, 50]))
  console.log(atm.showBalance())

})()
