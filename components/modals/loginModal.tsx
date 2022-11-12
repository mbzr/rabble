import AuthForm from '@/components/forms/authForm'
import React from 'react'
import Modal from 'react-modal'

import ModalContainer from './modalContainer'
import { useModal } from './modalContext'
import { modalStyles } from './styles'

const styles = modalStyles()

const LoginModal = () => {
  const { state, dispatch } = useModal()

  const { isOpen } = state

  return (
    <Modal
      ariaHideApp={false}
      isOpen={isOpen}
      contentLabel={'Login Modal'}
      onRequestClose={() => dispatch({ type: 'CLOSE_MODAL' })}
      shouldCloseOnOverlayClick={true}
      style={styles}
      closeTimeoutMS={330}
    >
      <ModalContainer title="Login Modal">
        <AuthForm type="login" />
      </ModalContainer>
    </Modal>
  )
}

export default LoginModal
