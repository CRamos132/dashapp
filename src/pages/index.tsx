import type { NextPage } from 'next'
import Head from 'next/head'
import { useQuery } from 'react-query'
import { collection, query, getDocs, orderBy, limit, where } from "firebase/firestore";

import { IEvent } from '../interfaces/Event';
import { firestore } from '../lib/firebase';
import PageWrapper from '../components/PageWrapper'
import EventsList from '../components/EventsList';
import { Box, Button, Flex } from '@chakra-ui/react';
import useFidelidash from '../hooks/useFidelidash';
import { UserPicture } from '../components/UserImage';
import Link from 'next/link';
import useOrg from '../hooks/useOrg';
import Image from 'next/image';
import DashMemberCard from '../components/DashMemberCard';

const Home: NextPage = () => {
  const fidelidash = useFidelidash()
  const { data: orgData } = useOrg()

  const { isLoading, data } = useQuery('initialEvents', async () => {
    const now = new Date();
    const q = query(collection(firestore, "eventos"), orderBy('tempo', 'asc'), limit(5), where("tempo", ">", Date.parse(now.toDateString())))
    const querySnapshot = await getDocs(q);
    const events: IEvent[] = []
    querySnapshot.forEach((doc) => {
      const eventData = { id: doc.id, ...doc.data() }
      events.push(eventData as IEvent)
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
        <Flex direction='column' width='100%' >
          <Flex direction='row' backgroundColor='#162542' height='300px' padding='30px' gridColumnGap='20px' fontSize='1.5rem' alignItems='center'>
            <Box>
              <Image height={200} width={200} src='/logo.png' alt='Logo da Team Dash' />
            </Box>
            <Box color='white' margin='auto 0px' width='100%' textAlign='center'>
              {orgData?.[0]?.sobre}
            </Box>
          </Flex>
        </Flex>
        <Flex direction='column' padding='0 18px' marginTop='12px'>
          {data && <EventsList isHorizontal title='Próximos eventos' events={data} isLoading={isLoading} />}
        </Flex>
        <Flex direction='column' padding='0 18px' marginTop='12px'>
          <Box as='h2' fontSize='1.5rem' fontWeight='500'>
            Fidelidash
          </Box>
          <Flex direction='row' gridColumnGap='8px' overflowX='scroll' overflowY='hidden' whiteSpace='nowrap' width='100%' sx={
            {
              '::-webkit-scrollbar': {
                display: 'none'
              }
            }
          }>
            {
              fidelidash?.length > 0 && (
                fidelidash?.slice(0, 5)?.map(item => {

                  if (!item.firebaseData) {
                    return null
                  }
                  return (
                    <Flex key={item.id} direction='column' alignItems='center' gridRowGap='5px'>
                      <UserPicture userData={item.firebaseData} />
                      {item.firebaseData?.apelido}
                    </Flex>
                  )
                })
              )
            }
            <Link href='/fidelidash' passHref>
              <Button>
                Ver mais
              </Button>
            </Link>
          </Flex>
        </Flex>
        <Flex direction='column' padding='0 18px' marginTop='12px'>
          <Box as='h2' fontSize='1.5rem' fontWeight='500'>
            Membros Team DASH
          </Box>
          <Flex overflowX='scroll' overflowY='hidden' margin='0px 0px 10px' whiteSpace='nowrap' width='100%' gridColumnGap='8px' sx={
            {
              '::-webkit-scrollbar': {
                display: 'none'
              }
            }
          }>
            {
              orgData?.[0]?.membros?.map((item: any) => {
                return (
                  <DashMemberCard key={item.id} id={item.id} name={item.apelido} />
                )
              })
            }
          </Flex>
        </Flex>
      </PageWrapper>
    </>
  )
}

export default Home
