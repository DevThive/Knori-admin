import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

import authConfig from 'src/configs/auth'

const YearEarnData = props => {
  const {
    sx,
    title,
    chipText,
    subtitle,
    avatarIcon,
    avatarSize = 44,
    iconSize = '1.75rem',
    chipColor = 'primary',
    avatarColor = 'primary'
  } = props

  const [yearlyCost, setYearlyCost] = useState('')
  const [lastYearCost, setLastYearCost] = useState('')

  const now = new Date()
  const year = now.getFullYear()

  // 숫자를 천 단위로 구분하여 포맷하는 함수
  const formatNumber = num => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  useEffect(() => {
    const fetchYearlyCosts = async () => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

      // 이번 년도 매출 데이터 가져오기
      try {
        const response = await axios.get(`https://api.knori.or.kr/dashboard/yearly-cost/${year}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
        setYearlyCost(response.data)
      } catch (error) {
        console.error('매출 데이터를 가져오는 데 실패했습니다.', error)
      }

      // 작년도 매출 데이터 가져오기
      try {
        const response = await axios.get(`https://api.knori.or.kr/dashboard/yearly-cost/${year - 1}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
        setLastYearCost(response.data)
      } catch (error) {
        console.error('작년 매출 데이터를 가져오는 데 실패했습니다.', error)
      }
    }

    fetchYearlyCosts()
  }, [year]) // year가 바뀔 때마다 호출

  // 매출 변화율 계산
  const changeRate =
    lastYearCost && yearlyCost ? (((yearlyCost - lastYearCost) / lastYearCost) * 100).toFixed(2) : '계산 중...'

  const RenderChip = chipColor === 'default' ? Chip : CustomChip

  return (
    <Card sx={{ ...sx }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <CustomAvatar
          skin='light'
          variant='rounded'
          color={avatarColor}
          sx={{ mb: 3.5, width: avatarSize, height: avatarSize }}
        >
          <Icon icon={avatarIcon} fontSize={iconSize} />
        </CustomAvatar>
        <Typography variant='h5' sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant='body2' sx={{ mb: 1, color: 'text.disabled' }}>
          {subtitle}
        </Typography>
        <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>
          {yearlyCost ? `매출: ${formatNumber(yearlyCost)}원` : '예상 매출을 불러오는 중...'}
        </Typography>
        {/* <Typography sx={{ mb: 3.5, color: 'text.secondary' }}>
          {lastYearCost ? `작년 매출: ${formatNumber(lastYearCost)}` : '작년 매출을 불러오는 중...'}
        </Typography> */}
        <Typography sx={{ mb: 2.5, color: 'primary.main' }}>
          {changeRate ? `매출 변화율: ${changeRate}%` : '매출 변화율을 계산하는 중...'}
        </Typography>
        {/* <RenderChip
          size='small'
          label={chipText}
          color={chipColor}
          {...(chipColor === 'default'
            ? { sx: { borderRadius: '4px', color: 'text.secondary' } }
            : { rounded: true, skin: 'light' })}
        /> */}
      </CardContent>
    </Card>
  )
}

export default YearEarnData
