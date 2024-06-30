import React, { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

import axios from 'axios'

import ReactApexcharts from 'src/@core/components/react-apexcharts'
import authConfig from 'src/configs/auth'

const CrmSalesWithAreaChart = () => {
  const theme = useTheme()

  const [currentReservationsCount, setCurrentReservationsCount] = useState(0)

  useEffect(() => {
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

    axios
      .get(`https://api.knori.or.kr/dashboard/unapprovedReservationCount`, {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      })
      .then(response => {
        setCurrentReservationsCount(response.data)
      })
  }, [])

  const series = [
    {
      name: '예약자 수',
      data: [1, currentReservationsCount] // 현재 진행 중인 예약만 조회하므로, 데이터 배열에는 현재 예약자 수만 포함됩니다.
    }
  ]

  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      sparkline: { enabled: true }
    },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    stroke: {
      width: 2,
      curve: 'smooth'
    },
    grid: {
      show: false,
      padding: {
        top: 20,

        // right: 0, // 오른쪽 여백을 0으로 설정
        // left: 0, // 왼쪽 여백을 0으로 설정
        bottom: 0
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityTo: 0,
        opacityFrom: 1,
        shadeIntensity: 1,
        stops: [0, 100]
      }
    },
    theme: {
      monochrome: {
        enabled: true,
        shadeTo: 'light',
        shadeIntensity: 1,
        color: theme.palette.success.main
      }
    },
    xaxis: {
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: { show: false }
  }

  return (
    <Card>
      <CardContent sx={{ pb: 0 }}>
        <Typography variant='h5'>예약 (진행중)</Typography>
        <Typography variant='body2' sx={{ color: 'text.disabled' }}>
          전 일 대비
        </Typography>
      </CardContent>
      <ReactApexcharts type='area' height={96} series={series} options={options} />
      <CardContent sx={{ pt: 0 }}>
        <Box sx={{ gap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='h4'>{currentReservationsCount}건</Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default CrmSalesWithAreaChart
