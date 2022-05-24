import {
  FormControl,
  FormLabel,
  Input,
  Flex,
  Button,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { CustomLink } from "../components/CustomLink";
import PageWrapper from "../components/PageWrapper";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const { loginWithEmail } = useAuth();
  const router = useRouter();

  const handleLogin = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);
    loginWithEmail(email as string, password as string);
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
          <Heading>Login</Heading>
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input id="email" name="email" type="email" />
          </FormControl>
          <FormControl>
            <Flex
              width="100%"
              marginBottom="2"
              direction="row"
              align="center"
              justify="space-between"
              gap="6px"
            >
              <FormLabel htmlFor="password" margin="0">
                Senha
              </FormLabel>
              <CustomLink
                href="/recuperar-senha"
                height="fit-content"
                fontWeight="bold"
                fontSize="12"
                alignSelf="end"
              >
                Recuperar a senha
              </CustomLink>
            </Flex>
            <Input id="password" name="password" type="password" />
          </FormControl>
          <Button colorScheme="blue" type="submit">
            Logar
          </Button>
        </Flex>
      </Flex>
      <Flex
        width="100%"
        marginTop="6"
        direction="row"
        align="center"
        justify="center"
        gap="6px"
      >
        <Text>Novo aqui?</Text>
        <CustomLink href="/cadastrar">Criar conta</CustomLink>
      </Flex>
    </PageWrapper>
  );
}
