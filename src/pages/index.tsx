import type { NextPage } from 'next'
import Head from 'next/head'
import { useQuery } from 'react-query'
import { collection, query, getDocs, orderBy, limit, where } from "firebase/firestore";

import { Event } from '../types';
import { firestore } from '../lib/firebase';
import PageWrapper from '../components/PageWrapper'
import EventsList from '../components/EventsList';
import { Flex } from '@chakra-ui/react';

const Home: NextPage = () => {
  const { isLoading, error, data } = useQuery('initialEvents', async () => {
    const now = new Date();
    const q = query(collection(firestore, "eventos"), orderBy('tempo', 'asc'), limit(10), where("tempo", ">", Date.parse(now.toDateString())))
    const querySnapshot = await getDocs(q);
    const events: Event[] = []
    querySnapshot.forEach((doc) => {
      const eventData = { id: doc.id, ...doc.data() }
      events.push(eventData as Event)
    });
    return events
  })

  const { isLoading: loadingOld, error: errorOld, data: dataOld } = useQuery('oldEvents', async () => {
    const now = new Date();
    const q = query(collection(firestore, "eventos"), orderBy('tempo', 'desc'), limit(10), where("tempo", "<", Date.parse(now.toDateString())))
    const querySnapshot = await getDocs(q);
    const events: Event[] = []
    querySnapshot.forEach((doc) => {
      const eventData = { id: doc.id, ...doc.data() }
      events.push(eventData as Event)
    });
    return events
  })

  return (
    <>
      <Head>
        <title>Dash App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageWrapper>
        {(error || errorOld) && <p>Error: {error || errorOld}</p>}
        <Flex direction={['column', 'row']} gridColumnGap='50px' width='100%' justifyContent='center'>
          {data && <EventsList title='Próximos eventos' events={data} isLoading={isLoading} />}
          {dataOld && <EventsList title='Eventos passados' events={dataOld} isLoading={loadingOld} />}
        </Flex>
      </PageWrapper>
    </>
  )
}

export default Home
