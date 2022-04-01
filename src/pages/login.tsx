import {
  FormControl,
  FormLabel,
  Input,
  Flex,
  Button
} from '@chakra-ui/react'
import PageWrapper from '../components/PageWrapper'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const { loginWithEmail } = useAuth()

  const handleLogin = (e: any) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const { email, password } = Object.fromEntries(formData)
    loginWithEmail(email as string, password as string)
  }

  return (
    <PageWrapper>
      <Flex as='form' width='100%' paddingTop='10vh' direction='column' align='center' onSubmit={handleLogin}>
        <Flex direction='column' width="70%" align='center' gridRowGap='24px'>
          <h1>Login</h1>
          <FormControl>
            <FormLabel htmlFor='email'>Email</FormLabel>
            <Input id='email' name='email' type='email' />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor='senha'>Senha</FormLabel>
            <Input id='senha' name='password' type='password' />
          </FormControl>
          <Button colorScheme='blue' type='submit'>Logar</Button>
        </Flex>
      </Flex>
    </PageWrapper>
  )
}