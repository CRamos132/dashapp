import {
  FormControl,
  FormLabel,
  Input,
  Flex,
  Button,
  Heading,
} from "@chakra-ui/react";
import PageWrapper from "../components/PageWrapper";
import { useAuth } from "../contexts/AuthContext";
import { IAccountRegisterInput } from "../contexts/AuthContext/auth-types";

export default function LoginPage() {
  const { registerAccount } = useAuth();

  const handleRegister = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { name, nickname, email, password, confirmPassword } =
      Object.fromEntries(formData) as unknown as IAccountRegisterInput;
    console.log({
      name,
      nickname,
      email,
      password,
      confirmPassword,
    });
    registerAccount({ name, nickname, email, password, confirmPassword });
  };

  return (
    <PageWrapper>
      <Flex
        as="form"
        width="100%"
        paddingTop="10vh"
        marginBottom="16px"
        direction="column"
        align="center"
        onSubmit={handleRegister}
      >
        <Flex direction="column" width="70%" align="center" gridRowGap="14px">
          <Heading>Cadastrar</Heading>
          <FormControl>
            <FormLabel htmlFor="name">Nome</FormLabel>
            <Input
              required
              id="name"
              name="name"
              type="text"
              placeholder="João da Silva"
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="nickname">Apelido</FormLabel>
            <Input
              required
              id="nickname"
              name="nickname"
              type="text"
              placeholder="jao123"
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              required
              id="email"
              name="email"
              type="email"
              placeholder="exemplo@exemplo.com"
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Senha</FormLabel>
            <Input
              required
              id="password"
              name="password"
              type="password"
              placeholder="Digite a sua senha"
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="confirm-password">Confirmar senha</FormLabel>
            <Input
              required
              id="confirm-password"
              name="confirmPassword"
              type="password"
              placeholder="Confirme a sua senha"
            />
          </FormControl>
          <Button colorScheme="blue" type="submit">
            Cadastrar
          </Button>
        </Flex>
      </Flex>
    </PageWrapper>
  );
}
