// MUI 및 기타 필수 라이브러리 임포트
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Box, Card, Typography, CardContent, useTheme } from '@mui/material'

// 구성 및 커스텀 컴포넌트 임포트
import authConfig from 'src/configs/auth'
import CustomChip from 'src/@core/components/mui/chip'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// 유틸리티 임포트
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const CrmRevenueGrowth = () => {
  const theme = useTheme()

  // 상태 관리
  const [bookingData, setBookingData] = useState([])
  const [todayBookings, setTodayBookings] = useState(0)
  const [week, setWeek] = useState(getCurrentWeek())

  // 컴포넌트 내에서 현재 주 범위 상태 관리 추가
  const [currentWeekRange, setCurrentWeekRange] = useState(getCurrentWeekRange())

  // 현재 주 계산
  function getCurrentWeek() {
    const currentDate = new Date()
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1)
    const pastDaysOfYear = (currentDate - startOfYear) / 86400000

    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7)
  }

  // 현재 주의 범위를 계산하는 함수 추가
  function getCurrentWeekRange() {
    const currentDate = new Date()
    const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1)
    const days = Math.floor((currentDate - firstDayOfYear) / (24 * 60 * 60 * 1000))
    const weekNumber = Math.ceil((currentDate.getDay() + 1 + days) / 7)

    const startOfWeek = new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1 + (weekNumber - week) * 7)
    )
    const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000)

    const startOfWeekFormatted = `${startOfWeek.getFullYear()}-${startOfWeek.getMonth() + 1}-${startOfWeek.getDate()}`
    const endOfWeekFormatted = `${endOfWeek.getFullYear()}-${endOfWeek.getMonth() + 1}-${endOfWeek.getDate()}`

    return `${startOfWeekFormatted} ~ ${endOfWeekFormatted}`
  }

  // 이전 및 다음 주 이동 함수
  const goToPreviousWeek = () => setWeek(week - 1)
  const goToNextWeek = () => setWeek(week + 1)

  useEffect(() => {
    async function fetchData(day) {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

      try {
        const response = await axios.get(`https://api.knori.or.kr/dashboard/completedreservation/week/${day}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })

        // 예시 응답 데이터: { weeklyBookings: [32, 52, ...], todayBookings: 120 }
        const weeklyBookings = response.data.revenue.weeklyBookings
        setBookingData(weeklyBookings)

        // 주간 예약 건수의 합 계산 후 todayBookings 업데이트
        const totalBookings = weeklyBookings.reduce((acc, current) => acc + current, 0)
        setTodayBookings(totalBookings)
      } catch (error) {
        console.error('데이터를 가져오는 데 실패했습니다.', error)
      }
    }

    fetchData(week)
    setCurrentWeekRange(getCurrentWeekRange())
  }, [week])

  // 차트 시리즈 및 옵션 설정
  const series = [{ data: bookingData }]

  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        distributed: true,
        columnWidth: '42%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    colors: [
      hexToRGBA(theme.palette.success.main, 0.16),
      hexToRGBA(theme.palette.success.main, 0.16),
      hexToRGBA(theme.palette.success.main, 0.16),
      hexToRGBA(theme.palette.success.main, 0.16),
      hexToRGBA(theme.palette.success.main, 1),
      hexToRGBA(theme.palette.success.main, 0.16),
      hexToRGBA(theme.palette.success.main, 0.16)
    ],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    grid: { show: false },
    xaxis: {
      categories: ['월', '화', '수', '목', '금', '토', '일'],
      axisTicks: { show: false },
      axisBorder: { show: false },
      labels: {
        style: {
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize
        }
      }
    },
    yaxis: { show: false }
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ gap: 2, display: 'flex', alignItems: 'stretch', justifyContent: 'space-between' }}>
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {/* 주간 이동 버튼 */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: '',
                  marginBottom: '10%' // 여기를 수정했습니다.
                }}
              >
                <button
                  onClick={goToNextWeek}
                  style={{
                    backgroundColor: '#e0e0e0', // 배경색을 회색으로 변경
                    color: 'black', // 텍스트 색상을 검은색으로 변경
                    border: 'none',
                    borderRadius: '4px',
                    padding: '6px 12px', // 패딩 조정
                    marginRight: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                      backgroundColor: '#bdbdbd' // 호버 시 색상 변경
                    }
                  }}
                >
                  {'<'}
                </button>
                <button
                  onClick={goToPreviousWeek}
                  style={{
                    backgroundColor: '#e0e0e0', // 배경색을 회색으로 변경
                    color: 'black', // 텍스트 색상을 검은색으로 변경
                    border: 'none',
                    borderRadius: '4px',
                    padding: '6px 12px', // 패딩 조정
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                      backgroundColor: '#bdbdbd' // 호버 시 색상 변경
                    }
                  }}
                >
                  {'>'}
                </button>
              </div>{' '}
              <Typography variant='h5' sx={{ mb: 2 }}>
                주간 예약 현황
              </Typography>
              <Typography variant='body2'>주간 보고서</Typography>
              <Typography variant='body2'>{currentWeekRange}</Typography>
            </div>
            <div>
              <Typography variant='h3' sx={{ mb: 2 }}>
                {todayBookings} 예약
              </Typography>
              {/* 예약 증가율에 따른 동적 컴포넌트 필요 */}
            </div>
          </Box>

          <ReactApexcharts type='bar' width={160} height={170} series={series} options={options} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default CrmRevenueGrowth
