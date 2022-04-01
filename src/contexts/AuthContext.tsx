import { createContext, ReactNode, useContext, useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from '../lib/firebase';

interface TUser {
  name: string
}

interface TAuthContext {
  user: TUser | null;
  loginWithEmail: ((email: string, password: string) => void);
}


const AuthContext = createContext<TAuthContext>({
  user: null,
  loginWithEmail: () => { }
});

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null)

  const handleEmailLogin = (email: string, password: string) => {
    console.log('chamou')
    signInWithEmailAndPassword(auth, email as string, password as string)
      .then((data: any) => {
        console.log("🚀 ~ data", data)
        setUser(data)
        alert('logado, volta pra outra página')
      })
      .catch(error => {
        alert('deu run, vê o console e me avisa')
        console.log("🚀 ~ error", error)
      })
  }

  return (
    <AuthContext.Provider value={{ user, loginWithEmail: handleEmailLogin }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };