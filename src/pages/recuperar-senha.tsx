import {
  FormControl,
  FormLabel,
  Input,
  Flex,
  Button,
  Heading,
  Text,
} from "@chakra-ui/react";
import PageWrapper from "../components/PageWrapper";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const { recoverPassword } = useAuth();

  const handleLogin = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { email } = Object.fromEntries(formData);
    recoverPassword(email as string);
  };

  return (
    <PageWrapper>
      <Flex
        as="form"
        width="100%"
        paddingTop="10vh"
        direction="column"
        align="center"
        onSubmit={handleLogin}
      >
        <Flex direction="column" width="70%" align="center" gridRowGap="24px">
          <Heading textAlign="center">Recuperar a senha</Heading>
          <Text textAlign="center">
            Um email será enviado com o código para recuperar a sua senha
          </Text>
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input required id="email" name="email" type="email" />
          </FormControl>
          <Button colorScheme="blue" type="submit">
            Enviar Email
          </Button>
        </Flex>
      </Flex>
    </PageWrapper>
  );
}
