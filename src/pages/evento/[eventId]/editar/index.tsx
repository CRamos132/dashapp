import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { getDoc, doc, updateDoc } from "firebase/firestore";
import {
  FormControl,
  FormLabel,
  Input,
  Flex,
  Textarea,
  Button,
  useToast,
} from "@chakra-ui/react";
import { firestore } from "../../../../lib/firebase";
import PageWrapper from "../../../../components/PageWrapper";
import { SubscribersList } from "../../../../components/SubscribersList";
import { IEvent } from "../../../../interfaces/Event";
import { getUsers } from "../../../../lib/firebase/UsersRepository";

export default function EditEventPage() {
  const [eventData, setEventData] = useState<IEvent>({} as IEvent)
  const toast = useToast()
  const router = useRouter()
  const { asPath } = router
  const eventId = asPath.split('/')[2]

  async function addFidelidashUsers() {
    const fidelidashUsers = await getUsers({orderBy: "fidelidash"})
    
    const fidelidashUsersParsed = fidelidashUsers.map((user) => {
      return {
        nome: user.firebaseData?.apelido || '',
        foto: user.firebaseData?.foto || '',
        id: user.id,
        fidelidash: user.firebaseData?.fidelidash || ''
      }
    })

    const actualSubscribers = eventData.inscritos || []
    const subscribers = [...actualSubscribers, ...fidelidashUsersParsed]


    // remove duplicated
    const ids: any[] = []
    const deduplicatedSubscribers = subscribers.filter((subscriber) => {
      const alreadyExists = ids.includes(subscriber.id)
      if(alreadyExists) {
        return false
      }

      ids.push(subscriber.id)
      return subscriber
    })
    
    setEventData({...eventData, inscritos: deduplicatedSubscribers})
  }

  const getEvent = async () => {
    if (!eventId || eventId === '[eventId]') return
    const docRef = doc(firestore, "eventos", eventId as string);
    const docSnap = await getDoc(docRef);

    if (docSnap) {
      const docData = docSnap.data() as IEvent
      if (docData?.sobre) {
        const clean = docData.sobre.replace(/<br>/g, "\r\n");
        docData.sobre = clean
      }
      if (docData?.regras) {
        const clean = docData.regras.replace(/<br>/g, "\r\n");
        docData.regras = clean
      }
      if (docData?.stagelist) {
        const clean = docData.stagelist.replace(/<br>/g, "\r\n");
        docData.stagelist = clean
      }
      // if(docData?.tempo) {
      //   docData.tempo = new Date(docData.tempo)
      // }
      setEventData(docData)
    }
  }

  useEffect(() => {
    getEvent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asPath])

  const handleChange = (e: any) => {
    const newEventData = { ...eventData, [e.target.name]: e.target.value }
    console.log({newEventData})
    setEventData(newEventData)
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const { tempo, limite } = Object.fromEntries(formData)
    const submitData = eventData
    if(tempo) {
      submitData.tempo = Date.parse(tempo as string);
    }
    if(limite) {
      submitData.limite = Date.parse(limite as string);
    }
    submitData.sobre = submitData.sobre.replaceAll(/\r?\n/g, "<br>")
    submitData.stagelist = submitData.stagelist.replaceAll(/\r?\n/g, "<br>")
    submitData.regras = submitData.regras.replaceAll(/\r?\n/g, "<br>")

    updateDoc(doc(firestore, "eventos", eventId as string), {
      ...submitData
    })
      .then(data => {
        toast({
          title: 'Evento editado com sucesso.',
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
      })
      .catch(error => {
        toast({
          title: 'Algo deu errado.',
          description: error,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
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
          <Flex justifyContent="center" width="100%">
            <SubscribersList isManageable subscribers={eventData.inscritos || []} addFidelidashUsers={addFidelidashUsers} />
          </Flex>
          <Button colorScheme='blue' type='submit'>Editar</Button>
        </Flex>
      </form>
    </PageWrapper>
  )
}