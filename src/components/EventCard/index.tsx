import {
  Box,
  Flex,
  Menu,
  Button,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react"
import Link from "next/link"
import { Event } from "../../types"

interface IProps {
  event: Event
}

export default function EventCard({ event }: IProps) {
  return (
    <Flex as='button' direction='column' alignItems='flex-end' cursor='pointer'>
      <Link href={`/evento/${event.id}`} passHref>
        <Flex minHeight='150px' width='250px' display='flex' justifyContent='center' borderRadius='24px' backgroundColor='blue.200'>
          <Box>{event?.apelido || event.titulo}</Box>
        </Flex>
      </Link>
      <Flex>
        <Menu>
          <MenuButton as={Button} >
            ...
          </MenuButton>
          <MenuList>
            <MenuItem>
              <Link href={`/evento/${event.id}/duplicar`}>
                Duplicar
              </Link>
            </MenuItem>
            <MenuItem>
              <Link href={`/evento/${event.id}/editar`}>
                Editar
              </Link></MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  )
}