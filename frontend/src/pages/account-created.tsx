import React from 'react'
import { Container, Row, Col, Image } from 'react-bootstrap'
import correct from '../assets/correct.png'
import Head from 'next/head'

const AccountCreated: React.FC = () => {
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
                  src={correct}
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
              <Col className="d-flex justify-content-center align-items-center">
                <p>
                  Acesse o link de confirmação que foi enviado para o endereço
                  de email que você usou para criar a sua conta.
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default AccountCreated
