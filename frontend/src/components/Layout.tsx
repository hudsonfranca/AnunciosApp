import React, { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import Header from './Header'
import { Footer } from './Footer'
import { Main } from './Main'
import { UserType } from '../shared/Types'
import axios from 'axios'
import { useUserAuthentication } from '../context/userAuthentication'

export const Layout: React.FC = ({ children }) => {
  const { setIsAuthenticated } = useUserAuthentication()

  const auth = async () => {
    const user = await axios
      .get<UserType>('/api/auth/current-user', { withCredentials: true })
      .then(({ data }) => data)
      .catch(() => {
        return null
      })

    if (user) {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
  }

  useEffect(() => {
    auth()
  }, [])
  return (
    <Container fluid className="p-0">
      <Header />
      <Main>{children}</Main>
      <Footer />
    </Container>
  )
}
