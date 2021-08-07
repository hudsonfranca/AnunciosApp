import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap'
import Link from 'next/link'
import { toast, ToastContainer } from 'react-toastify'
import { useRouter } from 'next/router'
import { useUserAuthentication } from '../context/userAuthentication'
import Head from 'next/head'
import buildClient from '../services/buildClient'

const validationSchema = Yup.object({
  email: Yup.string().email('email invalido').required('campo obrigatório'),
  password: Yup.string()
    .required('campo obrigatório')
    .min(8, 'a senha deve conter no mínimo 8 caracteres')
})

const Signin: React.FC = () => {
  const router = useRouter()

  const { setIsAuthenticated } = useUserAuthentication()

  const notifyAuthenticationError = () => {
    toast.error('Email ou senha incorretos.')
  }

  const notifyError = () => {
    toast.error('Não foi possível fazer o login.')
  }

  const {
    handleBlur,
    handleChange,
    handleSubmit,
    values,
    touched,
    errors,
    isSubmitting
  } = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema,
    onSubmit: async values => {
      try {
        await buildClient().post(
          '/auth/signin',
          {
            email: values.email,
            password: values.password
          },
          { withCredentials: true }
        )
        setIsAuthenticated(true)
        router.push('/')
      } catch ({ response: { data } }) {
        setIsAuthenticated(false)
        if (data.statusCode === 401 || data.statusCode === 404) {
          return notifyAuthenticationError()
        }
        return notifyError()
      }
    }
  })

  return (
    <>
      <Head>
        <title>Login</title>
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
                  <h2>Login</h2>
                </Col>
              </Row>
              <Row>
                <Col>
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
                </Col>
              </Row>
              <Row>
                <Col className="pt-4 mb-3">
                  <Button
                    variant="primary"
                    type="submit"
                    block
                    disabled={isSubmitting}
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
                    {isSubmitting ? '  Login...' : 'Login'}
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="w-100 d-flex justify-content-center align-items-center ">
                    <strong className="mr-1">Não tem cadastro?</strong>
                    <strong>
                      <Link href="/signup">
                        <a> cadastre-se</a>
                      </Link>
                    </strong>
                  </div>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Signin
