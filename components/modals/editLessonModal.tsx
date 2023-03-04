import React from 'react'
import Modal from 'react-modal'

import ModalContainer from './modalContainer'
import { useModal } from './modalContext'
import { modalStyles } from './styles'
import EditLessonForm, { EditLessonFormProps } from '../forms/editLessonForm'

const styles = modalStyles()

const EditLessonModal: React.FC<EditLessonFormProps> = (props) => {
  console.log('EditLessonModal', props)

  const { state, dispatch } = useModal()

  const { isOpen } = state

  return (
    <Modal
      ariaHideApp={false}
      isOpen={isOpen}
      contentLabel={'Edit Lesson Modal'}
      onRequestClose={() => dispatch({ type: 'CLOSE_MODAL' })}
      shouldCloseOnOverlayClick={true}
      style={styles}
      closeTimeoutMS={330}
    >
      <ModalContainer title="Edit Lesson Modal">
        <EditLessonForm lesson={props.lesson} />
      </ModalContainer>
    </Modal>
  )
}

export default EditLessonModal
