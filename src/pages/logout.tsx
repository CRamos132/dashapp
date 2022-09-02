import { useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"

export default function LogoutPage() {
  const { logout } = useAuth()
  useEffect(() => {
    logout?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div>Logout...</div>
  )
}