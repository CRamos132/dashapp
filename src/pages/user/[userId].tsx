import { useState } from "react";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { Box, Button, Flex, FormLabel, Grid, Heading, useToast } from "@chakra-ui/react";
import { getStorage, ref, uploadBytes } from "firebase/storage";

import PageWrapper from "../../components/PageWrapper";
import { useAuth } from "../../contexts/AuthContext";
import { UserPicture } from "../../components/UserImage";
import { FieldText } from "../../components/FieldText";
import { IFirebaseUserData } from "../../interfaces/User";
import { getUserById, updateUser } from "../../lib/firebase/UsersRepository";
import { storage, auth as firebaseAuth } from "../../lib/firebase";
import { updateProfile } from "firebase/auth";

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

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';

    input.onchange = (e: any): any => {
      if (!e?.target?.files?.[0]) return
      const file = e.target.files[0];

      if (!file.type.includes("image")) {
        toast({
          title: "Algo deu errado.",
          description: 'O arquivo deve ser uma imagem',
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return
      }
      if (file.size > 500000) {
        toast({
          title: "Algo deu errado.",
          description: 'O arquivo é muito grande',
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return
      }

      const user = firebaseAuth.currentUser;
      if (!user) {
        toast({
          title: "Algo deu errado.",
          description: 'Você precisa efetuar o login para continuar',
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return
      }

      const mountainsRef = ref(storage, `img_perfil/${userId}`);
      const photoURL = `https://firebasestorage.googleapis.com/v0/b/dash-app-87d27.appspot.com/o/img_perfil%2F${userId}?alt=media&token=0ac7c6e8-c407-4fd7-9652-f515e789074e`

      uploadBytes(mountainsRef, file)
        .then((snapshot) => {
          const id = userId as string;
          updateUser({
            userId: id, userData: {
              foto: photoURL
            } as any
          });
        })
        .then(() => {

          updateProfile(user, {
            photoURL
          })
        })
        .then(() => {
          toast({
            title: "Foto atualizada com sucesso",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        })
        .catch((err) => {
          toast({
            title: "Algo deu errado.",
            description: `Erro: ${err}`,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        })
        ;
    }

    input.click();
  }

  const isProfile = auth.user?.uid === userId;

  if (isLoading) {
    return (
      <PageWrapper>
        <p>...loading</p>
      </PageWrapper>
    );
  }

  if (!userData.id) {
    return (
      <PageWrapper>
        <Heading textAlign="center" mt="12">
          Usuário não encontrado
        </Heading>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
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
        <Flex direction='row' gridColumnGap='22px' alignItems='flex-end'>
          <Box position='relative'>
            <UserPicture userData={userData} />
            {
              isProfile && (
                <Button size='sm' position='absolute' bottom='-15px' right='-10px' onClick={handleUpload}>
                  Edit
                </Button>
              )
            }
          </Box>
          <Heading mt="4">{userData.apelido}</Heading>
        </Flex>
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
            {
              isProfile ? (
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
              ) : (
                <Flex
                  direction='column'
                  alignItems='flex-start'
                  width='100%'
                >
                  <FormLabel
                    mb="1"
                    color="blue.500"
                    fontWeight="600"
                  >
                    Sobre
                  </FormLabel>
                  <Box>{userData.sobre}</Box>
                </Flex>
              )
            }
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
    </PageWrapper>
  );
}
