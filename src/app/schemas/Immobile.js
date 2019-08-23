import mongoose from 'mongoose';

// address: Yup.object().shape({
//   street: Yup.string().required(requiredMessage),
//   string: Yup.string(),
//   neighborhood: Yup.string().required(requiredMessage),
//   city: Yup.string().required(requiredMessage),
// }),
// particulars: Yup.object().shape({
//   type: Yup.string().required(requiredMessage),
//   bedroom: Yup.string().required(requiredMessage),
//   bathroom: Yup.string().required(requiredMessage),
//   garage: Yup.string(),
//   area: Yup.string(),
// }),

// map: Yup.object().shape({
//   lat: Yup.string(),
//   lng: Yup.string(),
// }),

// price: Yup.object().shape({
//   sale: Yup.string(),
//   rent: Yup.string(),
// }),
// images: Yup.array(Yup.object()),
// owner: Yup.object().shape({
//   name: Yup.string(),
//   whatsapp: Yup.string(),
//   cpf: Yup.string(),
//   annotation: Yup.string(),
// }),

const ImmobileSchema = new mongoose.Schema({
  address: {
    street: {
      type: String,
      required: true,
    },
    number: Number,
    neighborhood: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },
  type: String,
  particulars: [
    {
      id: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      value: {
        type: String,
        required: true,
      },
    },
  ],
  map: {
    lat: {
      type: String,
      required: true,
    },
    lng: {
      type: String,
      required: true,
    },
  },
  price: {
    sale: Number,
    rent: Number,
  },
  images: [String],
  owner: {
    name: String,
    whatsapp: String,
    cpf: String,
    annotation: String,
  },
});

export default mongoose.model('Immobile', ImmobileSchema);
