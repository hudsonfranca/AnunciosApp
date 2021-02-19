import React from 'react'
import { Container } from 'react-bootstrap'
import Header from './Header'
import { Footer } from './Footer'
import { Main } from './Main'

export const Layout: React.FC = ({ children }) => {
  return (
    <Container fluid className="p-0">
      <Header />
      <Main>{children}</Main>
      <Footer />
    </Container>
  )
}
