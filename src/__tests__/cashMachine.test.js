const CashMachine = require('../cashMachine');
const NoteUnavailableException = require('../exceptions/NoteUnavailableException');
const NotEnougnCashException = require('../exceptions/NotEnougnCashException');
const InvalidArgumentException = require('../exceptions/InvalidArgumentException');

describe('Test the cashMachine', () => {
  test('It should initialize with empty banknotesList', () => {
    const cashMachine = new CashMachine();
    const expectedBalance = 0;
    expect(cashMachine.getBalance()).toBe(expectedBalance);
  });

  test('It should initialize with a preset', () => {
    const initialBanknotesList = [
      { value: 100, quantity: 1 },
      { value: 50, quantity: 1 },
      { value: 20, quantity: 1 },
      { value: 10, quantity: 1 },
    ];
    const expectedBalance = 180;
    const cashMachine = new CashMachine(initialBanknotesList);
    expect(cashMachine.getBalance()).toBe(expectedBalance);
  });

  test('It should withdraw available amount', () => {
    const withdrawAmount = 180;
    const initialBanknotesList = [
      { value: 100, quantity: 5 },
      { value: 50, quantity: 5 },
      { value: 20, quantity: 5 },
      { value: 10, quantity: 5 },
    ];
    const expectedBanknotesToSend = [
      { value: 100, quantity: 1 },
      { value: 50, quantity: 1 },
      { value: 20, quantity: 1 },
      { value: 10, quantity: 1 },
    ]
    const cashMachine = new CashMachine(initialBanknotesList);
    expect(cashMachine.withdrawCash(withdrawAmount)).toEqual(expectedBanknotesToSend);
  });

  test('It should withdraw null amount', () => {
    const withdrawAmount = 0;
    const initialBanknotesList = [
      { value: 100, quantity: 5 },
      { value: 50, quantity: 5 },
      { value: 20, quantity: 5 },
      { value: 10, quantity: 5 },
    ];
    const expectedBanknotesToSend = [
      { value: 100, quantity: 0 },
      { value: 50, quantity: 0 },
      { value: 20, quantity: 0 },
      { value: 10, quantity: 0 },
    ]
    const cashMachine = new CashMachine(initialBanknotesList);
    expect(cashMachine.withdrawCash(withdrawAmount)).toEqual(expectedBanknotesToSend);
  });

  test('It should not withdraw amount that cannot be withdrawn with existing banknotes', () => {
    const withdrawAmount = 105;
    const initialBanknotesList = [
      { value: 100, quantity: 1 },
      { value: 50, quantity: 1 },
      { value: 20, quantity: 1 },
      { value: 10, quantity: 1 },
    ];
    const expectedException = NoteUnavailableException;
    const cashMachine = new CashMachine(initialBanknotesList);
    expect(() => cashMachine.withdrawCash(withdrawAmount)).toThrow(expectedException);
  });

  test('It should not withdraw negative amount', () => {
    const withdrawAmount = -110;
    const initialBanknotesList = [
      { value: 100, quantity: 1 },
      { value: 50, quantity: 1 },
      { value: 20, quantity: 1 },
      { value: 10, quantity: 0 },
    ];
    const expectedException = InvalidArgumentException;
    const cashMachine = new CashMachine(initialBanknotesList);
    expect(() => cashMachine.withdrawCash(withdrawAmount)).toThrow(expectedException);
  });

  // test('It should not withdraw too big amount', () => {
  //   const withdrawAmount = 200;
  //   const initialBanknotesList = [
  //     { value: 100, quantity: 1 },
  //     { value: 50, quantity: 1 },
  //     { value: 20, quantity: 1 },
  //     { value: 10, quantity: 1 },
  //   ];
  //   const expectedException = NotEnougnCashException;
  //   const cashMachine = new CashMachine(initialBanknotesList);
  //   expect(() => cashMachine.withdrawCash(withdrawAmount)).toThrow(expectedException);
  // });

  test('It should work with different set of banknotes', () => {
    const withdrawAmount = 115;
    const initialBanknotesList = [
      { value: 100, quantity: 5 },
      { value: 50, quantity: 5 },
      { value: 20, quantity: 5 },
      { value: 10, quantity: 5 },
      { value: 5, quantity: 5 },
    ];
    const expectedBanknotesToSend = [
      { value: 100, quantity: 1 },
      { value: 50, quantity: 0 },
      { value: 20, quantity: 0 },
      { value: 10, quantity: 1 },
      { value: 5, quantity: 1 },
    ]
    const cashMachine = new CashMachine(initialBanknotesList);
    expect(cashMachine.withdrawCash(withdrawAmount)).toEqual(expectedBanknotesToSend);
  });

  // test('It should reduce amount of banknotes after a withdrawal', () => {
  //   const withdrawAmount = 100;
  //   const initialBanknotesList = [
  //     { value: 100, quantity: 5 },
  //     { value: 50, quantity: 5 },
  //     { value: 20, quantity: 5 },
  //     { value: 10, quantity: 5 },
  //   ];
  //   const expectedBalance = 800;
  //   const cashMachine = new CashMachine(initialBanknotesList);
  //   cashMachine.withdrawCash(withdrawAmount);
  //   expect(cashMachine.getBalance()).toEqual(expectedBalance);
  // });
});
