import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { Button, Flex, useToast } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";

import PageWrapper from "../../../components/PageWrapper";
import { firestore } from "../../../lib/firebase";
import { Event } from "../../../types";
import convertToCSV from "../../../utils/convertToCSV";
import { useAuth } from "../../../contexts/AuthContext";

export default function EventPage() {
  const auth = useAuth();
  const toast = useToast()
  const router = useRouter()
  const { eventId } = router.query

  const { isLoading, data } = useQuery(`event-${eventId}`, async () => {
    const docRef = doc(firestore, "eventos", eventId as string);
    const docSnap = await getDoc(docRef);
    console.log("🚀 ~ docSnap", docSnap.data())
    return docSnap.data() as Event
  })

  const handleCopy = () => {
    if (data?.inscritos) {
      const userList = data?.inscritos.map((user) => {
        return { jogador: user.nome }
      })
      const csvData = convertToCSV(userList)
      navigator.clipboard.writeText(csvData)
        .then(() => {
          toast({
            title: 'Lista copiada.',
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
        })
    }
  }

  return (
    <PageWrapper>
      {isLoading && (<p>Carregando...</p>)}
      <h1>Evento - {data?.titulo}</h1>
      <h2>Lista de jogadores</h2>
      <Flex direction='column'>
        {data?.inscritos?.map((user) => {
          return (
            <Flex key={user.id}>
              <p>{user.nome}</p>
            </Flex>
          )
        })}
      </Flex>
      {
        auth.isAdmin ? (
          <Button onClick={handleCopy}>
            Copiar lista de jogadores
          </Button>
        ) : (null)
      }
    </PageWrapper>
  )
}