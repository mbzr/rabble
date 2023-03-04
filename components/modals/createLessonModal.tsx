import React from 'react'
import Modal from 'react-modal'

import ModalContainer from './modalContainer'
import { useModal } from './modalContext'
import { modalStyles } from './styles'
import CreateLessonForm, {
  CreateLessonFormProps,
} from '../forms/createLessonForm'

const styles = modalStyles()

const CreateLessonModal: React.FC<CreateLessonFormProps> = (props) => {
  console.log('CreateLessonModal', props)

  const { state, dispatch } = useModal()

  const { isOpen } = state

  return (
    <Modal
      ariaHideApp={false}
      isOpen={isOpen}
      contentLabel={'Create Lesson Modal'}
      onRequestClose={() => dispatch({ type: 'CLOSE_MODAL' })}
      shouldCloseOnOverlayClick={true}
      style={styles}
      closeTimeoutMS={330}
    >
      <ModalContainer title="Create Lesson Modal">
        <CreateLessonForm
          courseId={props.courseId}
          folderUri={props.folderUri}
        />
      </ModalContainer>
    </Modal>
  )
}

export default CreateLessonModal
