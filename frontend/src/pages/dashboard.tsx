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
import { UserType, AdvertsType, AdvertsQueryParams } from '../shared/Types'
import buildClient from '../services/buildClient'
import { useRouter } from 'next/router'
import { ToastContainer } from 'react-toastify'

import {
  Row,
  Col,
  Form,
  Button,
  Card,
  ListGroup,
  ListGroupItem
} from 'react-bootstrap'
import { Pagination } from '../components/Pagination'
import { UpdateUserModal } from '../components/UpdateUserModal'

const Dashboard = ({
  adverts,
  user,
  query
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/signin')
    }
  }, [])

  const advertsPerPage = 10

  const [queryName, setQueryName] = useState('')
  const [pageNumber, setPageNumber] = useState(1)

  useEffect(() => {
    setQueryName(query?.name ? query.name : '')
  }, [])

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
  return user ? (
    <Container>
      <ToastContainer />
      <UpdateUserModal show={show} onHide={() => setShow(false)} user={user} />
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
              <OptionsItems>Criar anúncio</OptionsItems>
            </OptionsContainer>
          </Col>
        </Row>
      </Options>
      <Adverts>
        {adverts?.adverts ? (
          <CardContainer>
            {adverts.adverts.map(add => (
              <Card key={add.id}>
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
  const user: UserType = await buildClient(context)
    .get<UserType>('auth/current-user')
    .then(({ data }) => data)
    .catch(() => {
      return null
    })

  let { name, page, limit } = context.query

  const query: AdvertsQueryParams = context.query

  name = name || ''
  const adverts: AdvertsType = await buildClient(context)
    .get<AdvertsType>(
      `adverts/user/my-adverts?page=${page}&limit=${limit}&name=${name}`
    )
    .then(({ data }) => data)
    .catch(() => {
      return null
    })

  return {
    props: { user, adverts }
  }
}

export default Dashboard
