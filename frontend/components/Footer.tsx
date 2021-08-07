import React from 'react'
import { Container } from 'react-bootstrap'

export const Footer: React.FC = () => {
  return (
    <Container fluid className="p-0">
      <footer className="bg-light text-center text-lg-start">
        <div className="text-center p-3">
          © 2020 Copyright:
          <a className="text-dark" href="#">
            AnunciosApp.com
          </a>
        </div>
      </footer>
    </Container>
  )
}
