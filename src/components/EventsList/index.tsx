import { Box, Button, Flex } from "@chakra-ui/react";
import Link from "next/link";

import { IEvent } from "../../interfaces/Event"
import EventCard from "../EventCard";

interface IProps {
  events: IEvent[];
  title: string;
  isLoading: boolean;
  isHorizontal?: boolean;
}

export default function EventsList({ events, title, isLoading, isHorizontal }: IProps) {

  const listDirection = isHorizontal ? 'row' : ['row', 'column'] as ['row', 'column']
  const listOverflow = isHorizontal ? 'scroll' : ['scroll', "auto"] as ['scroll', 'auto']

  return (
    <Flex direction='column' alignItems='center' gridRowGap='12px' maxW='100%' overflow='hidden'>
      <Box as='h2' fontSize='1.5rem' fontWeight='500'>{title}</Box>
      <Flex direction={listDirection} overflowX={listOverflow} overflowY='hidden' whiteSpace='nowrap' width='100%' gridRowGap='12px' gridColumnGap='12px' sx={
        {
          '::-webkit-scrollbar': {
            display: 'none'
          }
        }
      }>
        {events.map((event) => <EventCard event={event} key={event?.id} />)}
        {isLoading && <Box>Carregando...</Box>}
        <Flex as='button' direction='column' alignItems='flex-end' cursor='pointer' justifyContent="space-around">
          {events.length <= 10 && (
            <Link href="/eventos/next" passHref >
              <Button width="100%">
                Ver mais
              </Button>
            </Link>
          )}
          <Link href="/eventos/old" passHref >
            <Button >
              Ver eventos passados
            </Button>
          </Link>
        </Flex>
      </Flex>
    </Flex>
  )
}