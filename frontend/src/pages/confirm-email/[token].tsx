import React, { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { VerifiedEmail } from '../../components/VerifiedEmail'
import { GetServerSideProps } from 'next'
import buildClient from '../../services/buildClient'
import { useRouter } from 'next/router'

interface Props {
  isAuthenticated: boolean
}

const ConfirmEmail: React.FC<Props> = ({ isAuthenticated }) => {
  const router = useRouter()
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
    }
  }, [])
  return (
    <Container
      fluid
      className="vh-100 d-flex justify-content-center align-items-center"
    >
      {isAuthenticated && <VerifiedEmail />}
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  let isAuthenticated: boolean

  try {
    await buildClient(context).patch(
      `auth/confirm-email/${context.params.token}`
    )
    isAuthenticated = true
  } catch (error) {
    console.log(error)
    isAuthenticated = false
  }

  return {
    props: { isAuthenticated }
  }
}

export default ConfirmEmail
