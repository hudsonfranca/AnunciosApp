import React from 'react'
import { Row, Col, Image } from 'react-bootstrap'
import { CorrectImg } from '../styles/pages/VerifiedEmail'
import Link from 'next/link'
import correct from '../assets/correct.png'

export const VerifiedEmail: React.FC = () => {
  return (
    <Row className="shadow-lg p-5 rounded-3  w-75 h-75">
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
          <Col className="d-flex justify-content-center align-items-center">
            <h4>Endereço de email confirmado</h4>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center align-items-center">
            <strong>
              <Link href="/">
                <a> Voltar para a pagina principal</a>
              </Link>
            </strong>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
