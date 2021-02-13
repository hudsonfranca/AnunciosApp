import React from 'react'
import { CategoryProps } from '../shared/Types'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { OptionsContainer, TitleTwo } from '../styles/components/filterForm'

interface Props {
  queryName: string
  handleChangeName(e: any): void
  search(params: { page?: number }): void
  states: {
    nome: string
    sigla: string
  }[]
  handleRadioStateChange(e: any): void
  queryState: string
  cities: string[]
  handleRadioCityChange(e: any): void
  queryCity: string
  categories: CategoryProps
  handleRadioCategoryChange(e: any): void
  queryCategory: string
}
export const FilterForm: React.FC<Props> = ({
  categories,
  cities,
  handleChangeName,
  handleRadioCategoryChange,
  handleRadioCityChange,
  handleRadioStateChange,
  queryCategory,
  queryCity,
  queryName,
  queryState,
  search,
  states
}) => (
  <>
    <Form.Group className="d-flex flex-column justify-content-between align-items-center">
      <TitleTwo>Palavra-Chave</TitleTwo>
      <Form.Control
        className="mt-3"
        value={queryName}
        onChange={handleChangeName}
        name="name"
      />
      <Button className="mt-2" onClick={() => search({})} type="button">
        Filtrar
      </Button>
    </Form.Group>
    <Form.Group as={Row} className="">
      <Col>
        <TitleTwo>Estados</TitleTwo>
        <OptionsContainer>
          {states.map(state => (
            <Form.Check
              custom
              type="radio"
              id={state.sigla}
              label={state.nome}
              key={state.sigla}
              name="state"
              value={state.sigla}
              onChange={handleRadioStateChange}
              checked={queryState === state.sigla}
            />
          ))}
        </OptionsContainer>
      </Col>
    </Form.Group>

    {cities && (
      <Form.Group as={Row}>
        <Col>
          <Form.Label as="legend" className="text-primary">
            <TitleTwo>Cidades</TitleTwo>
          </Form.Label>
          <OptionsContainer>
            {cities.map(city => (
              <Form.Check
                custom
                type="radio"
                id={city}
                label={city}
                key={city}
                name="city"
                value={city}
                onChange={handleRadioCityChange}
                checked={queryCity === city}
              />
            ))}
          </OptionsContainer>
        </Col>
      </Form.Group>
    )}

    <Form.Group as={Row}>
      <Col>
        <Form.Label as="legend" className="text-primary">
          <TitleTwo>Categorias</TitleTwo>
        </Form.Label>
        <OptionsContainer>
          {categories.categories.map(category => (
            <Form.Check
              custom
              type="radio"
              id={category.id}
              label={category.name}
              value={category.id}
              key={category.id}
              onChange={handleRadioCategoryChange}
              checked={queryCategory === category.id}
            />
          ))}
        </OptionsContainer>
      </Col>
    </Form.Group>
  </>
)
