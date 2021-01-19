const { Schema, model } = require( 'mongoose' );

const eventSchema = Schema( {
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

// Vamos a serializar el modelo para que _id aparezca como id y quitamos __v

eventSchema.method( 'toJSON', function() {

  // Usamos una función normal para no perder el this

  const { __v, _id, ...object } = this.toObject();

  object.id = _id;

  return object;

} );


module.exports = model( 'EventModel', eventSchema );
