import { FormEventHandler, useState } from "react";
import { Box, Button, Flex, Input, Select, useToast } from "@chakra-ui/react";
import PageWrapper from "../../../components/PageWrapper";
import { collection, getDocs, query, where, writeBatch, doc } from "firebase/firestore";
import { firestore } from "../../../lib/firebase";

export default function FidelidashManagementPage() {
  const [userList, setUserList] = useState<any[]>([])
  const [usersToChange, setUsersToChange] = useState<any[]>([])
  const toast = useToast()

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
        {userList.length > 0 && (
          <>
            <Flex>
              {usersToChange.length > 0 && (
                <Button onClick={handleUpdate}>Atualizar usuários</Button>
              )}
            </Flex>
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
                          onChange={(e) => {
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
      </Flex>
    </PageWrapper>
  )
}