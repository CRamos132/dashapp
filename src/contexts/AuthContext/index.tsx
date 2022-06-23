import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
  signOut,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../../lib/firebase';
import { useRouter } from 'next/router';
import { IAditionalUserData } from '../../interfaces/User';
import { IAccountRegisterInput } from './auth-types'
import { useToast } from '@chakra-ui/react';

interface TAuthContext {
  user: User | null;
  registerAccount: (accountRegisterInput: IAccountRegisterInput) => void;
  loginWithEmail: (email: string, password: string) => void;
  recoverPassword: (email: string) => void;
  isAdmin: boolean;
  logout: () => void;
  aditionalData: IAditionalUserData | null;
}

const AuthContext = createContext<TAuthContext>({
  user: null,
  loginWithEmail: () => { },
  registerAccount: () => { },
  recoverPassword: () => { },
  isAdmin: false,
  logout: () => { },
  aditionalData: null,
});

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [aditionalUserInfo, setAditionalUserInfo] = useState<IAditionalUserData | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  const toast = useToast()
  const router = useRouter()

  const saveUserToDB = (userData: any) => {
    const { id, ...data } = userData
    setDoc(doc(firestore, "users", id), data)
      .then(() => {
        toast({
          title: "Usuário criado com sucesso",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        router.push('/')
      })
      .catch((error) => {
        console.log("🚀 ~ error", error)
        toast({
          title: "Algo deu errado",
          description: "Tente novamente",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      })
  }

  const registerAccount = ({
    name,
    nickname,
    email,
    password,
    confirmPassword,
  }: IAccountRegisterInput) => {
    if (password !== confirmPassword) {
      toast({
        title: "As senhas não coincidem",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        updateProfile(user, {
          displayName: nickname,
        }).then(() => {
          const userData = {
            id: user.uid,
            apelido: nickname,
            email: email,
            nome: name,
            foto: "img/default-profile.png",
            createdAd: new Date().toISOString()
          }
          saveUserToDB(userData)
        }).catch(() => {
          toast({
            title: "As senhas não coincidem",
            description: "Não foi possível atualizar o perfil do usuário",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        })

      })
      .catch(error => {
        toast({
          title: "Algo deu errado",
          description: "Por favor, tente novamente mais tarde",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        console.log("🚀 ~ error", error)
      })
  };

  const recoverPassword = (email: string) => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast({
          title: "Email enviado",
          description: "Verifique sua caixa de entrada",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      })
      .catch(error => {
        toast({
          title: "Algo deu errado",
          description: "Por favor, tente novamente mais tarde",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        console.log("🚀 ~ error", error)
      })
  }

  const handleEmailLogin = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email as string, password as string)
      .then((data: any) => {
        setUser(data)
        router.push('/')
      })
      .catch(error => {
        toast({
          title: "Algo deu errado",
          description: "Por favor, tente novamente mais tarde",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
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
        toast({
          title: "Algo deu errado",
          description: "Por favor, tente novamente mais tarde",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        console.log("🚀 ~ error", error)
      })
  }

  const getUser = async () => {
    if (!user || !user?.uid) return
    const docRef = doc(firestore, "users", user.uid);
    const docSnap = await getDoc(docRef);
    const parsedData = docSnap.data()
    setAditionalUserInfo(parsedData as IAditionalUserData)
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
    <AuthContext.Provider
      value={{
        user,
        registerAccount,
        loginWithEmail: handleEmailLogin,
        recoverPassword,
        isAdmin,
        logout: handleLogout,
        aditionalData: aditionalUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };