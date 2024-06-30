import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

const AuthRedirect = () => {
  const router = useRouter()

  useEffect(() => {
    // URL에서 쿼리 파라미터를 추출하는 함수
    function getQueryParam(param) {
      const urlParams = new URLSearchParams(window.location.search)

      return urlParams.get(param)
    }

    // 토큰 추출
    const token = getQueryParam('token')

    // 원래 창에 메시지 전송
    if (window.opener && token) {
      window.opener.postMessage({ token: token }, '*')
      window.close()
    } else {
      console.error('No token or opener window found')

      // 필요한 경우, 에러 페이지로 리디렉션
      router.push('/error')
    }
  }, [router])

  return <div>인증 중입니다...</div>
}

export default AuthRedirect
