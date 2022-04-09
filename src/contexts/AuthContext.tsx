import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, User, signOut } from "firebase/auth"
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../lib/firebase';
import { useRouter } from 'next/router';

interface TAuthContext {
  user: User | null;
  loginWithEmail: ((email: string, password: string) => void);
  isAdmin: boolean;
  logout: () => void;
  aditionalData: AditionalUserData | null;
}

interface AditionalUserData {
  apelido: string;
  email: string;
  foto: string;
  nome: string;
  org?: string[];
}

const AuthContext = createContext<TAuthContext>({
  user: null,
  loginWithEmail: () => { },
  isAdmin: false,
  logout: () => { },
  aditionalData: null,
});

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [aditionalUserInfo, setAditionalUserInfo] = useState<AditionalUserData | null>(null)
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

  const getUser = async () => {
    if (!user) return
    const docRef = doc(firestore, "users", user?.uid);
    const docSnap = await getDoc(docRef);
    const parsedData = docSnap.data()
    setAditionalUserInfo(parsedData as AditionalUserData)
  }

  useEffect(() => {
    if (user) {
      getUser()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

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
    <AuthContext.Provider value={{ user, loginWithEmail: handleEmailLogin, isAdmin, logout: handleLogout, aditionalData: aditionalUserInfo }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };