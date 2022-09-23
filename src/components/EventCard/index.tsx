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
import { useAuth } from "../../contexts/AuthContext"
import { IEvent } from "../../interfaces/Event"

interface IProps {
  event: IEvent
}

export default function EventCard({ event }: IProps) {
  const auth = useAuth()
  const getDate = () => {
    const date = new Date(event?.tempo)
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
  }

  const getGame = (game: 'ult' | 'mq' | 'melee' | 'pm') => {
    const games = {
      ult: 'Ultimate',
      mq: '64',
      melee: 'Melee',
      pm: 'P+'
    }
    const currentGame = games?.[game]
    return currentGame ?? '--'
  }

  return (
    <Flex as='button' direction='column' alignItems='flex-end' cursor='pointer' >
      <Link href={`/evento/${event.id}`} passHref>
        <Flex
          minHeight='150px'
          width='250px'
          display='flex'
          flexDirection='column'
          justifyContent='flex-start'
          borderRadius='24px'
          backgroundColor='#FF3068'
          padding='8px'
        >
          <Box width='100%' as='h2' fontSize='1.2rem' fontWeight='bold'>{event?.apelido || event.titulo}</Box>
          <Box>{getDate()} - {event?.cidade}, {event?.uf}</Box>
          <Flex direction='row' wrap='wrap' width='100%' justifyContent='space-evenly'>
            {Object.keys(event?.jogos).map((item) => {
              if ((event?.jogos as any)?.[item]) {
                return <Box key={item} textTransform='capitalize'>{getGame(item as any)}</Box>
              }
            })}
          </Flex>
        </Flex>
      </Link>
      {
        auth.isAdmin ? (
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
        ) : null
      }
    </Flex>
  )
}