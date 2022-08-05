import { collection, deleteField, doc, getDocs, orderBy, query, writeBatch } from "firebase/firestore";
import { useQuery } from "react-query";
import PageWrapper from "../../../components/PageWrapper";
import { firestore } from "../../../lib/firebase";
import { Box, Button, Flex, Select, Text, useToast } from "@chakra-ui/react";
import { convertArrayToCSV } from "../../../utils/convertToCSV";
import Table, { IHeader } from "../../../components/Table";
import { useEffect, useMemo, useState } from "react";

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
  const [newFidelidashValues, setNewFidelidashValues] = useState<Record<string, any>[]>([])

  const { isLoading, data, refetch } = useQuery('userReport', async () => {
    const q = query(collection(firestore, "users"), orderBy('nome', 'asc'))
    const querySnapshot = await getDocs(q);
    const users: ReportUser[] = []
    querySnapshot.forEach((doc) => {
      const userData = { id: doc.id, ...doc.data() }
      users.push(userData as ReportUser)
    });
    return users
  })

  const columns: IHeader[] = [
    {
      label: 'Nome',
      key: 'nome',
      sort: true
    },
    {
      label: 'Email',
      key: 'email',
      width: 280
    },
    {
      label: 'Fidelidash',
      key: 'fidelidash',
      width: 100,
      sort: true,
      component: ({ row }) => {
        return (
          <Flex direction='column' border='1px solid black' alignItems='center'>
            <Flex>
              {row?.fidelidash ?? '--'}
            </Flex>
            <Button onClick={() => {
              setNewFidelidashValues(oldState => {
                return [...oldState, row]
              })
            }}>
              Atualizar
            </Button>

          </Flex>
        )
      }
    },
    {
      label: 'Apelido',
      key: 'apelido',
      sort: true
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

  const tableData = useMemo(() => {
    return data || []
  }, [data])

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

  const handleUpdateList = (user: Record<string, any>) => {
    const currentList = new Map()
    newFidelidashValues.forEach(item => {
      currentList.set(item.id, item)
    })

    currentList.set(user.id, user)

    const values = Array.from(currentList.values());

    setNewFidelidashValues(values)
  }

  const handleUpdateFidelidash = () => {
    const batch = writeBatch(firestore);
    newFidelidashValues.forEach((user) => {
      const newChange = doc(firestore, "users", user.id);
      const changeValue = user.fidelidash ? user.fidelidash : deleteField()
      batch.update(newChange, { "fidelidash": changeValue });
    })

    batch.commit().then(() => {
      refetch()
      setNewFidelidashValues([])
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
      {isLoading && <p>Carregando...</p>}
      <Button onClick={handleCopy}>Copiar relatório</Button>
      <Box margin='12px 0'>{tableData?.length} usuários</Box>
      {
        newFidelidashValues.length > 0 ? (
          <Flex direction='column' padding='18px' rowGap='18px'>
            <Text as='h2' fontWeight='bold' fontSize='22px'>
              Atualizar
            </Text>
            {
              newFidelidashValues?.map(item => {
                return (
                  <Flex key={`fidelidash=${item.id}`} direction='row' columnGap='8px' width='300px'>
                    {item?.apelido}
                    <Select
                      value={item?.fidelidash}
                      onChange={(e: any) => {
                        const newUserData = {
                          ...item,
                          fidelidash: e.target.value
                        }
                        handleUpdateList(newUserData)
                      }}
                    >
                      <option value=''>Sem fidelidash</option>
                      <option value='bronze'>Bronze</option>
                      <option value='prata'>Prata</option>
                      <option value='ouro'>Ouro</option>
                      <option value='platina'>Platina</option>
                    </Select>
                  </Flex>
                )
              })
            }
            <Button onClick={handleUpdateFidelidash} width='300px'>
              Atualizar users
            </Button>
          </Flex>
        ) : null
      }
      <Table headers={columns} data={tableData} />
    </PageWrapper>
  )
}