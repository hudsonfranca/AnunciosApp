export type AdvertsById = {
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
}

export type AdvertsType = {
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

export type EstateCities = {
  sigla: string
  nome: string
  cidades: string[]
}

export type CategoryProps = {
  count: number
  categories: [
    {
      id: string
      name: string
    }
  ]
}

export type AdvertsQueryParams = {
  categoryId: string
  price: string
  city: string
  state: string
  name: string
  neighborhood: string
  page: string
  limit: string
}
