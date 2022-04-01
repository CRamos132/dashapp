import { Box, Flex } from "@chakra-ui/react";

import { Event } from "../../types";
import EventCard from "../EventCard";

interface IProps {
  events: Event[];
  title: string;
  isLoading: boolean;
}

export default function EventsList({ events, title, isLoading }: IProps) {
  return (
    <Flex direction='column' alignItems='center' gridRowGap='12px'>
      <Box as='h2' fontSize='1.5rem' fontWeight='500'>{title}</Box>
      {isLoading && <Box>Carregando...</Box>}
      {events.map((event) => <EventCard event={event} key={event?.id} />)}
    </Flex>
  )
}