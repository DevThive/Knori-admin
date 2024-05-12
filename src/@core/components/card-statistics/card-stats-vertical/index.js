import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import authConfig from 'src/configs/auth'

const CardStatsVertical = props => {
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

  const [monthlyCost, setMonthlyCost] = useState('')
  const [previousMonthCost, setPreviousMonthCost] = useState('')
  const [percentageChange, setPercentageChange] = useState(0)

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const previousMonth = month === 1 ? 12 : month - 1
  const previousYear = month === 1 ? year - 1 : year

  useEffect(() => {
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

    const fetchMonthlyCost = async (year, month, setStateFn) => {
      try {
        const response = await axios.get(`https://api.knori.or.kr/dashboard/monthly-cost/${year}/${month}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
        setStateFn(parseFloat(response.data)) // 응답 데이터를 숫자로 변환하여 상태에 설정
      } catch (error) {
        console.error('매출 데이터를 가져오는 데 실패했습니다.', error)
      }
    }

    fetchMonthlyCost(year, month, setMonthlyCost)
    fetchMonthlyCost(previousYear, previousMonth, setPreviousMonthCost)
  }, [year, month])

  useEffect(() => {
    if (monthlyCost && previousMonthCost && previousMonthCost !== 0) {
      const change = ((monthlyCost - previousMonthCost) / previousMonthCost) * 100
      setPercentageChange(change.toFixed(2)) // 소수점 둘째자리까지 반올림
    }
  }, [monthlyCost, previousMonthCost])

  // 숫자를 천 단위로 구분하여 문자열로 반환하는 함수
  const formatNumber = num => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

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
          {monthlyCost ? `매출: ${formatNumber(monthlyCost)}원` : '예상 매출을 불러오는 중...'}
        </Typography>
        <Typography sx={{ mb: 2.5, color: percentageChange >= 0 ? 'green' : 'red' }}>
          {monthlyCost && previousMonthCost ? `전월 대비: ${percentageChange}%` : '매출 변화율: 계산 중...%'}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default CardStatsVertical
