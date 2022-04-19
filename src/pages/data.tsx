import { Button, Input } from '@chakra-ui/react'
import { useState } from 'react'
import PageWrapper from '../components/PageWrapper'

export default function DateTest() {
  const [date, setDate] = useState<any>()
  const test = () => {
    const testDate = Date.parse(date)
    alert(`Isso é um número bizarro? ${testDate}`)
  }
  return (
    <PageWrapper>
      <Input type='datetime-local' onChange={(e) => setDate(e.target.value)} value={date} />
      <Button onClick={test}>Vamo vê</Button>
    </PageWrapper>
  )
}