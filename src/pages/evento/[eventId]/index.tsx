import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import PageWrapper from "../../../components/PageWrapper";
import { firestore } from "../../../lib/firebase";
import { Event } from "../../../types";

export default function EventPage() {
  const router = useRouter()
  const { eventId } = router.query
  const { isLoading, data } = useQuery(`event-${eventId}`, async () => {
    const docRef = doc(firestore, "eventos", eventId as string);
    const docSnap = await getDoc(docRef);
    console.log("🚀 ~ docSnap", docSnap.data())
    return docSnap.data() as Event
  })
  return (
    <PageWrapper>
      {isLoading && (<p>Carregando...</p>)}
      <h1>Evento - {data?.titulo}</h1>
    </PageWrapper>
  )
}