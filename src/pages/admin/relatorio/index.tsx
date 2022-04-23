import { useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useQuery } from "react-query";
import PageWrapper from "../../../components/PageWrapper";
import { firestore } from "../../../lib/firebase";
import { Box, Button, useToast } from "@chakra-ui/react";
import convertToCSV, { convertArrayToCSV } from "../../../utils/convertToCSV";

interface ReportUser {
  nome: string;
  email: string;
  apelido: string;
  cidade?: string;
  discord?: string;
  foto?: string;
  id?: string;
  sobre?: string;
  tel?: string;
  twitch?: string;
  twitter?: string;
  uf?: string;
  fidelidash?: string;
}

export default function ReportPage() {
  const toast = useToast()

  const { isLoading, data } = useQuery('userReport', async () => {
    const q = query(collection(firestore, "users"), orderBy('nome', 'asc'))
    const querySnapshot = await getDocs(q);
    const users: ReportUser[] = []
    querySnapshot.forEach((doc) => {
      const userData = { id: doc.id, ...doc.data() }
      users.push(userData as ReportUser)
    });
    return users
  })

  const columns: any = [
    {
      Header: 'Nome',
      accessor: 'nome',
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
    {
      Header: 'Apelido',
      accessor: 'apelido',
    }
  ]

  const tableData = data || []

  const handleCopy = () => {
    if (!!data?.length) {
      const dataToTable = data.map(item => {
        return [item.nome, item.apelido, item.email, item?.cidade ?? '--', item?.uf ?? '--']
      })
      const csvData = convertArrayToCSV([['nome', 'apelido', 'email', 'cidade', 'uf'], ...dataToTable])
      navigator.clipboard.writeText(csvData)
        .then(() => {
          toast({
            title: 'Lista copiada.',
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
        })
    }
  }

  return (
    <PageWrapper isAdminPage>
      {isLoading && <p>Carregando...</p>}
      <Button onClick={handleCopy}>Copiar relatório</Button>
      <Box margin='12px 0'>{tableData?.length} usuários</Box>
      <table>
        <thead>
          <th>Nome</th>
          <th>Email</th>
          <th>Fidelidash</th>
          <th>Apelido</th>
          <th>Cidade</th>
          <th>UF</th>
        </thead>
        <tbody>
          {tableData.map((user) => {
            if (!user) return null
            return (
              <tr key={user.id}>
                <td>{user?.nome ?? '--'}</td>
                <td>{user?.email ?? '--'}</td>
                <td>{user?.fidelidash ?? '--'}</td>
                <td>{user?.apelido ?? '--'}</td>
                <td>{user?.cidade ?? '--'}</td>
                <td>{user?.uf ?? '--'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </PageWrapper>
  )
}