import Link from "next/link";
import PageWrapper from "../../components/PageWrapper";

export default function AdminPage() {
  return (
    <PageWrapper>
      Estamos trabalhando nisso...
      <Link href='/admin/relatorio'>Relatórios</Link>
    </PageWrapper>
  )
}