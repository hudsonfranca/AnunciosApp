import { useFormik } from 'formik'
import { GetServerSideProps } from 'next'
import React from 'react'
import * as Yup from 'yup'
import axios from 'axios'
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap'
import { useRouter } from 'next/router'
import { ToastContainer } from 'react-toastify'
import Head from 'next/head'

const validationSchema = Yup.object({
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

interface Props {
  token: string
}

const ResetPassword: React.FC<Props> = ({ token }) => {
  const router = useRouter()

  const {
    handleBlur,
    handleChange,
    handleSubmit,
    values,
    touched,
    errors,
    isSubmitting,
    submitForm
  } = useFormik({
    initialValues: {
      password: '',
      passwordConfirmation: ''
    },
    validationSchema,
    onSubmit: async values => {
      try {
        await axios.patch(`/api/auth/reset-password/${token}`, {
          password: values.password,
          passwordConfirmation: values.passwordConfirmation
        })

        router.push('/')
      } catch ({ response: { data } }) {
        if (data.statusCode === 401 || data.statusCode === 404) {
        }
      }
    }
  })
  return (
    <>
      <Head>
        <title>Trocar Senha</title>
      </Head>
      <Container fluid className="vh-100">
        <ToastContainer />

        <Row className="justify-content-center h-100 align-items-center ">
          <Col lg={5} md={8} sm={11}>
            <Form
              noValidate
              onSubmit={handleSubmit}
              className="shadow-lg p-5 rounded-3 "
            >
              <Row className="m-4">
                <Col className="d-flex justify-content-center h-100 align-items-center mb-4">
                  <h3>Escolha uma nova senha</h3>
                </Col>
              </Row>
              <Row>
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
              </Row>
              <Row>
                <Form.Group sm md as={Col}>
                  <Form.Label>Confirme sua senha</Form.Label>
                  <Form.Control
                    isInvalid={!!errors.passwordConfirmation}
                    value={values.passwordConfirmation}
                    onChange={handleChange}
                    isValid={
                      touched.passwordConfirmation &&
                      !errors.passwordConfirmation
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
              </Row>
              <Form.Row>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={submitForm}
                  className="mt-3"
                  block
                >
                  {isSubmitting && (
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  )}
                  {isSubmitting ? 'Redefinindo ' : 'Redefinir senha'}
                </Button>
              </Form.Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  return {
    props: {
      token: params.token
    }
  }
}

export default ResetPassword
