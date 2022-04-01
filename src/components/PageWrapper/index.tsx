import { Box, useMediaQuery } from '@chakra-ui/react'
import Menu from '../Menu'

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const [isLargerThan720] = useMediaQuery('(min-width: 720px)')
  return (
    <Box minHeight='100vh' padding={isLargerThan720 ? '0 0 0 100px' : '0 0 10vh 0'}>
      {children}
      <Menu />
    </Box>
  )
}