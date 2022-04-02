import { useRouter } from "next/router";
import PageWrapper from "../../../components/PageWrapper";

export default function EventPage() {
  const router = useRouter()
  const { eventId } = router.query
  return (
    <PageWrapper>
      <h1>Evento - {eventId}</h1>
    </PageWrapper>
  )
}