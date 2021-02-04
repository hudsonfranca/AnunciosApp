import React from 'react'
import { Button, Modal, Form, Spinner } from 'react-bootstrap'
import axios from 'axios'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/router'

const validationSchema = Yup.object({
  email: Yup.string().email('email invalido').required('campo obrigatório')
})

interface Props {
  onHide(): void
  show: boolean
}

export const PasswordRecoveryModal: React.FC<Props> = ({ onHide, show }) => {
  const router = useRouter()

  const {
    handleBlur,
    handleChange,
    handleSubmit,
    values,
    touched,
    errors,
    isSubmitting,
    submitForm,
    resetForm
  } = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema,
    onSubmit: async values => {
      try {
        await axios.post('/api/auth/recovery-email', {
          email: values.email
        })

        router.push('/')
      } catch ({ response: { data } }) {
        if (data.statusCode === 401 || data.statusCode === 404) {
        }
      }
    }
  })
  return (
    <Modal
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title>Trocar a senha</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          Identifique-se para receber um e-mail com as instruções e o link para
          criar uma nova senha.
        </p>
        <Form noValidate onSubmit={handleSubmit} className="mt-3">
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
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <a
          href="#"
          onClick={() => {
            onHide()
            resetForm()
          }}
        >
          cancelar
        </a>
        <Button
          type="submit"
          disabled={isSubmitting}
          onClick={submitForm}
          className="ml-4"
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
          {isSubmitting ? ' enviando...' : 'enviar email'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
