import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, User } from "firebase/auth"
import { auth } from '../lib/firebase';
import { useRouter } from 'next/router';

interface TAuthContext {
  user: User | null;
  loginWithEmail: ((email: string, password: string) => void);
}


const AuthContext = createContext<TAuthContext>({
  user: null,
  loginWithEmail: () => { }
});

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, data => {
      setUser(data)
    });
    return unsubscribe;
  }, []);

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