import React from 'react'
import styled from 'styled-components'

import theme from '@/lib/theme'

export const StyledAccordion = styled.div`
  background-color: ${theme.colors.grey.light};
  margin-bottom: 0.5em;
`

export const StyledHeader = styled.div`
  cursor: pointer;
  position: relative;
  padding: 1em 1em 1em 2em;

  font-style: normal;
  font-weight: 600;
  font-size: 28px;
  line-height: 34px;

  svg {
    border-radius: 50%;
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 1em;
    transform: translateY(-50%);
    transition: transform 0.5s;
    transform-origin: 50%;
  }
`

export const StyledContent = styled.div`
  overflow: hidden;
  display: block;

  font-style: normal;
  font-weight: 500;
  font-size: 20px;

  max-height: 0;
  padding: 0 1em;

  transition: max-height 0.15s ease-out, padding 0.15s;
`

interface Props {
  children: React.ReactNode
}

interface AccordionContextType {
  open: boolean
  toggle: () => void
}

const AccordionContext = React.createContext<AccordionContextType>(
  {} as AccordionContextType
)
AccordionContext.displayName = 'AccordionContext'

export const Accordion: React.FC<Props> = (props) => {
  const [open, setOpen] = React.useState(false)
  const toggle = () => setOpen(!open)

  return (
    <AccordionContext.Provider value={{ open, toggle }}>
      <StyledAccordion {...props} />
    </AccordionContext.Provider>
  )
}

const useAccordion = () => {
  const context = React.useContext(AccordionContext)

  if (!context) {
    throw new Error(
      'useAccordion has to be used within <AccordionContext.Provider>'
    )
  }

  return context
}

export const AccordionHeader: React.FC<Props> = ({ children }) => {
  const { open, toggle } = useAccordion()
  return (
    <StyledHeader onClick={toggle}>
      <svg
        width="15"
        height="23"
        viewBox="0 0 15 23"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: open
            ? 'translateY(-50%) rotate(90deg)'
            : 'translateY(-50%) rotate(0deg)',
        }}
      >
        <path
          d="M13.8509 11.6776C14.3869 11.046 14.3093 10.0994 13.6776 9.56341L3.384 0.828959C2.75233 0.29297 1.80575 0.370534 1.26976 1.0022C0.733771 1.63387 0.811336 2.58045 1.44301 3.11644L10.5929 10.8804L2.82896 20.0303C2.29297 20.662 2.37053 21.6086 3.0022 22.1445C3.63387 22.6805 4.58045 22.603 5.11644 21.9713L13.8509 11.6776ZM10.9811 12.3536L12.8297 12.2021L12.5847 9.21216L10.7361 9.36364L10.9811 12.3536Z"
          fill="black"
        />
      </svg>

      <span>{children}</span>
    </StyledHeader>
  )
}

// 🐨 do the same thing to this that you did to the ToggleOn component
export const AccordionContent: React.FC<Props> = ({ children }) => {
  const { open } = useAccordion()

  return (
    <StyledContent
      style={{
        maxHeight: open ? '500px' : '0',
        // paddingTop: open ? '1em' : '0',
        transition: 'max-height .5s ease-in,padding .5s',
        paddingBottom: open ? '1em' : '0',
      }}
    >
      {children}
    </StyledContent>
  )
}

export default Accordion
