import React from 'react'
import Modal from 'react-modal'
import SignupForm from '../forms/signupForm'

import ModalContainer from './modalContainer'
import { useModal } from './modalContext'
import { modalStyles } from './styles'

const styles = modalStyles()

const SignupModal = () => {
  const { state, dispatch } = useModal()

  const { isOpen } = state

  return (
    <Modal
      ariaHideApp={false}
      isOpen={isOpen}
      contentLabel={'Signup Modal'}
      onRequestClose={() => dispatch({ type: 'CLOSE_MODAL' })}
      shouldCloseOnOverlayClick={true}
      style={styles}
      closeTimeoutMS={330}
    >
      <ModalContainer title="Signup Modal">
        <SignupForm />
      </ModalContainer>
    </Modal>
  )
}

export default SignupModal
