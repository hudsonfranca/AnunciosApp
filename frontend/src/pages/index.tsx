import React, { useState } from 'react'
import Head from 'next/head'
import { Container, Form, Col, InputGroup, Button } from 'react-bootstrap'
import { Image, SearchIcon } from '../styles/pages/Home'
import Link from 'next/link'

import axios from 'axios'
import { useRouter } from 'next/router'
import { InferGetStaticPropsType } from 'next'

type State = {
  id: number
  sigla: string
  nome: string
  regiao: {
    id: number
    sigla: string
    nome: string
  }
}

const Home = ({ states }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter()
  const [name, setName] = useState('')
  const [state, setState] = useState('')

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
                    <option key={state.id} value={state.sigla}>
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

export const getStaticProps = async context => {
  const { data } = await axios.get<State[]>(
    'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome'
  )

  return {
    props: {
      states: data
    }
  }
}

export default Home
