import React, { createContext, useState, useContext, useEffect } from 'react'
const AuthenticationContext = createContext()

export function UserAuthenticationProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  return (
    <AuthenticationContext.Provider
      value={{ isAuthenticated, setIsAuthenticated }}
    >
      {children}
    </AuthenticationContext.Provider>
  )
}

export function useUserAuthentication() {
  const context = useContext(AuthenticationContext)
  if (!context) {
    throw new Error('useUserAuthentication must be used within a CountProvider')
  }

  const { isAuthenticated, setIsAuthenticated } = context

  return { isAuthenticated, setIsAuthenticated }
}
