import React from 'react'
import { CategoryProps } from '../shared/Types'
import { Row, Col, Form, Button } from 'react-bootstrap'
import {
  OptionsContainer,
  TitleTwo,
  OptionsItems
} from '../styles/components/filterForm'

interface Props {
  queryName: string
  handleChangeName(e: any): void
  search(params: { page?: number }): void
  states: {
    nome: string
    sigla: string
  }[]
  handleStateChange(sigle: string): void
  queryState: string
  cities: string[]
  handleCityChange(city: string): void
  queryCity: string
  categories: CategoryProps
  handleCategoryChange(id: string): void
  queryCategory: string
}
export const FilterForm: React.FC<Props> = ({
  categories,
  cities,
  handleChangeName,
  handleCategoryChange,
  handleCityChange,
  handleStateChange,
  queryCategory,
  queryCity,
  queryName,
  queryState,
  search,
  states
}) => (
  <>
    <Row>
      <Col className="d-flex flex-column justify-content-between align-items-center pb-3">
        <TitleTwo>Palavra-Chave</TitleTwo>
        <Form.Control
          className="mt-3"
          value={queryName}
          onChange={handleChangeName}
          name="name"
        />
        <Button
          className="mt-2"
          onClick={() => search({ page: 1 })}
          type="button"
        >
          Filtrar
        </Button>
      </Col>
    </Row>
    <Row className="">
      <Col>
        <TitleTwo>Estados</TitleTwo>
        <OptionsContainer>
          {states.map(state => (
            <OptionsItems
              onClick={() => handleStateChange(state.sigla)}
              key={state.nome}
              selected={queryState === state.sigla}
            >
              {state.nome}
            </OptionsItems>
          ))}
        </OptionsContainer>
      </Col>
    </Row>

    {cities && (
      <Row>
        <Col>
          <TitleTwo>Cidades</TitleTwo>

          <OptionsContainer>
            {cities.map(city => (
              <OptionsItems
                onClick={() => handleCityChange(city)}
                key={city}
                selected={queryCity === city}
              >
                {city}
              </OptionsItems>
            ))}
          </OptionsContainer>
        </Col>
      </Row>
    )}

    <Row>
      <Col>
        <TitleTwo>Categorias</TitleTwo>

        <OptionsContainer>
          {categories.categories.map(category => (
            <OptionsItems
              onClick={() => handleCategoryChange(category.id)}
              key={category.id}
              selected={queryCategory === category.id}
            >
              {category.name}
            </OptionsItems>
          ))}
        </OptionsContainer>
      </Col>
    </Row>
  </>
)
