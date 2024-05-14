// ** MUI Imports
import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

import axios from 'axios'

import authConfig from 'src/configs/auth'

// ** Custom Components Import
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const CrmSessions = () => {
  // ** Hook
  const theme = useTheme()
  const [currentYearEarnings, setCurrentYearEarnings] = useState(0)
  const [lastYearEarnings, setLastYearEarnings] = useState(0)
  const [growthRate, setGrowthRate] = useState(0)
  const [chartSeries, setChartSeries] = useState([])

  useEffect(() => {
    // 현재 년도와 지난 년도를 계산합니다.
    const currentYear = new Date().getFullYear()
    const lastYear = currentYear - 1
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

    const fetchData = async () => {
      try {
        // 현재 년도 데이터를 가져옵니다.
        const responseCurrentYear = await axios
          .get(`https://api.knori.or.kr/dashboard/completedreservation/${currentYear}`, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          })
          .then(response => {
            // console.log(response.data)

            const dataCurrentYear = response.data // axios는 자동으로 JSON을 파싱합니다, 따라서 .json() 호출은 필요 없습니다.
            setCurrentYearEarnings(dataCurrentYear) // 실제 데이터 구조에 맞게 경로를 수정해주세요.
            // axios는 자동으로 json을 파싱합니다.
          }) // API URL을 현재 년도에 맞게 수정합니다.

        // 지난 년도 데이터를 가져옵니다.
        const responseLastYear = await axios
          .get(`https://api.knori.or.kr/dashboard/completedreservation/${lastYear}`, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          })
          .then(response => {
            console.log(response.data)
            const dataLastYear = response.data // axios는 자동으로 JSON을 파싱합니다.
            setLastYearEarnings(dataLastYear) // 실제 데이터 구조에 맞게 경로를 수정해주세요.
          }) // API URL을 지난 년도에 맞게 수정합니다.
      } catch (error) {
        console.error('데이터를 가져오는 중 오류가 발생했습니다.', error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    setChartSeries([
      { name: '이번 년도 예약건', data: [lastYearEarnings, currentYearEarnings] } // 현재 년도와 지난 년도 예약건 수
    ])
  }, [currentYearEarnings, lastYearEarnings])

  useEffect(() => {
    if (lastYearEarnings > 0) {
      const change = ((currentYearEarnings - lastYearEarnings) / lastYearEarnings) * 100
      setGrowthRate(change.toFixed(2))
    }
  }, [currentYearEarnings, lastYearEarnings])

  const options = {
    chart: {
      type: 'area',
      stacked: true,
      parentHeightOffset: 0,
      toolbar: { show: false },
      sparkline: { enabled: true },

      // offsetX: 0, // 차트의 왼쪽 여백을 줄입니다.
      offsetY: -5
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    colors: [hexToRGBA(theme.palette.primary.main, 1), hexToRGBA(theme.palette.success.main, 1)],
    stroke: {
      width: 1,
      curve: 'smooth',
      colors: [theme.palette.background.paper]
    },
    plotOptions: {
      area: {
        fillOpacity: 0.5,
        borderRadius: 6
      }
    },
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    grid: {
      padding: {
        top: -4,

        // right: 0, // 오른쪽 여백을 0으로 설정
        // left: 0, // 왼쪽 여백을 0으로 설정
        bottom: -3
      },
      yaxis: {
        lines: { show: false }
      }
    },
    xaxis: {
      categories: ['이번 년도', '지난 년도'],
      labels: { show: true },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      labels: { show: false }, // y축 라벨을 숨깁니다.
      axisTicks: { show: false },
      axisBorder: { show: false }
    }
  }

  return (
    <Card>
      <CardContent>
        <Typography variant='h5'>예약 완료</Typography>
        <Typography variant='body2' sx={{ color: 'text.disabled' }}>
          지난해 대비
        </Typography>
        <ReactApexcharts type='area' height={96} series={chartSeries} options={options} />
        <Box sx={{ gap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='h4'>{currentYearEarnings.toLocaleString()}건</Typography>
          <Typography variant='body2' sx={{ color: growthRate >= 0 ? 'success.main' : 'error.main' }}>
            {growthRate}%
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default CrmSessions
