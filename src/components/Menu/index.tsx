import { Flex } from '@chakra-ui/react'
import Link from 'next/link'
import { AiFillHome } from 'react-icons/ai'
import { BsFillPersonFill, BsFillPersonCheckFill } from 'react-icons/bs'

import { useAuth } from '../../contexts/AuthContext'
import IconButton from '../IconButton'

function MenuContent() {
  const auth = useAuth()
  return (
    <>
      <Flex flexDir={['row', 'column']} gridGap='18px'>
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
  return (
    <Flex
      direction={['row', 'column']}
      position='fixed'
      alignItems='center'
      justifyContent='space-between'
      padding='10px'
      top={['90vh', '0']}
      left={['0', '0']}
      width={['100%', '100px']}
      height={['10vh', '100vh']}
      backgroundColor='blue.500'
    >
      <MenuContent />
    </Flex>


  )
}