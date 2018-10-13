module.exports = function NoteUnavailableException(message = 'Note unavailable', meta) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.meta = meta;
};

require('util').inherits(module.exports, Error);