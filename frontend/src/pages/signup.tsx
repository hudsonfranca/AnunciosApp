import React, { useCallback } from 'react'
import { useRouter } from 'next/router'
import {
  Container,
  Card,
  Image,
  Title,
  Ul,
  Li,
  CheckboxIcon,
  Login
} from '../styles/pages/signup'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Form, Button, Col } from 'react-bootstrap'
import Link from 'next/link'
import axios from 'axios'

const validationSchema = Yup.object({
  first_name: Yup.string().required('*campo obrigatório'),
  last_name: Yup.string().required('*campo obrigatório'),
  phone_number: Yup.string().required('*campo obrigatório'),
  zip: Yup.string().required('*campo obrigatório'),
  city: Yup.string().required('*campo obrigatório'),
  number: Yup.number().required('*campo obrigatório'),
  street: Yup.string().required('*campo obrigatório'),
  neighborhood: Yup.string().required('*campo obrigatório'),
  state: Yup.string().required('*campo obrigatório'),
  email: Yup.string().email('email invalido').required('*campo obrigatório'),
  password: Yup.string()
    .required('*campo obrigatório')
    .min(8, 'a senha deve conter no mínimo 8 caracteres'),
  passwordConfirmation: Yup.string()
    .required('*campo obrigatório')
    .min(8, 'a senha deve conter no mínimo 8 caracteres')
    .test('passwords-match', 'As senhas devem ser iguais', function (value) {
      return this.parent.password === value
    })
})

interface ViaCepProps {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
}

const Signup: React.FC = () => {
  const router = useRouter()
  const {
    handleBlur,
    handleChange,
    handleSubmit,
    values,
    touched,
    errors,
    setFieldValue,
    isSubmitting
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
      try {
        const { data } = await axios.post('/api/auth/signup', {
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
        router.push('/')
      } catch (error) {
        console.log(error)
      }
    }
  })
  const onBlur = useCallback(
    async (event: React.FocusEvent<HTMLInputElement>) => {
      handleBlur(event)
      try {
        const { data } = await axios.get<ViaCepProps>(
          `https://viacep.com.br/ws/${event.target.value}/json/`
        )
        setFieldValue('city', data.localidade)
        setFieldValue('street', data.logradouro)
        setFieldValue('neighborhood', data.bairro)
        setFieldValue('state', data.uf)
      } catch (error) {
        console.log(error)
      }
    },
    []
  )
  return (
    <Container>
      <Image>
        <Title color="#f5f5f5">Lorem ipsum dolor sit amet consectetur.</Title>
        <Ul>
          <Li>
            <CheckboxIcon />
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
          </Li>

          <Li>
            <CheckboxIcon />
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
          </Li>

          <Li>
            <CheckboxIcon />
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
          </Li>

          <Li>
            <CheckboxIcon />
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
          </Li>
        </Ul>
      </Image>
      <Card>
        <Title>Preencha os seus dados</Title>
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Row>
            <Form.Group sm md as={Col}>
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

            <Form.Group sm md as={Col}>
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
            <Form.Group sm md as={Col}>
              <Form.Label>Email</Form.Label>
              <Form.Control
                isInvalid={!!errors.email}
                value={values.email}
                onChange={handleChange}
                isValid={touched.email && !errors.email}
                placeholder="Email"
                name="email"
                onBlur={handleBlur}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group sm md as={Col}>
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
          </Form.Row>
          <Form.Row>
            <Form.Group sm md={6} as={Col}>
              <Form.Label>CEP</Form.Label>
              <Form.Control
                isInvalid={!!errors.zip}
                value={values.zip}
                onChange={handleChange}
                isValid={touched.zip && !errors.zip}
                placeholder="CEP"
                name="zip"
                onBlur={onBlur}
              />
              <Form.Control.Feedback type="invalid">
                {errors.zip}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group sm md={6} as={Col}>
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
          </Form.Row>
          <Form.Row>
            <Form.Group sm md as={Col}>
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
          </Form.Row>
          <Form.Row>
            <Form.Group sm md as={Col}>
              <Form.Label>Número</Form.Label>
              <Form.Control
                isInvalid={!!errors.number}
                value={values.number}
                onChange={handleChange}
                isValid={touched.number && !errors.number}
                placeholder="Número"
                name="number"
                onBlur={handleBlur}
                type="number"
              />
              <Form.Control.Feedback type="invalid">
                {errors.number}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group sm md as={Col}>
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

            <Form.Group sm md as={Col}>
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
          <Form.Row>
            <Form.Group sm md as={Col}>
              <Form.Label>Senha</Form.Label>
              <Form.Control
                isInvalid={!!errors.password}
                value={values.password}
                onChange={handleChange}
                isValid={touched.password && !errors.password}
                placeholder="Sua senha"
                name="password"
                type="password"
                onBlur={handleBlur}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group sm md as={Col}>
              <Form.Label>Confirme sua senha</Form.Label>
              <Form.Control
                isInvalid={!!errors.passwordConfirmation}
                value={values.passwordConfirmation}
                onChange={handleChange}
                isValid={
                  touched.passwordConfirmation && !errors.passwordConfirmation
                }
                type="password"
                placeholder="Repita a sua senha"
                name="passwordConfirmation"
                onBlur={handleBlur}
              />
              <Form.Control.Feedback type="invalid">
                {errors.passwordConfirmation}
              </Form.Control.Feedback>
            </Form.Group>
          </Form.Row>
          <Button type="submit" size="lg" block disabled={isSubmitting}>
            Signup
          </Button>
        </Form>
        <Login>
          <strong>Ja é cadastrado? </strong>
          <strong>
            <Link href="/signin">
              <a> Login</a>
            </Link>
          </strong>
        </Login>
      </Card>
    </Container>
  )
}

export default Signup
