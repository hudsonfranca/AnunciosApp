import React, { useState } from 'react'
import Head from 'next/head'
import { Container, Form, Col, InputGroup, Button } from 'react-bootstrap'
import { Image } from '../styles/pages/Home'
import { useRouter } from 'next/router'
import estadosCidades from '../shared/estados-cidades.json'

const Home = () => {
  const router = useRouter()
  const [name, setName] = useState('')
  const [state, setState] = useState('')

  const states = estadosCidades.estados.map(state => {
    return { nome: state.nome, sigla: state.sigla }
  })

  const handleSubmit = e => {
    e.preventDefault()

    router.push({
      pathname: 'search-adverts/',
      query: { limit: 10, page: 1, name, state }
    })
  }
  return (
    <Container fluid className="p-0 vh-100">
      <Image>
        <Form onSubmit={handleSubmit} className="p-3">
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
    </Container>
  )
}
export default Home
