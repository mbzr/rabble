'use client'

import { useMutation, useQuery } from '@apollo/client/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { CreateInstructorMutation, InstructorsQuery } from '../queries'

interface InstructorPickerProps {
  defaultValue?: string
  invalid: boolean
}

// admins only: choose who is credited, or add someone without an account
export const InstructorPicker = ({
  defaultValue,
  invalid,
}: InstructorPickerProps) => {
  const t = useTranslations('CourseForm')
  const { data } = useQuery(InstructorsQuery, { ssr: false })
  const [createInstructor, { loading }] = useMutation(
    CreateInstructorMutation,
    {
      refetchQueries: [InstructorsQuery],
    },
  )
  const [selected, setSelected] = useState(defaultValue ?? '')
  const [newName, setNewName] = useState('')

  const addInstructor = async () => {
    const result = await createInstructor({
      variables: { name: newName },
    }).catch(() => null)
    if (!result?.data) return
    setSelected(result.data.createInstructor.id)
    setNewName('')
  }

  return (
    <div className="flex flex-col gap-2">
      <NativeSelect
        id="instructorId"
        name="instructorId"
        value={selected}
        onChange={(event) => setSelected(event.target.value)}
        aria-invalid={invalid}
      >
        <NativeSelectOption value="">
          {t('chooseInstructor')}
        </NativeSelectOption>
        {data?.instructors.map((instructor) => (
          <NativeSelectOption key={instructor.id} value={instructor.id}>
            {instructor.name}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      <div className="flex gap-2">
        <Input
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          placeholder={t('newInstructorName')}
          aria-label={t('newInstructorName')}
        />
        <Button
          type="button"
          variant="outline"
          disabled={loading || newName.trim().length < 2}
          onClick={addInstructor}
        >
          {t('addInstructor')}
        </Button>
      </div>
    </div>
  )
}
