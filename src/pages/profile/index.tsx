import { Button } from "@chakra-ui/react";
import PageWrapper from "../../components/PageWrapper";
import { useAuth } from "../../contexts/AuthContext";

export default function Profile() {
  const auth = useAuth();
  return (
    <PageWrapper>
      <h1>{auth?.user?.displayName}</h1>
      <Button onClick={auth.logout}>Logout</Button>
    </PageWrapper>
  )
}