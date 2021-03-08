import React, { useCallback } from 'react'
import { Button, Modal, Form, Spinner, Col } from 'react-bootstrap'
import axios from 'axios'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { UserType, ViaCepProps } from '../shared/Types'
import NumberFormat from 'react-number-format'

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
  email: Yup.string().email('email invalido').required('*campo obrigatório')
})

interface Props {
  onHide(): void
  show: boolean
  user: UserType
}

export const UpdateUserModal: React.FC<Props> = ({ onHide, show, user }) => {
  const router = useRouter()
  const notifyError = () => {
    toast.error('Não foi possível editar os seus dados.')
  }

  const {
    handleBlur,
    handleChange,
    handleSubmit,
    values,
    touched,
    errors,
    isSubmitting,
    submitForm,
    resetForm,
    setFieldValue
  } = useFormik({
    initialValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      phone_number: user.phone_number,
      zip: user.address.zip,
      city: user.address.city,
      number: user.address.number,
      street: user.address.street,
      state: user.address.state,
      neighborhood: user.address.neighborhood,
      email: user.email
    },
    validationSchema,
    onSubmit: async values => {
      try {
        await axios.patch(
          `/api/user/${user.id}`,
          {
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            phone_number: values.phone_number,
            status: true,
            address: {
              zip: values.zip,
              city: values.city,
              number: values.number,
              street: values.street,
              state: values.state,
              neighborhood: values.neighborhood
            }
          },
          {
            withCredentials: true
          }
        )

        onHide()
        resetForm()
        router.reload()
      } catch ({ response: { data } }) {
        const notifyEmailError = () => {
          toast.error(`${values.email} já está em uso.`)
        }
        if (data.statusCode === 409) {
          return notifyEmailError()
        }

        return notifyError()
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
    <Modal
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Perfil</Modal.Title>
      </Modal.Header>

      <Modal.Body>
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

              <NumberFormat
                customInput={Form.Control}
                format="(##) #####-####"
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
          {isSubmitting ? ' enviando...' : 'enviar'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
