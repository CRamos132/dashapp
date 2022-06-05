import { FormEventHandler, useState } from "react";
import { Box, Button, Flex, Input, Select, useToast } from "@chakra-ui/react";
import PageWrapper from "../../../components/PageWrapper";
import { collection, getDocs, query, where, writeBatch, doc, getDoc, orderBy } from "firebase/firestore";
import { firestore } from "../../../lib/firebase";
import { useQuery } from "react-query";
import { IAditionalUserData } from "../../../interfaces/User";

export default function FidelidashManagementPage() {
  const [userList, setUserList] = useState<any[]>([])
  const [usersToChange, setUsersToChange] = useState<any[]>([])
  const toast = useToast()

  const { isLoading, error, data } = useQuery('fidelidasg', async () => {
    const q = query(collection(firestore, "users"), orderBy('fidelidash'))
    const querySnapshot = await getDocs(q);
    const users: IAditionalUserData[] = []
    querySnapshot.forEach((doc) => {
      const eventData = doc.data()
      users.push(eventData as IAditionalUserData)
    });
    return users
  })

  const handleSubmit: FormEventHandler<HTMLDivElement> = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const { search } = Object.fromEntries(formData)
    if (search) {
      const q = query(collection(firestore, "users"), where("apelido", "==", search));
      const querySnapshot = await getDocs(q);
      const userList: any[] = []
      querySnapshot.forEach((doc) => {
        userList.push({ ...doc.data(), id: doc.id })
      })
      setUserList(userList)
      if (userList.length === 0) {
        toast({
          title: "Nenhum usuário encontrado",
          description: "Não foi possível encontrar nenhum usuário com esse apelido",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return
      }
    }
  }

  const handleUpdate = () => {
    const batch = writeBatch(firestore);

    usersToChange.forEach((user) => {
      const newChange = doc(firestore, "users", user.id);
      batch.update(newChange, { "fidelidash": user.fidelidash });
    })

    batch.commit().then(() => {
      toast({
        title: "Usuários atualizados com sucesso",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    });
  }

  return (
    <PageWrapper isAdminPage>
      <Flex flexDirection='column' padding='32px'>
        <Box marginBottom='18px'>Gerenciar Fidelidash</Box>
        <Flex direction='row' width='80%' gridColumnGap='8px' as='form' onSubmit={handleSubmit}>
          <Input type='text' name='search' placeholder="Nome de usuário" required />
          <Button type="submit">Buscar usuário</Button>
        </Flex>
        <Flex>
          {usersToChange.length > 0 && (
            <Button onClick={handleUpdate}>Atualizar usuários</Button>
          )}
        </Flex>
        {userList.length > 0 && (
          <>
            <Box as='h2' fontSize='1.5rem' fontWeight='bold' margin='12px 0'>Search users</Box>
            <Box as='table'>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Fidelidash</th>
                </tr>
              </thead>
              <tbody>
                {userList.map((user) => {
                  return (
                    <tr key={user.id}>
                      <td>{user?.apelido}</td>
                      <td>{user?.email}</td>
                      <td>
                        <Select
                          placeholder="Selecione um tipo"
                          value={user?.fidelidash}
                          onChange={(e: any) => {
                            setUsersToChange([...usersToChange, { ...user, fidelidash: e.target.value }])
                          }}
                        >
                          <option value=''>Sem fidelidash</option>
                          <option value='bronze'>Bronze</option>
                          <option value='prata'>Prata</option>
                          <option value='ouro'>Ouro</option>
                          <option value='platina'>Platina</option>
                        </Select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Box>
          </>
        )}
        <Box as='h2' fontSize='1.5rem' fontWeight='bold' margin='12px 0'>All fidelidash</Box>
        <Box as='table'>
          <Flex as='tr' direction='row' justifyContent='space-between'>
            <Box as='th'>Nome</Box>
            <Box as='th'>Email</Box>
            <Box as='th'>Fidelidash</Box>
          </Flex>
          {data?.map((user) => {
            return (
              <Flex as='tr' key={user.nome} direction='row' justifyContent='space-between'>
                <Box as='th'>{user?.apelido}</Box>
                <Box as='th'>{user?.email}</Box>
                <Box as='th'>{user?.fidelidash}</Box>
              </Flex>
            )
          })}
        </Box>
      </Flex>
    </PageWrapper>
  )
}