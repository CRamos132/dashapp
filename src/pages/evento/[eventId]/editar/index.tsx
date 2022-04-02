import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { getDoc, doc, addDoc, collection } from "firebase/firestore";
import {
  FormControl,
  FormLabel,
  Input,
  Flex,
  Textarea,
  Button
} from "@chakra-ui/react";
import { firestore } from "../../../../lib/firebase";
import PageWrapper from "../../../../components/PageWrapper";

export default function DuplicateEventPage() {
  const [eventData, setEventData] = useState<Record<string, any>>({})
  const router = useRouter()

  const getEvent = async () => {
    const { eventId } = router.query
    if (!eventId) return
    const docRef = doc(firestore, "eventos", eventId as string);
    const docSnap = await getDoc(docRef);
    if (docSnap) {
      const docData = docSnap.data() as any
      if (docData.sobre) {
        const clean = docData.sobre.replace(/<br>/g, "\r\n");
        docData.sobre = clean
      }
      if (docData.regras) {
        const clean = docData.regras.replace(/<br>/g, "\r\n");
        docData.regras = clean
      }
      setEventData(docData)
    }
  }

  useEffect(() => {
    getEvent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (e: any) => {
    const newEventData = { ...eventData, [e.target.name]: e.target.value }
    setEventData(newEventData)
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const { tempo, limite } = Object.fromEntries(formData)
    const submitData = eventData
    submitData.tempo = Date.parse(tempo as string)
    submitData.limite = Date.parse(limite as string)
    if (submitData?.inscritos) {
      delete submitData.inscritos
    }
    addDoc(collection(firestore, "eventos"), {
      ...submitData
    })
      .then(data => alert('sucesso'))
      .catch(error => {
        alert('erro, vê o console e me avisa')
        console.log(error)
      })
  }

  return (
    <PageWrapper>
      <form onSubmit={handleSubmit}>
        <Flex direction='column' width="70%" margin='50px auto' align='center' gridRowGap='24px'>
          <h1>Editar evento</h1>
          <FormControl>
            <FormLabel htmlFor='titulo'>Título</FormLabel>
            <Input id='titulo' name='titulo' type='text' value={eventData?.titulo || ''} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor='apelido'>Apelido</FormLabel>
            <Input id='apelido' name='apelido' type='text' value={eventData?.apelido || ''} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor='tempo'>Data</FormLabel>
            <Input id='tempo' name='tempo' type='datetime-local' />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor='limite'>Data limite</FormLabel>
            <Input id='limite' name='limite' type='datetime-local' />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor='cidade'>Cidade</FormLabel>
            <Input id='cidade' name='cidade' type='text' value={eventData?.cidade || ''} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor='uf'>UF</FormLabel>
            <Input id='uf' name='uf' type='text' value={eventData?.uf || ''} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor='sobre'>Sobre</FormLabel>
            <Textarea id='sobre' name='sobre' value={eventData?.sobre || ''} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor='regras'>Regras</FormLabel>
            <Textarea id='regras' name='regras' value={eventData?.regras || ''} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor='stagelist'>Stagelist</FormLabel>
            <Textarea id='stagelist' name='stagelist' value={eventData?.stagelist || ''} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor='bracket'>Bracket</FormLabel>
            <Input id='bracket' name='bracket' type='text' value={eventData?.bracket || ''} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor='fb'>Link do FB</FormLabel>
            <Input id='fb' name='fb' type='text' value={eventData?.fb || ''} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor='url'>URL</FormLabel>
            <Input id='url' name='url' type='text' value={eventData?.url || ''} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor='org'>Org</FormLabel>
            <Input id='org' name='org' type='text' disabled defaultValue={eventData?.org || ''} />
          </FormControl>
          <Button colorScheme='blue' type='submit'>Duplicar</Button>
        </Flex>
      </form>
    </PageWrapper>
  )
}