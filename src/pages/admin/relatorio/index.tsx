import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect } from "react";
import { useQuery } from "react-query";
import PageWrapper from "../../../components/PageWrapper";
import { firestore } from "../../../lib/firebase";

interface ReportUser {
  apelido: string;
  cidade?: string;
  discord?: string;
  email: string;
  foto: string;
  id: string;
  nome: string;
  sobre?: string;
  tel?: string;
  twitch?: string;
  twitter?: string;
  uf?: string;
}

export default function ReportPage() {
  const { isLoading, data } = useQuery('userReport', async () => {
    const q = query(collection(firestore, "users"), orderBy('nome', 'desc'))
    const querySnapshot = await getDocs(q);
    const users: ReportUser[] = []
    querySnapshot.forEach((doc) => {
      const userData = { id: doc.id, ...doc.data() }
      users.push(userData as ReportUser)
    });
    return users
  })

  useEffect(() => {
    console.log("🚀 ~ data", data)
  }, [data])

  return (
    <PageWrapper>
      {isLoading && <p>Carregando...</p>}

    </PageWrapper>
  )
}