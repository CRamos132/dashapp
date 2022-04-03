import { Flex, useMediaQuery } from '@chakra-ui/react'
import Link from 'next/link'
import { AiFillHome } from 'react-icons/ai'
import { BsFillPersonFill, BsFillPersonCheckFill } from 'react-icons/bs'

import { useAuth } from '../../contexts/AuthContext'
import IconButton from '../IconButton'

function MenuContent() {
  const auth = useAuth()
  const [isLargerThan720] = useMediaQuery('(min-width: 720px)')
  return (
    <>
      <Flex flexDir={isLargerThan720 ? 'column' : 'row'} gridGap='18px'>
        <Link href='/' passHref>
          <IconButton aria-label='Home' as={AiFillHome} w={12} h={12} />
        </Link>
        {
          auth.isAdmin ? (
            <Link href='/admin' passHref>
              <IconButton aria-label='Admin' as={BsFillPersonCheckFill} w={12} h={12} />
            </Link>
          ) : null
        }
      </Flex>
      <Link href={auth.user ? '/profile' : '/login'} passHref>
        <IconButton aria-label={auth.user ? 'Profile' : 'Login'} justifySelf='flex-end' as={BsFillPersonFill} w={12} h={12} />
      </Link>
    </>
  )
}

export default function Menu() {
  const [isLargerThan720] = useMediaQuery('(min-width: 720px)')
  return (
    <>
      {
        isLargerThan720 ? (
          <Flex
            direction='column'
            position='fixed'
            alignItems='center'
            justifyContent='space-between'
            padding='10px'
            top='0px'
            left='0px'
            width='100px'
            height='100vh'
            backgroundColor='blue.500'
          >
            <MenuContent />
          </Flex>
        ) : (
          <Flex
            direction='row'
            position='fixed'
            justifyContent='space-between'
            padding='10px'
            alignItems='center'
            top='90vh'
            left='0px'
            width='100%'
            height='10vh'
            backgroundColor='blue.500'
          >
            <MenuContent />
          </Flex>
        )
      }
    </>

  )
}