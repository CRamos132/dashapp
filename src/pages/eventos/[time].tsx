import { Button, Flex, Heading } from "@chakra-ui/react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useState } from "react";
import { useInfiniteQuery } from "react-query";
import EventCard from "../../components/EventCard";
import PageWrapper from "../../components/PageWrapper";
import { firestore } from "../../lib/firebase";
import { IEvent } from "../../interfaces/Event";

export default function EventsPage() {
  const [lastItem, setLastItem] = useState<any>(null);
  const router = useRouter();
  const { time } = router.query;

  const eventTime = time === "old" ? "passados" : "futuros";
  const operator = time === "old" ? "<" : ">";
  
  const { data, fetchNextPage, isLoading, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery(
      `${eventTime}Events`,
      async () => {
        const now = new Date();
        const order = time === "old" ? "desc" : "asc";
        const firstQuery = query(
          collection(firestore, "eventos"),
          orderBy("tempo", order),
          limit(10),
          where("tempo", operator, Date.parse(now.toDateString()))
        );
        const nextQuery = query(
          collection(firestore, "eventos"),
          orderBy("tempo", order),
          limit(10),
          where("tempo", operator, Date.parse(now.toDateString())),
          startAfter(lastItem)
        );
        const currentQuery = lastItem ? nextQuery : firstQuery;
        const querySnapshot = await getDocs(currentQuery);
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastItem(lastVisible);
        const events: IEvent[] = [];
        querySnapshot.forEach((doc) => {
          const eventData = { id: doc.id, ...doc.data() };
          events.push(eventData as IEvent);
        });
        return events;
      },
      {
        onError: (error) => {
          console.log("🚀 ~ error", error);
        },
        getNextPageParam: (lastPage) => {
          const lastItem = lastPage[lastPage.length - 1];
          return lastItem;
        },
      }
    );

  return (
    <PageWrapper>
      <Flex direction="column" alignItems="center">
        <Heading fontSize={30}>Eventos {eventTime}</Heading>

        <Flex direction="column" gap="2" mt="4">
          {data?.pages?.map((page) => {
            return page.map((event) => (
              <EventCard event={event} key={event?.id} />
            ));
          })}
        </Flex>

        <Button
          mt="4"
          mb="2"
          disabled={!hasNextPage || isLoading || isFetchingNextPage}
          onClick={() => {
            fetchNextPage();
          }}
        >
          Mais
        </Button>
      </Flex>
    </PageWrapper>
  );
}
