import React from 'react'
import { Container } from 'react-bootstrap'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

export const Layout: React.FC = ({ children }) => {
  return (
    <Container fluid className="p-0">
      <Header />
      {children}
      <Footer />
    </Container>
  )
}
