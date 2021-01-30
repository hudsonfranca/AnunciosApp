import React from 'react'
import { Container, Card } from '../styles/pages/signup'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Form, Button, Col } from 'react-bootstrap'
import api from '../services/api'

const validationSchema = Yup.object({
  first_name: Yup.string().required('campo obrigatório'),
  last_name: Yup.string().required('campo obrigatório'),
  phone_number: Yup.string().required('campo obrigatório'),
  status: Yup.boolean().required('campo obrigatório'),
  zip: Yup.string().required('campo obrigatório'),
  city: Yup.string().required('campo obrigatório'),
  number: Yup.number().required('campo obrigatório'),
  street: Yup.string().required('campo obrigatório'),
  neighborhood: Yup.string().required('campo obrigatório'),
  state: Yup.string().required('campo obrigatório'),
  email: Yup.string().email('email invalido').required('campo obrigatório'),
  password: Yup.string()
    .required('campo obrigatório')
    .min(8, 'a senha deve conter no mínimo 8 caracteres'),
  passwordConfirmation: Yup.string().test(
    'passwords-match',
    'As senhas devem ser iguais',
    function (value) {
      return this.parent.password === value
    }
  )
})

const Signup: React.FC = () => {
  const {
    handleBlur,
    handleChange,
    handleSubmit,
    values,
    touched,
    errors
  } = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      phone_number: '',
      status: '',
      zip: '',
      city: '',
      number: '',
      street: '',
      state: '',
      neighborhood: '',
      email: '',
      password: '',
      passwordConfirmation: ''
    },
    validationSchema,
    onSubmit: async values => {
      const { data } = await api.post('', {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
        passwordConfirmation: values.passwordConfirmation,
        phone_number: values.phone_number,
        address: {
          zip: values.zip,
          city: values.city,
          number: values.number,
          street: values.street,
          state: values.state,
          neighborhood: values.neighborhood
        }
      })
    }
  })
  return (
    <Container>
      <Card>
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Nome</Form.Label>
              <Form.Control
                isInvalid={!!errors.first_name}
                value={values.first_name}
                onChange={handleChange}
                isValid={touched.first_name && !errors.first_name}
                placeholder="Seu nome"
                name="first_name"
                onBlur={handleBlur}
              />
              <Form.Control.Feedback type="invalid">
                {errors.first_name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Sobrenome</Form.Label>
              <Form.Control
                isInvalid={!!errors.last_name}
                value={values.last_name}
                onChange={handleChange}
                isValid={touched.last_name && !errors.last_name}
                placeholder="Seu sobrenome"
                name="last_name"
                onBlur={handleBlur}
              />
              <Form.Control.Feedback type="invalid">
                {errors.last_name}
              </Form.Control.Feedback>
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Telefone</Form.Label>
              <Form.Control
                isInvalid={!!errors.phone_number}
                value={values.phone_number}
                onChange={handleChange}
                isValid={touched.phone_number && !errors.phone_number}
                placeholder="Número de telefone"
                name="phone_number"
                onBlur={handleBlur}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phone_number}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>CEP</Form.Label>
              <Form.Control
                isInvalid={!!errors.zip}
                value={values.zip}
                onChange={handleChange}
                isValid={touched.zip && !errors.zip}
                placeholder="CEP"
                name="zip"
                onBlur={handleBlur}
              />
              <Form.Control.Feedback type="invalid">
                {errors.zip}
              </Form.Control.Feedback>
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Cidade</Form.Label>
              <Form.Control
                isInvalid={!!errors.city}
                value={values.city}
                onChange={handleChange}
                isValid={touched.city && !errors.city}
                placeholder="Nome da sua cidade"
                name="city"
                onBlur={handleBlur}
              />
              <Form.Control.Feedback type="invalid">
                {errors.city}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Logradouro</Form.Label>
              <Form.Control
                isInvalid={!!errors.street}
                value={values.street}
                onChange={handleChange}
                isValid={touched.street && !errors.street}
                placeholder="Logradouro"
                name="street"
                onBlur={handleBlur}
              />
              <Form.Control.Feedback type="invalid">
                {errors.street}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Número</Form.Label>
              <Form.Control
                isInvalid={!!errors.number}
                value={values.number}
                onChange={handleChange}
                isValid={touched.number && !errors.number}
                placeholder="Número"
                name="number"
                onBlur={handleBlur}
              />
              <Form.Control.Feedback type="invalid">
                {errors.number}
              </Form.Control.Feedback>
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Bairro</Form.Label>
              <Form.Control
                isInvalid={!!errors.neighborhood}
                value={values.neighborhood}
                onChange={handleChange}
                isValid={touched.neighborhood && !errors.neighborhood}
                placeholder="Seu bairro"
                name="neighborhood"
                onBlur={handleBlur}
              />
              <Form.Control.Feedback type="invalid">
                {errors.neighborhood}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>UF</Form.Label>
              <Form.Control
                isInvalid={!!errors.state}
                value={values.state}
                onChange={handleChange}
                isValid={touched.state && !errors.state}
                placeholder="Seu estado"
                name="state"
                onBlur={handleBlur}
              />
              <Form.Control.Feedback type="invalid">
                {errors.state}
              </Form.Control.Feedback>
            </Form.Group>
          </Form.Row>
          <Button type="submit" size="lg" block>
            Signup
          </Button>
        </Form>
      </Card>
    </Container>
  )
}

export default Signup
