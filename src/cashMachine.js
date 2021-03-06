const R = require('ramda');
const NoteUnavailableException = require('./exceptions/NoteUnavailableException');
const NotEnoughCashException = require('./exceptions/NotEnoughCashException');
const InvalidArgumentException = require('./exceptions/InvalidArgumentException');
const InsufficientFundsException = require('./exceptions/InsufficientFundsException');

/**
 * Class for CashMachine
 * Includes inner property of banknotesList and methods to manipulate it
 * Should be initialized with starting banknotesList with the following format:
 * [
 *   { value: 100, quantity: 15 },
 *   { value: 50, quantity: 32 },
 *   ...
 *  ]
 */

const initialBanknotesList = [
  { value: 100, quantity: 0 },
  { value: 50, quantity: 0 },
  { value: 20, quantity: 0 },
  { value: 10, quantity: 0 },
];

class CashMachine {
  constructor(banknotesList = initialBanknotesList) {
    this._banknotesList = banknotesList.sort((a, b) => b.value - a.value);
  }
  
  getBanknoteAmount(banknote) {
    return banknote.value * banknote.quantity
  }

  getBalance() {
    return this._banknotesList.reduce((sum, banknote) => sum + this.getBanknoteAmount(banknote), 0);
  }

  getBanknoteByValue(banknotesList, value) {
    return banknotesList.find(banknote => banknote.value === value);
  }

  getMaximimPossibleQuantityForBanknote(amount, banknote) {
    const quantity = Math.floor(amount / banknote.value);
    // return Math.min(quantity, banknote.quantity);
    return quantity;
  }

  getRequiredBanknotes(amount) {
    return R.mapAccum(
      (amountRemain, banknote) => {
        const banknoteToSend = {
          value: banknote.value,
          quantity: this.getMaximimPossibleQuantityForBanknote(amountRemain, banknote)
        }
        return [
          amountRemain - this.getBanknoteAmount(banknoteToSend),
          banknoteToSend
        ];
      },
      amount,
      this._banknotesList
    )
  }

  isEnoughCash(amount) {
    // return amount <= this.getBalance();
    return true;
  }

  isEnoughUserBalance() {
    return true;
  }

  reduceBanknotesList(banknotesToSend) {
    this._banknotesList = this._banknotesList.map(banknote => ({
      value: banknote.value,
      quantity: banknote.quantity - this.getBanknoteByValue(banknotesToSend, banknote.value).quantity
    }));
  }

  withdrawCash(amount) {
    if (Number.isNaN(amount) || amount < 0) {
      throw new InvalidArgumentException();
    }
    if (!this.isEnoughUserBalance()) {
      throw new InsufficientFundsException();
    }
    if (!this.isEnoughCash(amount)) {
      throw new NotEnoughCashException();
    }
    const [amountRemain, banknotesToSend] = this.getRequiredBanknotes(amount);
    if (amountRemain > 0) {
      throw new NoteUnavailableException();
    }
    // this.reduceBanknotesList(banknotesToSend);
    return banknotesToSend;
  }
}

module.exports = CashMachine;