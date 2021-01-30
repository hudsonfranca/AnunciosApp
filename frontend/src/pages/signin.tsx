import React from 'react'
import { Container, Card } from '../styles/pages/signin'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Form, Button } from 'react-bootstrap'
import api from '../services/api'

const validationSchema = Yup.object({
  email: Yup.string().email('email invalido').required('campo obrigatório'),
  password: Yup.string()
    .required('campo obrigatório')
    .min(8, 'a senha deve conter no mínimo 8 caracteres')
})

const Signin: React.FC = () => {
  const {
    handleBlur,
    handleChange,
    handleSubmit,
    values,
    touched,
    errors
  } = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema,
    onSubmit: async values => {
      const { data } = await api.post('', {
        email: values.email,
        password: values.password
      })
    }
  })
  return (
    <Container>
      <Card>
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              isInvalid={!!errors.email}
              value={values.email}
              onChange={handleChange}
              isValid={touched.email && !errors.email}
              type="email"
              placeholder="Digite o seu email"
              name="email"
              onBlur={handleBlur}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Senha</Form.Label>
            <Form.Control
              isInvalid={!!errors.password}
              value={values.password}
              onChange={handleChange}
              isValid={touched.password && !errors.password}
              type="password"
              placeholder="Digite a sua senha"
              name="password"
              onBlur={handleBlur}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit">
            Signin
          </Button>
        </Form>
      </Card>
    </Container>
  )
}

export default Signin
