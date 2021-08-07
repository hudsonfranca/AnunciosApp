import { InferGetServerSidePropsType } from 'next'
import React, { useEffect } from 'react'
import buildClient from '../services/buildClient'
import { useRouter } from 'next/router'
import { useUserAuthentication } from '../context/userAuthentication'

const Signout = ({
  logout
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const { setIsAuthenticated } = useUserAuthentication()

  useEffect(() => {
    if (logout) {
      setIsAuthenticated(false)
      router.push('/')
    }
  }, [])
  return <div></div>
}

export const getServerSideProps = async context => {
  const logout = await buildClient(context)
    .post('/auth/logout')
    .then(() => true)
    .catch(() => false)

  return {
    props: { logout }
  }
}

export default Signout
