import React, { useState, useEffect } from 'react'
import {
  Row,
  Col,
  Form,
  Button,
  Card,
  CardColumns,
  ListGroup,
  ListGroupItem
} from 'react-bootstrap'
import buildClient from '../services/buildClient'
import { InferGetServerSidePropsType } from 'next'
import estadosCidades from '../shared/estados-cidades.json'
import { Pagination } from '../components/Pagination'
import { useRouter } from 'next/router'
import {
  Container,
  Content,
  Filter,
  PaginationContainer,
  OptionsContainer,
  TitleOne,
  TitleTwo
} from '../styles/pages/search-adverts'
import { AdvertsType, CategoryProps, AdvertsQueryParams } from '../shared/Types'

const SearchAdverts = ({
  categories,
  adverts,
  query
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  console.log(adverts)
  const [queryState, setQueryState] = useState('')
  const [queryCity, setQueryCity] = useState('')
  const [queryName, setQueryName] = useState('')
  const [queryCategory, setQueryCategory] = useState('')
  const [queryPrice, setQueryPrice] = useState('')
  const [queryNeighborhood, setQueryNeighborhood] = useState('')

  useEffect(() => {
    setQueryState(query?.state ? query.state : '')
    setQueryCity(query?.city ? query.city : '')
    setQueryName(query?.name ? query.name : '')
    setQueryCategory(query?.categoryId ? query.categoryId : '')
    setCities(findCities(query?.state ? query.state : ''))
  }, [])

  useEffect(() => {
    search()
  }, [queryState, queryCategory, queryCity])

  const router = useRouter()

  const search = () => {
    return router.push({
      pathname: 'search-adverts/',
      query: {
        limit: 10,
        page: pageNumber,
        name: queryName,
        state: queryState,
        city: queryCity,
        categoryId: queryCategory,
        neighborhood: queryNeighborhood,
        price: queryPrice
      }
    })
  }

  const states = estadosCidades.estados.map(state => {
    return { nome: state.nome, sigla: state.sigla }
  })

  const findCities = (uf: string) => {
    const stateCities = estadosCidades.estados.filter(state => {
      return state.sigla === uf
    })
    return stateCities[0].cidades
  }

  const [cities, setCities] = useState<string[]>()
  const [pageNumber, setPageNumber] = useState(1)

  const advertsPerPage = 10
  const pageCount = Math.ceil(adverts?.count || 1 / advertsPerPage)

  const handleRadioStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryState(e.target.value)

    setCities(findCities(e.target.value))
  }
  const handleRadioCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryCity(e.target.value)
  }

  const handleRadioCategoryChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setQueryCategory(e.target.value)
  }

  const handleChangePage = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected)
  }
  return (
    <Container>
      <Filter>
        <Form.Group className="d-flex flex-column justify-content-between align-items-center">
          <TitleTwo>Palavra-Chave</TitleTwo>
          <Form.Control
            className="mt-3"
            value={queryName}
            onChange={e => setQueryName(e.target.value)}
            name="name"
          />
          <Button className="mt-2" onClick={() => search()} type="button">
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
      </Filter>
      <Content>
        <CardColumns xs>
          {!adverts && <h1>Não a anuncios</h1>}

          {adverts.adverts &&
            adverts.adverts.map(add => (
              <Card key={add.id}>
                <Card.Img
                  variant="top"
                  src="https://midias.agazeta.com.br/2020/11/18/carro-foi-roubado-em-linhares--363189-article.jpeg "
                />
                <Card.Body>
                  <Card.Title>{add.name}</Card.Title>
                  <Card.Text>{add.description}</Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                  <ListGroupItem>R$ {add.price}</ListGroupItem>
                  <ListGroupItem>{`${add.address.city} ${add.address.state}`}</ListGroupItem>
                </ListGroup>
                <Card.Body>
                  <Card.Link href="#">Card Link</Card.Link>
                  <Card.Link href="#">Another Link</Card.Link>
                </Card.Body>
              </Card>
            ))}
        </CardColumns>
      </Content>
      <PaginationContainer>
        <Pagination
          advertsPerPage={advertsPerPage}
          changePage={handleChangePage}
          pageCount={pageCount}
        />
      </PaginationContainer>
    </Container>
  )
}

export const getServerSideProps = async context => {
  let {
    categoryId,
    price,
    city,
    state,
    name,
    neighborhood,
    page,
    limit
  } = context.query

  const query: AdvertsQueryParams = context.query

  categoryId = categoryId || ''
  price = price || ''
  city = city || ''
  state = state || ''
  name = name || ''
  page = page || ''
  limit = limit || ''
  neighborhood = neighborhood || ''

  const adverts = await buildClient(context)
    .get<AdvertsType>(
      `adverts?page=${page}&limit=${limit}&name=${name}&state=${state}&categoryId=${categoryId}&price=${price}&city=${city}&neighborhood=${neighborhood}`
    )
    .then(response => response.data)
    .catch(err => console.log(err))

  const { data: categories } = await buildClient(context).get<CategoryProps>(
    'category?page=1&limit=100'
  )
  return {
    props: {
      categories,
      adverts: adverts || null,
      query
    }
  }
}

export default SearchAdverts
