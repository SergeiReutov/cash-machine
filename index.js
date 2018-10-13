const R = require('ramda');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const CashMachine = require('./cashMachine');
const InvalidArgumentException = require('./exceptions/InvalidArgumentException');

const port = process.env.PORT || 3001;
const path = __dirname + '/';
const cashMachine = new CashMachine();

const app = express();
const upload = multer();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.put('/api/withdraw', upload.array(),
  (req, res, next) => {
    try {
      const amount = Number(R.path(['body', 'amount'], req));
      if (Number.isNaN(amount) || amount < 0) {
        next(new InvalidArgumentException());
      }
      const banknotes = cashMachine.withdrawCash(amount);
      res.send(banknotes);
    } catch (e) {
      next(e);
    }
  },
  (error, req, res, next) => {
    console.log(error);
    res.status(500).send({ error });
  }
);

app.listen(port, () => console.log(`Listening on port ${port}`));