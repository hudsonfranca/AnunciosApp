import React from 'react'
import { Button, Modal, Form, Spinner, ModalProps } from 'react-bootstrap'
import axios from 'axios'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast, ToastContainer } from 'react-toastify'
import { useRouter } from 'next/router'

const validationSchema = Yup.object({
  email: Yup.string().email('email invalido').required('campo obrigatório')
})

export const PasswordRecoveryModal: React.FC<ModalProps> = props => {
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
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
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
        <a href="">cancelar</a>
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
