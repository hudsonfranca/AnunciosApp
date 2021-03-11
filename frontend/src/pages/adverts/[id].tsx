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
import Head from 'next/head'
interface Props {
  adverts: AdvertsById
}

const Adverts: React.FC<Props> = ({ adverts }) => {
  const formatter = new Intl.NumberFormat([], {
    style: 'currency',
    currency: 'BRL'
  })
  const images = adverts.advertsPhotos.map(img => {
    return {
      original: img.url,
      thumbnail: img.url
    }
  })
  return (
    <>
      <Head>
        <title>Anúncios</title>
      </Head>
      <Container>
        <Images>
          <ImageGallery items={images} />
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
            {formatter.format(parseFloat(adverts.price))}
          </ContentItem>
          <ContentItem>
            <MapIcon className="mr-3" />
            {`${adverts.address.city}, ${adverts.address.state}, ${adverts.address.neighborhood}`}
          </ContentItem>
        </Content>
        <Description>{adverts.description}</Description>
        <Cards></Cards>
      </Container>
    </>
  )
}

export const getServerSideProps = async context => {
  const adverts = await buildClient(context)
    .get<AdvertsById>(`adverts/show/${context.params.id}`)
    .then(({ data }) => data)
    .catch(err => console.log(err))

  return {
    props: { adverts }
  }
}

export default Adverts
