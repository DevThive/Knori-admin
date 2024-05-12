// ** MUI Imports
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

import authConfig from 'src/configs/auth'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const CrmRevenueGrowth = () => {
  const theme = useTheme()

  // 상태 추가
  const [bookingData, setBookingData] = useState([])
  const [todayBookings, setTodayBookings] = useState(0)

  // 현재 주를 계산하는 함수
  // const getCurrentWeek = () => {
  //   const currentDate = new Date()
  //   const startOfYear = new Date(currentDate.getFullYear(), 0, 1)
  //   const pastDaysOfYear = (currentDate - startOfYear) / 86400000

  //   return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7)
  // }

  useEffect(() => {
    // API에서 데이터를 가져오는 함수
    const fetchData = async () => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

      try {
        const response = await axios.get(`https://api.knori.or.kr/dashboard/completedreservation/week`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })

        // 응답 데이터 형식 가정: { weeklyBookings: [32, 52, ...], todayBookings: 120 }
        setBookingData(response.data.revenue.weeklyBookings)
        setTodayBookings(response.data.revenue.todayBookings)
      } catch (error) {
        console.error('데이터를 가져오는 데 실패했습니다.', error)
      }
    }

    fetchData()

    // 매주 자동으로 데이터를 새로고침하기 위한 인터벌 설정
    const interval = setInterval(fetchData, 604800000) // 604800000ms = 7일

    // 컴포넌트가 언마운트될 때 인터벌을 정리
    return () => clearInterval(interval)
  }, []) // 빈 의존성 배열 => 컴포넌트 마운트 시 한 번만 실행

  // 시리즈와 옵션 정의...
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
    grid: {
      show: false,
      padding: {
        top: -4,
        left: -7,
        right: -5,
        bottom: -12
      }
    },
    xaxis: {
      categories: ['월', '화', '수', '목', '금', '토', '일'], // 요일을 한국어로 변경
      axisTicks: { show: false },
      axisBorder: { show: false },
      tickPlacement: 'on',
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
              <Typography variant='h5' sx={{ mb: 2 }}>
                주간 예약 현황
              </Typography>
              <Typography variant='body2'>주간 보고서</Typography>
            </div>
            <div>
              <Typography variant='h3' sx={{ mb: 2 }}>
                {todayBookings} 예약
              </Typography>
              {/* <CustomChip rounded size='small' skin='light' color='success' label='+15.2%' />{' '} */}
              {/* 이 부분은 예약 증가율에 따라 동적으로 변경될 수 있습니다. */}
            </div>
          </Box>
          <ReactApexcharts type='bar' width={160} height={170} series={series} options={options} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default CrmRevenueGrowth
