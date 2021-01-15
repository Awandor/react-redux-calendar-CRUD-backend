const { Schema, model } = require( 'mongoose' );

const userSchema = Schema( {
  title: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'UserModel', // Es una referencia al UserModel
    required: true
  }
} );


module.exports = model( 'EventModel', userSchema );
