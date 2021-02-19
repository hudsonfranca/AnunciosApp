import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import Link from 'next/link'
import { UserType } from '../shared/Types'
import { useFetch } from '../hooks/useFetch'

const Header = () => {
  const { data } = useFetch<UserType>('/api/auth/current-user')
  const links = [
    !data && { label: 'Sign Up', href: '/signup' },
    !data && { label: 'Sign In', href: '/signin' },
    data && { label: 'Sign Out', href: '/signout' }
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
      <Navbar.Brand href="#home">Anuncios-App</Navbar.Brand>
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
