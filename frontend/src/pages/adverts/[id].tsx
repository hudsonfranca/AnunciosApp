import React from 'react'
import buildClient from '../../services/buildClient'
import { AdvertsById } from '../../shared/Types'
import {
  Cards,
  Container,
  Content,
  Images,
  ContentItem,
  PhoneIcon,
  PricetagsIcon,
  PersonIcon,
  MapIcon,
  Description
} from '../../styles/pages/adverts'
import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'
import '../../styles/pages/imageGallery.css'
import { Card } from 'react-bootstrap'

interface Props {
  adverts: AdvertsById
}

const images = [
  {
    original: 'https://picsum.photos/id/1018/1000/600/',
    thumbnail: 'https://picsum.photos/id/1018/250/150/'
  },
  {
    original: 'https://picsum.photos/id/1015/1000/600/',
    thumbnail: 'https://picsum.photos/id/1015/250/150/'
  },
  {
    original: 'https://picsum.photos/id/1019/1000/600/',
    thumbnail: 'https://picsum.photos/id/1019/250/150/'
  }
]

const Adverts: React.FC<Props> = ({ adverts }) => {
  return (
    <Container>
      <Images>
        <ImageGallery items={images} originalClass="orifinalC" />
      </Images>
      <Content>
        <ContentItem> {adverts.name}</ContentItem>
        <ContentItem>
          <PersonIcon className="mr-3" />
          {`${adverts.user.first_name} ${adverts.user.last_name}`}
        </ContentItem>
        <ContentItem>
          <PhoneIcon className="mr-3" />
          {adverts.user.phone_number}
        </ContentItem>
        <ContentItem>
          <PricetagsIcon className="mr-3" />
          {`R$ ${adverts.price}`}
        </ContentItem>
        <ContentItem>
          <MapIcon className="mr-3" />
          {`${adverts.address.city}, ${adverts.address.state}, ${adverts.address.neighborhood}`}
        </ContentItem>
      </Content>
      <Description>{adverts.description}</Description>
      <Cards></Cards>
    </Container>
  )
}

export const getServerSideProps = async context => {
  const adverts = await buildClient(context)
    .get<AdvertsById>(`adverts/${context.params.id}`)
    .then(({ data }) => data)
    .catch(err => console.log(err))

  return {
    props: { adverts }
  }
}

export default Adverts
