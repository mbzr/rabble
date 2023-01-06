import React from 'react'

import LoginModal from './loginModal'
import SignupModal from './signupModal'
import CreateLessonModal from './createLessonModal'

type State = {
  modalType: string | null
  modalProps: object
  isOpen: boolean
}

type Action =
  | { type: 'OPEN_MODAL'; modalType: string; modalProps?: object }
  | { type: 'CLOSE_MODAL' }

type Dispatch = (action: Action) => void

interface ModalProviderProps {
  children: React.ReactNode
}

type ModalComponentType = {
  [key: string]: React.ComponentType
}

const modalState: State = {
  modalType: null,
  modalProps: {},
  isOpen: false,
}

function modalReducer(state: State, action: Action) {
  switch (action.type) {
    case 'OPEN_MODAL': {
      return {
        modalType: action.modalType,
        modalProps: {
          ...state.modalProps,
          ...action.modalProps,
        },
        isOpen: true,
      }
    }
    case 'CLOSE_MODAL': {
      return {
        isOpen: false,
        modalType: null,
        modalProps: {},
      }
    }
    default: {
      throw Error(`Incorrect action type: ${(action as Action).type}`)
    }
  }
}

const ModalContext = React.createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined)

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [state, dispatch] = React.useReducer(modalReducer, modalState)

  const value = { state, dispatch }

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
}

const MODAL_COMPONENTS: ModalComponentType = {
  LOGIN_MODAL: LoginModal,
  SIGNUP_MODAL: SignupModal,
  CREATE_LESSON_MODAL: CreateLessonModal,
}

export const useModal = () => {
  const context = React.useContext(ModalContext)

  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider')
  }

  return context
}

export const ModalRoot = () => {
  const { state } = useModal()

  if (!state.modalType) return null

  const SpecificModal =
    MODAL_COMPONENTS[state.modalType as keyof ModalComponentType]
  return <SpecificModal {...state.modalProps} />
}
