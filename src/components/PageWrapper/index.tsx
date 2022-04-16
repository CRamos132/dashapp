import { useEffect } from 'react';
import { Box, useMediaQuery } from '@chakra-ui/react'
import { useAuth } from '../../contexts/AuthContext'
import Menu from '../Menu'
import { useRouter } from 'next/router';

interface IProps {
  children: React.ReactNode;
  isAdminPage?: boolean;
}

export default function PageWrapper({ children, isAdminPage }: IProps) {
  const router = useRouter()
  const [isLargerThan720] = useMediaQuery('(min-width: 720px)')
  const auth = useAuth()

  useEffect(() => {
    if (isAdminPage && !auth?.isAdmin) {
      router.push('/')
    }
  }, [auth, isAdminPage, router])
  return (
    <Box minHeight='100vh' padding={isLargerThan720 ? '0 0 0 100px' : '0 0 10vh 0'}>
      {children}
      <Menu />
    </Box>
  )
}