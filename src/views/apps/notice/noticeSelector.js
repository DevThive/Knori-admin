import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'

import authConfig from 'src/configs/auth'

function TogglePrivacy({ id }) {
  const [isPrivate, setIsPrivate] = useState(false)

  useEffect(() => {
    const fetchPrivacyStatus = async () => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      try {
        const response = await Axios.get(`https://api.knori.or.kr/notices/${id}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
        setIsPrivate(response.data.state === 1)
      } catch (error) {
        console.error('비공개 상태 로딩 중 에러 발생:', error)
      }
    }

    fetchPrivacyStatus()
  }, [id])

  const handlePrivacyChange = async event => {
    const newPrivacyValue = event.target.checked

    // UI를 즉각 업데이트하여 사용자에게 피드백 제공
    setIsPrivate(newPrivacyValue)
    const privacyValue = newPrivacyValue ? 1 : 0
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
    try {
      await Axios.patch(
        `https://api.knori.or.kr/notices/hide/${id}`,
        { state: privacyValue },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      )

      // 성공적으로 상태가 변경됨. 추가적인 상태 업데이트는 필요 없음.
    } catch (error) {
      console.error('비공개 처리 상태 변경 중 에러 발생:', error)

      // 요청이 실패했다면, 사용자에게 변경 전 상태로 롤백
      setIsPrivate(!newPrivacyValue)
    }
  }

  return (
    <FormControlLabel
      control={<Switch checked={isPrivate} color='error' onChange={handlePrivacyChange} />}
      label='비공개처리'
    />
  )
}

export default TogglePrivacy
