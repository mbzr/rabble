import styled from 'styled-components'

import theme from '@/lib/theme'

export const modalStyles = (maxWidth = 480) => {
  return {
    // dark background behind all modals
    overlay: {
      background: 'rgba(0, 0, 0, 0.75)',
    },
    // modal root
    content: {
      width: '100%',
      maxWidth: `${maxWidth}px`,
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  }
}

export const StyledModalContainer = styled.div`
  background-color: white;
  color: ${({ theme }) => theme.colors.common.black};
`
export const ModalBody = styled.div`
  padding: 30px;
`
export const Header = styled.div`
  position: relative;
  display: block;

  margin-bottom: 30px;
`
export const ModalContent = styled.div``
export const Title = styled.h5``
export const CloseButton = styled.div`
  position: absolute;
  top: 0;
  right: 0;

  color: ${theme.colors.common.black};
  font-size: 24px;
  cursor: pointer;
`

export const Row = styled.div`
  display: flex;
  justify-content: space-between;

  margin: 0 -15px;
`

export const Col = styled.div`
  flex: 50%;

  padding: 0 15px;
`

export const SuccessMessageStyle = styled.p`
  font-size: 24px;
  line-height: 26px;

  .thankyou {
    font-weight: bold;
  }
  .time-to-reach {
    display: inline;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.brand.main};
  }
`

export const ErrorMessagesStyle = styled.div`
  margin-bottom: 10px;

  span {
    color: red;
    line-height: 16px;
  }
`
