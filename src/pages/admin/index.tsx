import { Button } from "@chakra-ui/react";
import Link from "next/link";
import PageWrapper from "../../components/PageWrapper";

export default function AdminPage() {
  return (
    <PageWrapper>
      <Link href='/admin/relatorio' passHref>
        <Button>
          Relatório de usuários
        </Button>
      </Link>
    </PageWrapper>
  )
}