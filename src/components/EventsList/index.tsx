import { Box, Button, Flex } from "@chakra-ui/react";
import Link from "next/link";

import { Event } from "../../types";
import EventCard from "../EventCard";

interface IProps {
  events: Event[];
  title: string;
  isLoading: boolean;
}

export default function EventsList({ events, title, isLoading }: IProps) {
  const getRedirectLink = () => {
    const isPast = title === "Eventos passados"
    return `/eventos/${isPast ? 'old' : 'next'}`
  }
  return (
    <Flex direction='column' alignItems='center' gridRowGap='12px' maxW='95%' overflow='hidden'>
      <Box as='h2' fontSize='1.5rem' fontWeight='500'>{title}</Box>
      <Flex direction={['row', 'column']} overflowX={['scroll', "auto"]} overflowY='hidden' whiteSpace='nowrap' maxW='95vw' gridRowGap='12px' gridColumnGap='12px'>
        {events.map((event) => <EventCard event={event} key={event?.id} />)}
        {isLoading && <Box>Carregando...</Box>}
        {events.length <= 10 && (
          <Link href={getRedirectLink()} passHref>
            <Button>+</Button>
          </Link>
        )}
      </Flex>
    </Flex>
  )
}