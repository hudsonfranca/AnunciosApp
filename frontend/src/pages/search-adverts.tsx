import React, { useState, useEffect } from 'react'
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap'
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
  CardContainer,
  FilterBar,
  FilterIcon,
  NotFound,
  MapIcon,
  MoneyIcon
} from '../styles/pages/search-adverts'
import { AdvertsType, CategoryProps, AdvertsQueryParams } from '../shared/Types'
import { SideBar } from '../components/SideBar'
import { FilterForm } from '../components/FilterForm'
import Head from 'next/head'

const SearchAdverts = ({
  categories,
  adverts,
  query
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [queryState, setQueryState] = useState('')
  const [queryCity, setQueryCity] = useState('')
  const [queryName, setQueryName] = useState('')
  const [queryCategory, setQueryCategory] = useState('')
  const [queryPrice, setQueryPrice] = useState('')
  const [queryNeighborhood, setQueryNeighborhood] = useState('')
  const [pageNumber, setPageNumber] = useState(1)

  const advertsPerPage = 10

  useEffect(() => {
    setQueryState(query?.state ? query.state : '')
    setQueryCity(query?.city ? query.city : '')
    setQueryName(query?.name ? query.name : '')
    setQueryCategory(query?.categoryId ? query.categoryId : '')
    setCities(findCities(query?.state ? query.state : ''))
  }, [])

  useEffect(() => {
    search({ page: 1 })
  }, [queryCategory, queryCity])

  useEffect(() => {
    setQueryCity('')

    search({ page: 1 })
  }, [queryState])

  useEffect(() => {
    search({})
  }, [pageNumber])

  const router = useRouter()

  const search = (params: { page?: number }) => {
    const { page } = params
    return router.push({
      pathname: 'search-adverts/',
      query: {
        limit: advertsPerPage,
        page: page || pageNumber,
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
    return stateCities[0]?.cidades
  }

  const [cities, setCities] = useState<string[]>()

  const pageCount = Math.ceil(adverts?.count / advertsPerPage)

  const handleStateChange = (sigla: string) => {
    setQueryState(sigla)

    setCities(findCities(sigla))
  }
  const handleCityChange = (city: string) => {
    setQueryCity(city)
  }

  const handleCategoryChange = (id: string) => {
    setQueryCategory(id)
  }

  const handleChangePage = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1)
  }

  const handleChangeName = e => {
    setQueryName(e.target.value)
  }

  const [sidebar, setSidebar] = useState(false)

  const showSidebar = () => {
    setSidebar(!sidebar)
  }

  const formatter = new Intl.NumberFormat([], {
    style: 'currency',
    currency: 'BRL'
  })

  const filterForm = () => (
    <FilterForm
      categories={categories}
      cities={cities}
      handleChangeName={handleChangeName}
      handleCategoryChange={handleCategoryChange}
      handleCityChange={handleCityChange}
      handleStateChange={handleStateChange}
      queryCategory={queryCategory}
      queryCity={queryCity}
      queryName={queryName}
      search={search}
      queryState={queryState}
      states={states}
    />
  )
  const handleCardClick = (id: string) => {
    return router.push(`/adverts/${id}`)
  }
  return (
    <>
      <Head>
        <title>Buscar anúncios</title>
      </Head>
      <SideBar showSidebar={showSidebar} sidebar={sidebar}>
        {filterForm()}
      </SideBar>
      <Container>
        {!sidebar && (
          <FilterBar onClick={() => showSidebar()}>
            <FilterIcon /> Filtrar
          </FilterBar>
        )}
        <Filter>{filterForm()}</Filter>
        <Content>
          {adverts?.adverts ? (
            <CardContainer>
              {adverts.adverts.map(add => (
                <Card key={add.id} onClick={() => handleCardClick(add.id)}>
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
          ) : (
            <NotFound>
              <h4>Não há anúncios que correspondem à sua busca.</h4>
            </NotFound>
          )}
        </Content>
        <PaginationContainer>
          <Pagination
            changePage={handleChangePage}
            pageCount={pageCount || 1}
          />
        </PaginationContainer>
      </Container>
    </>
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
