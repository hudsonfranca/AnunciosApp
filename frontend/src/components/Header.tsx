import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import Link from 'next/link'

import { useUserAuthentication } from '../context/userAuthentication'

const Header = () => {
  const { isAuthenticated } = useUserAuthentication()
  const links = [
    !isAuthenticated && { label: 'Criar conta', href: '/signup' },
    !isAuthenticated && { label: 'Login', href: '/signin' },
    isAuthenticated && { label: 'Sair', href: '/signout' },
    isAuthenticated && { label: 'Minha conta', href: '/dashboard' }
  ]
    .filter(linkConfig => linkConfig)
    .map(({ label, href }) => {
      return (
        <Link href={href} key={href} passHref>
          <Nav.Link>{label}</Nav.Link>
        </Link>
      )
    })
  return (
    <Navbar bg="light" expand="lg" fixed="top" className="mb-4 ">
      <Navbar.Brand>
        <a>Anuncios-App</a>
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Link href="/" passHref>
            <Nav.Link>Home</Nav.Link>
          </Link>
        </Nav>
        <Nav>{links}</Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}
export default Header
