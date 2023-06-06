import styled from 'styled-components'
import Link from 'next/link'

export const StyledLessonView = styled.div`
  display: flex;
  flex-direction: column;
  padding: 150px 1rem 0;
`
export const Title = styled.h1`
  font-style: normal;
  font-weight: 700;
  font-size: 35px;
  line-height: 39px;
  margin-bottom: 30px;
`
export const Back = styled(Link)`
  margin-right: 15px;
`
export const LessonWrapper = styled.div`
  display: grid;
  grid-template-areas:
    'header header header'
    'video video video'
    'content content list';
  grid-template-columns: 1fr 1fr 30%;
`
export const LessonHeader = styled.div`
  grid-area: header;
`
export const LessonVideoWrapper = styled.div`
  grid-area: video;

  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  max-width: 100%;
  touch-action: pan-y;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    touch-action: pan-y;
  }
`
export const LessonContent = styled.div`
  grid-area: content;
  margin: 60px 0;
`
export const LessonListHeader = styled.div`
  color: #fff;
  font-size: 20px;
  line-height: 21px;
  font-weight: 700;
  background: #404040;
  border-radius: 20px 20px 0px 0px;
  padding: 16px 30px;
`
export const LessonList = styled.div`
  grid-area: list;
  margin: 60px 0;

  background: #ffffff;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
`
export const LessonListItem = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: space-between;
  padding: 24px 24px;
  background-color: ${({ active }) => (active ? '#f7f7f7' : '#ffffff')};
  pointer-events: ${({ active }) => (active ? 'none' : 'auto')};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
`
export const LessonListItemTitle = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
`
export const LessonListItemMeta = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
`
export const LessonListScroll = styled.div``
