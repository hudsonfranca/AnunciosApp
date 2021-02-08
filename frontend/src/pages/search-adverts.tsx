import React from 'react'
import { Container } from 'react-bootstrap'
import buildClient from '../services/buildClient'
import { InferGetServerSidePropsType } from 'next'

type AdvertsType = {
  count: number
  adverts: {
    id: string
    name: string
    price: string
    description: string
    categories: [
      {
        id: string
        name: string
      }
    ]
    address: {
      id: string
      zip: string
      street: string
      number: number
      city: string
      state: string
      neighborhood: string
    }
    user: {
      id: string
      email: string
      first_name: string
      last_name: string
      roles: string[]
      phone_number: string
    }
    advertsPhotos: string[]
  }[]
}
const SearchAdverts = ({
  adverts
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Container fluid className="p-0 vh-100">
      {adverts.adverts.map(ad => (
        <>
          <h1>{ad.name}</h1>
          <h3>{ad.description}</h3>
        </>
      ))}
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

  categoryId = categoryId || ''
  price = price || ''
  city = city || ''
  state = state || ''
  name = name || ''
  page = page || ''
  limit = limit || ''
  neighborhood = neighborhood || ''

  const { data } = await buildClient(context).get<AdvertsType>(
    `adverts?page=${page}&limit=${limit}&name=${name}&state=${state}&categoryId=${categoryId}&price=${price}&city=${city}&neighborhood=${neighborhood}`
  )

  return {
    props: {
      adverts: data
    }
  }
}

export default SearchAdverts
