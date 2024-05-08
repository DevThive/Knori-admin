// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  error: null, // 에러 상태 추가
  setUser: () => null,
  setLoading: () => Boolean,
  setError: () => {}, // 에러 상태 설정 함수 추가
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)
  const [error, setError] = useState(defaultProvider.error) // 에러 상태 관리

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      if (storedToken) {
        setLoading(true)
        try {
          const response = await axios.get(authConfig.meEndpoint, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          })
          setUser({ ...response.data })
        } catch (error) {
          console.error(error)
          setError('로그인 정보를 가져오는데 실패했습니다.')
          handleLogout() // 실패 시 로그아웃 처리
        }
        setLoading(false)
      } else {
        setLoading(false)
      }
    }
    initAuth()
  }, [router])

  const handleLogin = async (params, errorCallback) => {
    try {
      const response = await axios.post(authConfig.loginEndpoint, params)
      const { accessToken, userData } = response.data
      params.rememberMe && window.localStorage.setItem(authConfig.storageTokenKeyName, accessToken)
      params.rememberMe && window.localStorage.setItem('userData', JSON.stringify(userData))
      setUser(userData)
      router.replace(router.query.returnUrl || '/')
    } catch (err) {
      console.error(err)
      setError('로그인에 실패했습니다.')
      errorCallback && errorCallback(err)
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  // 토큰 갱신 로직 (가상 코드, 실제 구현 필요)
  const refreshToken = async () => {
    try {
      const response = await axios.post(authConfig.refreshTokenEndpoint)
      const { accessToken } = response.data
      window.localStorage.setItem(authConfig.storageTokenKeyName, accessToken)
    } catch (error) {
      console.error(error)
      setError('토큰 갱신에 실패했습니다.')
      handleLogout()
    }
  }

  const values = {
    user,
    loading,
    error, // 에러 상태 전달
    setUser,
    setLoading,
    setError, // 에러 상태 설정 함수 전달
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
