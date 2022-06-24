import { useRouter } from "next/router";
import { Button, Flex, Grid, Heading, useToast } from "@chakra-ui/react";

import PageWrapper from "../../components/PageWrapper";
import { useAuth } from "../../contexts/AuthContext";
import { UserPicture } from "./components/UserImage";
import { FieldText } from "../../components/FieldText";
import { IFirebaseUserData } from "../../interfaces/User";
import { useState } from "react";
import { useQuery } from "react-query";
import { getUserById, updateUser } from "../../lib/firebase/UsersRepository";

const fieldTextWrapperProps = { width: "100%" };

export default function UserPage() {
  const [userData, setUserData] = useState<IFirebaseUserData>(
    {} as IFirebaseUserData
  );

  const auth = useAuth();
  const toast = useToast();
  const router = useRouter();
  const { userId } = router.query;

  const { isLoading } = useQuery(`user-${userId}`, async () => {
    const userData = await getUserById(userId as string);
    setUserData(userData);
  });

  const handleChange = (e: any) => {
    console.log({
      [e.target.name]: e.target.value,
    });
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const id = userId as string;
    const response = await updateUser({ userId: id, userData });

    if (!response?.error) {
      toast({
        title: "Usuário editado com sucesso.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    toast({
      title: "Algo deu errado.",
      description: `${response.error}`,
      status: "error",
      duration: 9000,
      isClosable: true,
    });
    return;
  };

  const isProfile = auth.user?.uid === userId;

  if (isLoading) {
    return (
      <PageWrapper>
        <p>...loading</p>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {!userData.id ? (
        <Heading textAlign="center" mt="12">
          Usuário não encontrado
        </Heading>
      ) : (
        <Flex
          padding="24px"
          direction="column"
          textAlign="center"
          gap="3"
          position="relative"
        >
          {isProfile && (
            <Button
              position="absolute"
              right="5"
              top="5"
              colorScheme="blue"
              onClick={auth.logout}
            >
              Logout
            </Button>
          )}
          <Flex justifyContent="center" alignItems="center">
            <UserPicture userData={userData} />
          </Flex>
          <Heading mt="4">{userData.apelido}</Heading>
          <form onSubmit={handleSubmit}>
            <Grid
              padding="24px"
              direction="column"
              alignContent="center"
              justifyItems="center"
              alignItems="start"
              textAlign="center"
              gap="3"
              gridTemplateColumns={["1fr", "1fr", "1fr 1fr"]}
            >
              {isProfile && (
                <FieldText
                  isEditable={isProfile}
                  formControl={fieldTextWrapperProps}
                  field="foto"
                  input={{
                    value: userData.foto,
                    onChange: handleChange,
                  }}
                ></FieldText>
              )}
              {isProfile && (
                <FieldText
                  isEditable={isProfile}
                  formControl={fieldTextWrapperProps}
                  field="apelido"
                  input={{
                    value: userData.apelido,
                    onChange: handleChange,
                  }}
                ></FieldText>
              )}
              <FieldText
                isEditable={isProfile}
                formControl={fieldTextWrapperProps}
                field="nome"
                input={{
                  value: userData.nome,
                  onChange: handleChange,
                }}
              ></FieldText>
              <FieldText
                isEditable={isProfile}
                formControl={fieldTextWrapperProps}
                field="email"
                input={{ value: userData.email, onChange: handleChange }}
              ></FieldText>
              <FieldText
                isEditable={isProfile}
                formControl={fieldTextWrapperProps}
                field="sobre"
                input={{
                  value: userData.sobre,
                  onChange: handleChange,
                  as: "textarea",
                  height: "75px",
                  border: "1px solid",
                }}
              ></FieldText>
              <FieldText
                isEditable={isProfile}
                formControl={fieldTextWrapperProps}
                field="tel"
                label={{ children: "Telefone" }}
                input={{ value: userData.tel, onChange: handleChange }}
              ></FieldText>
              <FieldText
                isEditable={isProfile}
                formControl={fieldTextWrapperProps}
                field="cidade"
                input={{ value: userData.cidade, onChange: handleChange }}
              ></FieldText>
              <FieldText
                isEditable={isProfile}
                formControl={fieldTextWrapperProps}
                field="uf"
                label={{ children: "UF" }}
                input={{
                  maxLength: 2,
                  type: "text",
                  value: userData.uf,
                  onChange: handleChange,
                }}
              ></FieldText>

              <FieldText
                isEditable={isProfile}
                formControl={fieldTextWrapperProps}
                field="discord"
                input={{ value: userData.discord, onChange: handleChange }}
              ></FieldText>

              <FieldText
                isEditable={isProfile}
                formControl={fieldTextWrapperProps}
                field="twitter"
                input={{ value: userData.twitter, onChange: handleChange }}
              ></FieldText>

              <FieldText
                isEditable={isProfile}
                formControl={fieldTextWrapperProps}
                field="twitch"
                input={{
                  value: userData.twitch,
                  onChange: handleChange,
                }}
              ></FieldText>
            </Grid>
            {isProfile && (
              <Button colorScheme="blue" type="submit">
                Editar
              </Button>
            )}
          </form>
        </Flex>
      )}
    </PageWrapper>
  );
}
