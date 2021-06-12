import React, { useCallback, useState } from 'react'
import { Button, Modal, Form, Spinner, Col } from 'react-bootstrap'
import axios from 'axios'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { CategoryProps, ViaCepProps } from '../shared/Types'
import NumberFormat from 'react-number-format'

const FILE_SIZE = 160 * 1024
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png']

const validationSchema = Yup.object({
  name: Yup.string().required('*campo obrigatório'),
  price: Yup.string().required('*campo obrigatório'),
  description: Yup.string().required('*campo obrigatório'),
  categoryIds: Yup.string().required('*campo obrigatório'),
  zip: Yup.string().required('*campo obrigatório'),
  city: Yup.string().required('*campo obrigatório'),
  number: Yup.number().required('*campo obrigatório'),
  street: Yup.string().required('*campo obrigatório'),
  neighborhood: Yup.string().required('*campo obrigatório'),
  state: Yup.string().required('*campo obrigatório'),
  image: Yup.mixed()
    .required('*campo obrigatório')
    .test(
      'fileSize',
      'O arquivo é muito grande',
      value => value && value.size <= FILE_SIZE
    )
    .test(
      'fileFormat',
      'Formato inválido',
      value => value && SUPPORTED_FORMATS.includes(value.type)
    )
})

interface Props {
  onHide(): void
  show: boolean
  categories: CategoryProps
}

export const CreateAdvertsModal: React.FC<Props> = ({
  onHide,
  show,
  categories
}) => {
  const router = useRouter()
  const notifyError = () => {
    toast.error('Não foi possível criar o anúncio')
  }
  const [price, setPrice] = useState('')
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
      name: '',
      price: '',
      description: '',
      categoryIds: '',
      zip: '',
      city: '',
      number: '',
      street: '',
      state: '',
      neighborhood: '',
      image: null
    },
    validationSchema,
    onSubmit: async values => {
      try {
        const { data } = await axios.post(
          '/api/adverts',
          {
            name: values.name,
            price: price,
            description: values.description,
            categoryIds: [values.categoryIds],
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
        if (data) {
          const formData = new FormData()
          formData.append('file', values.image)
          const { data: image } = await axios.post(
            `/api/adverts-photos/adverts/${data.id}`,
            formData,
            {
              withCredentials: true
            }
          )

          onHide()
          resetForm()
          router.reload()
        }
      } catch (err) {
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
      onHide={() => {
        setFieldValue('image', '')
        onHide()
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Criar anúncio</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Row>
            <Form.Group sm md as={Col}>
              <Form.Label>Nome</Form.Label>
              <Form.Control
                isInvalid={!!errors.name}
                value={values.name}
                onChange={handleChange}
                isValid={touched.name && !errors.name}
                placeholder="Nome"
                name="name"
                onBlur={handleBlur}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group sm md as={Col}>
              <Form.Label>Preço</Form.Label>
              <NumberFormat
                customInput={Form.Control}
                thousandSeparator={'.'}
                decimalSeparator={','}
                isInvalid={!!errors.price}
                value={values.price}
                decimalScale={2}
                onValueChange={e => {
                  setPrice(e.value)
                  setFieldValue('price', e.formattedValue)
                }}
                isValid={touched.price && !errors.price}
                placeholder="Preço"
                name="price"
                onBlur={handleBlur}
              />
              <Form.Control.Feedback type="invalid">
                {errors.price}
              </Form.Control.Feedback>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group sm md as={Col}>
              <Form.Label>Categoria</Form.Label>
              <Form.Control
                as="select"
                custom
                onChange={handleChange}
                name="categoryIds"
                onBlur={handleBlur}
                isValid={touched.categoryIds && !errors.categoryIds}
                isInvalid={!!errors.categoryIds}
              >
                <option>...</option>
                {categories?.categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.categoryIds}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group sm md as={Col}>
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                isInvalid={!!errors.description}
                value={values.description}
                onChange={handleChange}
                isValid={touched.description && !errors.description}
                placeholder="Descrição"
                name="description"
                onBlur={handleBlur}
                as="textarea"
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group sm md={6} as={Col}>
              <Form.Label>CEP</Form.Label>
              <NumberFormat
                customInput={Form.Control}
                format="#####-###"
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
              <Form.Label>Selecione uma imagem</Form.Label>
              <Form.File id="formcheck-api-custom" custom>
                <Form.File.Input
                  isInvalid={!!errors.image}
                  onChange={event => {
                    setFieldValue('image', event.currentTarget.files[0])
                  }}
                  isValid={touched.image && !errors.image}
                  placeholder="Imagem"
                  name="image"
                  onBlur={handleBlur}
                  accept="image/*"
                />
                <Form.File.Label data-browse="Buscar">
                  {values.image?.name}
                </Form.File.Label>
                <Form.Control.Feedback type="invalid">
                  {errors.image}
                </Form.Control.Feedback>
              </Form.File>
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
            setFieldValue('image', '')
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
          {isSubmitting ? ' criando...' : 'criar'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
