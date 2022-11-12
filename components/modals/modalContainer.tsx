import React from 'react'

import { useModal } from './modalContext'
import {
  StyledModalContainer,
  ModalBody,
  Header,
  ModalContent,
  Title,
  CloseButton,
} from './styles'

interface Props {
  children: React.ReactNode
  title: string
}

const ModalContainer: React.FC<Props> = ({ title, children }) => {
  const { dispatch } = useModal()

  return (
    <StyledModalContainer>
      <ModalBody className="modal-body">
        <Header className="modal-header">
          {title && <Title>{title}</Title>}
          <CloseButton
            className="modal-close-button"
            onClick={() => dispatch({ type: 'CLOSE_MODAL' })}
          >
            x
          </CloseButton>
        </Header>

        <ModalContent className="modal-content">{children}</ModalContent>
      </ModalBody>
    </StyledModalContainer>
  )
}

export default ModalContainer
