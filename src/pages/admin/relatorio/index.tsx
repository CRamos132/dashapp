import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useQuery } from "react-query";
import PageWrapper from "../../../components/PageWrapper";
import { firestore } from "../../../lib/firebase";
import { Box, Button, useToast } from "@chakra-ui/react";
import { convertArrayToCSV } from "../../../utils/convertToCSV";
import Table from "../../../components/Table";

interface ReportUser {
  nome: string;
  email: string;
  apelido: string;
  cidade?: string;
  discord?: string;
  foto?: string;
  id: string;
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

  const columns = [
    {
      label: 'Nome',
      key: 'nome',
    },
    {
      label: 'Email',
      key: 'email',
      width: 280
    },
    {
      label: 'Fidelidash',
      key: 'fidelidash',
      width: 100
    },
    {
      label: 'Apelido',
      key: 'apelido',
    },
    {
      label: 'Cidade',
      key: 'cidade',
    },
    {
      label: 'UF',
      key: 'uf',
      width: 80
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
      <Table headers={columns} data={tableData} />
    </PageWrapper>
  )
}