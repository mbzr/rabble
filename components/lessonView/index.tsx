import React from 'react'
import Vimeo from '@u-wave/react-vimeo'
import { useRouter } from 'next/router'

import { Container } from '@/components/globals'
import {
  StyledLessonView,
  Title,
  Back,
  LessonWrapper,
  LessonHeader,
  LessonVideoWrapper,
  LessonContent,
  LessonList,
  LessonListHeader,
  LessonListItem,
  LessonListItemTitle,
  LessonListItemMeta,
  LessonListScroll,
} from './style'

const LessonView: React.FC<{ course: any }> = ({ course }) => {
  const router = useRouter()
  const slug = (router.query.slug as string[]) || []
  const lessonSlug = slug[1]
  const publishedLessons = course.lessons.filter(
    (lesson: any) => lesson.isPublished
  )
  const lessonIndex = publishedLessons.findIndex(
    (lesson: any) => lesson.slug === lessonSlug
  )
  const initialLesson = publishedLessons[lessonIndex] || publishedLessons[0]
  const [currentLesson, setCurrentLesson] = React.useState(initialLesson)
  const videoId = currentLesson?.video.id

  React.useEffect(() => {
    router.push(`/courses/${course.slug}/${currentLesson?.slug}`, undefined, {
      shallow: true,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLesson, course])

  return (
    <StyledLessonView>
      <Container>
        <LessonWrapper>
          <LessonHeader>
            <Title>
              <Back href="/courses">&lt;</Back>
              {course.name}
            </Title>
          </LessonHeader>
          <LessonVideoWrapper>
            <Vimeo video={videoId} autoplay={true} width={1200} height={675} />
          </LessonVideoWrapper>
          <LessonContent>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus
              error nesciunt reiciendis, eveniet enim voluptatibus animi
              molestias quos quis quisquam. Fuga, dolorem perspiciatis. Cumque
              tempora quibusdam rem aspernatur voluptatibus iste!
            </p>
          </LessonContent>
          <LessonList>
            <LessonListHeader>Lessons</LessonListHeader>
            <LessonListScroll>
              {publishedLessons.map((lesson: any, index: number) => (
                <LessonListItem
                  key={lesson.id}
                  active={lesson.id === currentLesson.id}
                  onClick={() => setCurrentLesson(lesson)}
                >
                  <LessonListItemTitle>
                    {index + 1}. {lesson.name}
                  </LessonListItemTitle>
                  <LessonListItemMeta>3:52</LessonListItemMeta>
                </LessonListItem>
              ))}
            </LessonListScroll>
          </LessonList>
        </LessonWrapper>
      </Container>
    </StyledLessonView>
  )
}

export default LessonView
