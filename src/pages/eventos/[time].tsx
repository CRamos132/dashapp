import { Button } from "@chakra-ui/react";
import { collection, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import EventCard from "../../components/EventCard";
import PageWrapper from "../../components/PageWrapper";
import { firestore } from "../../lib/firebase";
import { Event } from "../../types";

export default function EventsPage() {
  const [lastItem, setLastItem] = useState<any>(null)
  const router = useRouter()
  const { time } = router.query

  const eventTime = time === 'old' ? 'passados' : 'futuros'
  const operator = time === 'old' ? '<' : '>'

  const {
    data,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    `${eventTime}Events`,
    async () => {
      const now = new Date();
      const order = time === 'old' ? 'desc' : 'asc'
      const firstQuery = query(collection(firestore, "eventos"), orderBy('tempo', order), limit(10), where(
        "tempo", operator, Date.parse(now.toDateString())
      ))
      const nextQuery = query(collection(firestore, "eventos"), orderBy('tempo', order), limit(10), where(
        "tempo", operator, Date.parse(now.toDateString())
      ), startAfter(lastItem))
      const currentQuery = lastItem ? nextQuery : firstQuery
      const querySnapshot = await getDocs(currentQuery);
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      console.log("🚀 ~ lastVisible", lastVisible)
      setLastItem(lastVisible)
      const events: Event[] = []
      querySnapshot.forEach((doc) => {
        const eventData = { id: doc.id, ...doc.data() }
        events.push(eventData as Event)
      });
      console.log("🚀 ~ events", events)
      return events
    },
    {
      onError: (error) => {
        console.log("🚀 ~ error", error)
      },
      getNextPageParam: (lastPage) => {
        const lastItem = lastPage[lastPage.length - 1]
        return lastItem
      },
    },
  );

  useEffect(() => {
    console.log("🚀 ~ data", data)
  }, [data])

  return (
    <PageWrapper>
      <h1>Eventos {eventTime}</h1>
      {data?.pages?.map((page) => {
        return page.map(event => <EventCard event={event} key={event?.id} />)
      })}

      <Button disabled={hasNextPage || isLoading || isFetchingNextPage} onClick={() => {
        fetchNextPage()
      }}>Mais</Button>
    </PageWrapper>
  )
}