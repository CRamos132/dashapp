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
  const getRedirectLink = () => {
    const isPast = title === "Eventos passados"
    return `/eventos/${isPast ? 'old' : 'next'}`
  }

  const listDirection = isHorizontal ? 'row' : ['row', 'column'] as ['row', 'column']

  return (
    <Flex direction='column' alignItems='center' gridRowGap='12px' maxW='100%' overflow='hidden'>
      <Box as='h2' fontSize='1.5rem' fontWeight='500'>{title}</Box>
      <Flex direction={listDirection} overflowX={['scroll', "auto"]} overflowY='hidden' whiteSpace='nowrap' width='100%' gridRowGap='12px' gridColumnGap='12px'>
        {events.map((event) => <EventCard event={event} key={event?.id} />)}
        {isLoading && <Box>Carregando...</Box>}
        {events.length <= 10 && (
          <Link href={getRedirectLink()} passHref >
            <Button flex={1}>
              Ver mais
            </Button>
          </Link>
        )}
      </Flex>
    </Flex>
  )
}