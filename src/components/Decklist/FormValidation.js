import * as yup from 'yup'

export const formSchema = yup.object().shape({
  name: yup.string().min(2).required(),
  lastname: yup.string().min(2).required(),
  playerId: yup.string().test('len', 'Must be exactly 10 characters', val => val.length === 10).required(),
  date: yup.string().required(),
  event: yup.string().required()
})
