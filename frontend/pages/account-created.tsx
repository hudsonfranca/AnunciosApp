import React from 'react'
import { Container, Row, Col, Image, Button } from 'react-bootstrap'
import Head from 'next/head'
import { useRouter } from 'next/router'
const AccountCreated: React.FC = () => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Conta criada</title>
      </Head>
      <Container
        fluid
        className="vh-100 d-flex justify-content-center align-items-center"
      >
        <Row className="shadow-lg p-5 rounded-3  w-75 h-100">
          <Col>
            <Row className="h-50">
              <Col className="d-flex justify-content-center align-items-center">
                <Image
                  src="/correct.png"
                  style={{ maxWidth: '200px', maxHeight: '200px' }}
                  fluid
                />
              </Col>
            </Row>
            <Row className="h-25">
              <Col className="d-flex justify-content-center align-items-center w-100">
                <h4>A sua conta foi criada com sucesso</h4>
              </Col>
            </Row>
            <Row>
              <Col className="d-flex justify-content-center align-items-center w-100">
                <Button onClick={() => router.push('/')}>
                  Ir para a página inicial
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default AccountCreated
