import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, User, signOut } from "firebase/auth"
import { auth } from '../lib/firebase';
import { useRouter } from 'next/router';

interface TAuthContext {
  user: User | null;
  loginWithEmail: ((email: string, password: string) => void);
  isAdmin: boolean;
  logout: () => void;
}


const AuthContext = createContext<TAuthContext>({
  user: null,
  loginWithEmail: () => { },
  isAdmin: false,
  logout: () => { },
});

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const router = useRouter()

  const handleEmailLogin = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email as string, password as string)
      .then((data: any) => {
        setUser(data)
        router.push('/')
      })
      .catch(error => {
        alert('deu run, vê o console e me avisa')
        console.log("🚀 ~ error", error)
      })
  }

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null)
        setIsAdmin(false)
        router.push('/')
      })
      .catch(error => {
        alert('Algo deu errado')
      })
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, data => {
      if (!data) return
      data.getIdTokenResult().then((IdTokenResult) => {
        if (IdTokenResult?.claims?.admin) {
          setIsAdmin(true)
        }
      })
      setUser(data)
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loginWithEmail: handleEmailLogin, isAdmin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };