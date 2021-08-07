import React, { useState } from 'react'
import Head from 'next/head'
import {
  Container,
  Form,
  Col,
  InputGroup,
  Button,
  Card,
  ListGroup,
  ListGroupItem,
  Alert
} from 'react-bootstrap'
import {
  Image,
  Title,
  CardContainer,
  MapIcon,
  MoneyIcon
} from '../styles/pages/Home'
import { useRouter } from 'next/router'
import estadosCidades from '../shared/estados-cidades.json'
import { InferGetServerSidePropsType } from 'next'
import { AdvertsType } from '../shared/Types'
import buildClient from '../services/buildClient'

const Home = ({
  adverts
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const [name, setName] = useState('')
  const [state, setState] = useState('')

  const states = estadosCidades.estados.map(state => {
    return { nome: state.nome, sigla: state.sigla }
  })

  const handleSubmit = e => {
    e.preventDefault()
    if (state !== '' && name !== '') {
      router.push({
        pathname: 'search-adverts/',
        query: { limit: 10, page: 1, name, state }
      })
    }
  }

  const formatter = new Intl.NumberFormat([], {
    style: 'currency',
    currency: 'BRL'
  })

  const handleCardClick = (id: string) => {
    return router.push(`/adverts/${id}`)
  }
  const [showAlert, setShowAlert] = useState(true)
  return (
    <>
      <Head>
        <title>AnunciosApp</title>
      </Head>
      <Container fluid className="p-0 min-vh-100">
        <Alert show={showAlert} variant="danger">
          <Alert.Heading>
            Se você estiver com o adblock ligado por favor desligue, pois ele
            pode impedir que o site funcione corretamente.
          </Alert.Heading>
          <hr />
          <div className="d-flex justify-content-end">
            <Button
              onClick={() => setShowAlert(false)}
              variant="outline-success"
            >
              Fechar
            </Button>
          </div>
        </Alert>
        <Image>
          <Form onSubmit={handleSubmit} className="p-3">
            <Form.Row className="d-flex justify-content-center mb-3">
              <Title>Estou procurando por...</Title>
            </Form.Row>
            <Form.Row>
              <Form.Group sm md as={Col}>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>O quê</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    type="text"
                    name="search"
                    size="lg"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group sm md as={Col}>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>Onde</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    as="select"
                    custom
                    size="lg"
                    value={state}
                    onChange={e => setState(e.target.value)}
                  >
                    <option value={''}>Escolha um estado</option>
                    {states.map(state => (
                      <option key={state.nome} value={state.sigla}>
                        {state.nome}
                      </option>
                    ))}
                  </Form.Control>
                </InputGroup>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group sm md as={Col}>
                <Button variant="primary" block type="submit">
                  Buscar
                </Button>
              </Form.Group>
            </Form.Row>
          </Form>
        </Image>
        {adverts?.adverts && (
          <CardContainer>
            {adverts.adverts.map(add => (
              <Card
                style={{ width: '100%', height: '100%' }}
                key={add.id}
                onClick={() => handleCardClick(add.id)}
              >
                <Card.Img variant="top" src={add.advertsPhotos[0].url} />
                <Card.Body>
                  <Card.Title>{add.name}</Card.Title>
                </Card.Body>
                <ListGroup className="list-group-flush">
                  <ListGroupItem className="d-flex">
                    <MoneyIcon className="mr-1" />
                    {formatter.format(parseFloat(add.price))}
                  </ListGroupItem>
                  <ListGroupItem>
                    <MapIcon className="mr-1" />
                    {`${add.address.city} ${add.address.state}`}
                  </ListGroupItem>
                </ListGroup>
              </Card>
            ))}
          </CardContainer>
        )}
      </Container>
    </>
  )
}

export const getServerSideProps = async context => {
  const adverts: AdvertsType = await buildClient(context)
    .get<AdvertsType>('/adverts?page=1&limit=8')
    .then(({ data }) => data)
    .catch(() => {
      return null
    })
  return {
    props: { adverts }
  }
}

export default Home
