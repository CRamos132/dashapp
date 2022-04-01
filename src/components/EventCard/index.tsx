import { Box, Flex } from "@chakra-ui/react"
import { Event } from "../../types"

interface IProps {
  event: Event
}

export default function EventCard({ event }: IProps) {
  return (
    <Flex minHeight='150px' width='250px' display='flex' justifyContent='center' borderRadius='24px' backgroundColor='blue.200'>
      <Box>{event?.apelido || event.titulo}</Box>
    </Flex>
  )
}