(function () {

  class CreditCard {

    constructor (pin = 1111) {
      this._pin = pin
      this._balance = 0
      this._falseTries = 0
    }

    addMoney = amount => {
      let balance = this._balance

      balance += amount
      this._balance = balance
      return 'You have successfully add money to your account.'
    }

    showBalance = pin => {
      if (pin === this._pin && this._falseTries < 4) {
        let balance = parseFloat(this._balance).toFixed(2)
        this._falseTries = 0
        return `Your balance is $${balance}`
      } else if (pin !== this._pin && this._falseTries < 5) {
        this._falseTries += 1
        return `Your pin code is wrong, try again. ${5 - this._falseTries} tries remains.`
      } else {
        return 'Your card is blocked.'
      }
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

    withdrawCash = (card, pin, amount) => {
      let banknotesArray = []
      const $this = this
      const banknoteValues = this._banknoteValues

      if (card._pin === pin && card._falseTries < 4) {
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

              return `Thank you, here is your money - $${banknotesArray}`
            }

            return 'Sorry, there are no available banknotes'

          }

          return withdraw(amount)

        }
      } else if (pin !== card._pin && card._falseTries < 5) {
        card._falseTries += 1
        return `Your pin code is wrong, try again. ${5 - card._falseTries} tries remains.`
      } else {
        return 'Your card is blocked.'
      }

    }

  }

  let atm = new Atm()
  let creditCard = new CreditCard()

  console.log(creditCard.addMoney(500))
  console.log(creditCard.addMoney(500))
  console.log(creditCard.addMoney(100))
  console.log(creditCard.addMoney(1000))
  console.log(creditCard.showBalance(2332))
  console.log(creditCard.showBalance(1111))
  console.log(atm.showBalance())
  console.log(atm.addMoney(500, [200, 200, 100]))
  console.log(atm.addMoney(500, [200, 200, 100]))
  console.log(atm.addMoney(500, [200, 200, 50, 50]))
  console.log(atm.addMoney(10000, [500, 500, 500, 500, 500, 500, 1000, 1000, 1000, 1000, 1000, 1000, 1000]))
  console.log(atm.getBanknotesQuantity())
  console.log(atm.showBalance())
  console.log(atm.withdrawCash(creditCard, 1111, 1500))
  console.log(creditCard.showBalance())
  console.log(atm.showBalance())
  console.log(atm.getBanknotesQuantity());

})()
