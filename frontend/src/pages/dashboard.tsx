import React, { useEffect, useState } from 'react'
import { InferGetServerSidePropsType } from 'next'
import {
  Adverts,
  Container,
  Options,
  OptionsContainer,
  OptionsItems,
  TitleTwo,
  CardContainer,
  NotFound,
  MapIcon,
  MoneyIcon,
  PaginationContainer,
  Title
} from '../styles/pages/dashboard'
import {
  UserType,
  AdvertsType,
  AdvertsQueryParams,
  CategoryProps,
  AdvertsById
} from '../shared/Types'
import buildClient from '../services/buildClient'
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify'
import {
  Row,
  Col,
  Form,
  Button,
  Card,
  ListGroup,
  ListGroupItem,
  DropdownButton,
  Dropdown
} from 'react-bootstrap'
import { Pagination } from '../components/Pagination'
import { UpdateUserModal } from '../components/UpdateUserModal'
import { CreateAdvertsModal } from '../components/CreateAdvertsModal'
import { UpdateAdvertsModal } from '../components/UpdateAdvertsModal'

import axios from 'axios'
import { useFetch } from '../hooks/useFetch'

const Dashboard = ({
  adverts,
  query,
  categories
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()

  const { data: user, isError } = useFetch<UserType>('/api/auth/current-user')
  useEffect(() => {
    if (!user || isError) {
      router.push('/signin')
    }
  }, [user, isError])

  const advertsPerPage = 10

  const [queryName, setQueryName] = useState('')
  const [pageNumber, setPageNumber] = useState(1)

  const [advertsId, setAdvertsId] = useState('')

  useEffect(() => {
    setQueryName(query?.name ? query.name : '')
  }, [])

  const [advertsById, setAdvertsById] = useState<AdvertsById>()

  const getAdvertsById = async () => {
    const { data } = await axios.get(`/api/adverts/show/${advertsId}`)
    setAdvertsById(data)
  }

  useEffect(() => {
    if (advertsId) {
      getAdvertsById()
    }
  }, [advertsId])

  useEffect(() => {
    if (user) {
      search({})
    }
  }, [pageNumber])

  const handleChangeName = e => {
    setQueryName(e.target.value)
  }
  const search = (params: { page?: number }) => {
    const { page } = params
    return router.push({
      pathname: '/dashboard',
      query: {
        limit: advertsPerPage,
        page: page || pageNumber,
        name: queryName
      }
    })
  }
  const pageCount = Math.ceil(adverts?.count / advertsPerPage)

  const handleChangePage = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1)
  }
  const [show, setShow] = useState(false)
  const [showCreateAdverts, setShowCreateAdverts] = useState(false)
  const [showUpdateAdverts, setShowUpdateAdverts] = useState(false)
  const notifyDeleteError = () => {
    toast.error('Não foi possível deletar o anúncio .')
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/adverts/${id}`, { withCredentials: true })

      router.reload()
    } catch (error) {
      notifyDeleteError()
    }
  }

  return user ? (
    <Container>
      <ToastContainer />

      <UpdateUserModal show={show} onHide={() => setShow(false)} user={user} />

      <CreateAdvertsModal
        show={showCreateAdverts}
        onHide={() => setShowCreateAdverts(false)}
        categories={categories}
      />
      {advertsById && (
        <UpdateAdvertsModal
          show={showUpdateAdverts}
          onHide={() => setShowUpdateAdverts(false)}
          adverts={advertsById}
          categories={categories}
        />
      )}
      <Title>Meus anúncios</Title>
      <Options>
        <Row>
          <Col className="d-flex flex-column justify-content-between align-items-center pb-4">
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
        <Row>
          <Col className="d-flex flex-column justify-content-between align-items-center w-100 h-100">
            <OptionsContainer>
              <OptionsItems onClick={() => setShow(true)}>
                Editar meu perfil
              </OptionsItems>
              <OptionsItems onClick={() => setShowCreateAdverts(true)}>
                Criar anúncio
              </OptionsItems>
            </OptionsContainer>
          </Col>
        </Row>
      </Options>
      <Adverts>
        {adverts?.adverts ? (
          <CardContainer>
            {adverts.adverts.map((add: AdvertsById) => (
              <Card key={add.id}>
                <Card.Header className="d-flex justify-content-end">
                  <DropdownButton id="dropdown-basic-button" size="sm" title="">
                    <Dropdown.Item
                      href="#"
                      onClick={() => handleDelete(add.id)}
                    >
                      Deletar
                    </Dropdown.Item>
                    <Dropdown.Item
                      href="#"
                      onClick={() => {
                        setShowUpdateAdverts(true)
                        setAdvertsId(add.id)
                      }}
                    >
                      Editar
                    </Dropdown.Item>
                  </DropdownButton>
                </Card.Header>
                <Card.Img
                  variant="top"
                  src="https://midias.agazeta.com.br/2020/11/18/carro-foi-roubado-em-linhares--363189-article.jpeg "
                />
                <Card.Body>
                  <Card.Title>{add.name}</Card.Title>
                </Card.Body>
                <ListGroup className="list-group-flush">
                  <ListGroupItem className="d-flex">
                    <MoneyIcon className="mr-1" />
                    R$ {add.price}
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
      </Adverts>
      <PaginationContainer>
        <Pagination changePage={handleChangePage} pageCount={pageCount || 1} />
      </PaginationContainer>
    </Container>
  ) : (
    <Container></Container>
  )
}
export const getServerSideProps = async context => {
  let { name, page, limit } = context.query

  const query: AdvertsQueryParams = context.query

  name = name || ''
  page = page || 1
  limit = limit || 10

  const adverts: AdvertsType = await buildClient(context)
    .get<AdvertsType>(
      `adverts/user/my-adverts?page=${page}&limit=${limit}&name=${name}`
    )
    .then(({ data }) => data)
    .catch(() => {
      return null
    })

  const { data: categories } = await buildClient(context).get<CategoryProps>(
    'category?page=1&limit=100'
  )

  return {
    props: { adverts, categories, query }
  }
}

export default Dashboard
