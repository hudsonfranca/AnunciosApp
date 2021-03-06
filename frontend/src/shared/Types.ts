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
  advertsPhotos: {
    id: string
    originalname: string
    filename: string
    url: string
  }[]
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
    advertsPhotos: {
      id: string
      originalname: string
      filename: string
      url: string
    }[]
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

export type UserType = {
  id: string
  email: string
  first_name: string
  last_name: string
  roles: string[]
  status: boolean
  confirmationToken: string
  recoverToken: string
  phone_number: string
  address: {
    id: string
    zip: string
    street: string
    number: number
    city: string
    state: string
    neighborhood: string
  }
}

export type ViaCepProps = {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
}
