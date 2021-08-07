import React from 'react'
import { Form } from 'react-bootstrap'
import InputMask from 'react-input-mask'

interface Props {
  onChange(e: React.ChangeEvent<any>): void
  isInvalid: boolean
  value: string
  isValid: boolean
  placeholder: string
  name: string
  onBlur(e: React.FocusEvent<HTMLInputElement>): void
  mask: string
}

export const PhoneInput: React.FC<Props> = ({
  isInvalid,
  isValid,
  name,
  onBlur,
  onChange,
  placeholder,
  value,
  mask
}) => {
  return (
    <InputMask mask={mask} onChange={onChange} onBlur={onBlur} name={name}>
      <Form.Control isValid={isValid} />
    </InputMask>
  )
}
