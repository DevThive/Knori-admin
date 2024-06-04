// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import React, { useState, useEffect } from 'react' // useState를 import합니다.
import Collapse from '@mui/material/Collapse' // Collapse 컴포넌트를 import합니다.
import axios from 'axios'
import authConfig from 'src/configs/auth'

// ** Custom Components Import
import Icon from 'src/@core/components/icon'
import OptionsMenu from 'src/@core/components/option-menu'
import CustomAvatar from 'src/@core/components/mui/avatar'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

const CrmProjectStatus = () => {
  // ** Hook
  const theme = useTheme()

  // 차트 표시 상태를 관리하기 위한 state를 추가합니다.
  const [isChartVisible, setIsChartVisible] = useState(true)
  const [series, setSeries] = useState([{ data: [] }])
  const year = new Date().getFullYear()

  const fetchMonthlyCosts = async year => {
    const months = Array.from({ length: 12 }, (_, i) => i + 1) // 1부터 12까지의 배열 생성
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

    try {
      // 모든 달의 데이터를 병렬로 가져오기
      const responses = await Promise.all(
        months.map(month =>
          axios.get(`https://api.knori.or.kr/dashboard/monthly-cost/${year}/${month}`, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          })
        )
      )

      // 각 응답에서 데이터를 추출하여 배열로 만들기
      const seriesData = responses.map(response => response.data)

      setSeries([{ data: seriesData }])
    } catch (error) {
      console.error('Error fetching monthly costs:', error)

      // 에러 처리 로직 추가 (예: 사용자에게 알림)
      throw error
    }
  }

  useEffect(() => {
    fetchMonthlyCosts(year)
  }, [year])

  // console.log(series)

  // 차트 표시 상태를 토글하는 함수입니다.
  const toggleChartVisibility = () => {
    setIsChartVisible(!isChartVisible)
  }

  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      sparkline: { enabled: true }
    },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    stroke: {
      width: 4,
      curve: 'straight'
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityTo: 0,
        opacityFrom: 1,
        shadeIntensity: 1,
        stops: [0, 100],
        colorStops: [
          [
            {
              offset: 0,
              opacity: 0.4,
              color: theme.palette.warning.main
            },
            {
              offset: 100,
              opacity: 0.1,
              color: theme.palette.background.paper
            }
          ]
        ]
      }
    },
    theme: {
      monochrome: {
        enabled: true,
        shadeTo: 'light',
        shadeIntensity: 1,
        color: theme.palette.warning.main
      }
    },
    grid: {
      show: false,
      padding: {
        top: 14,
        right: 5,
        bottom: 22
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
      <CardHeader
        title='연간 매출 현황'
        subheader={`${new Date().getFullYear()}`}
        action={
          <Typography sx={{ cursor: 'pointer', color: 'text.secondary' }} onClick={toggleChartVisibility}>
            {isChartVisible ? '숨기기' : '보기'}
          </Typography>
        }
      />
      <CardContent sx={{ pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAvatar skin='light' color='warning' variant='rounded' sx={{ mr: 3, width: 34, height: 34 }}>
            <Icon icon='tabler:currency-dollar' />
          </CustomAvatar>
          <Box
            sx={{
              rowGap: 1,
              columnGap: 4,
              width: '100%',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography variant='h6'>매출 현황</Typography>
              <Typography variant='body2' sx={{ color: 'text.disabled' }}></Typography>
            </Box>
            {/* <Typography sx={{ fontWeight: 500, color: 'success.main' }}>+10.2%</Typography> */}
          </Box>
        </Box>
        <Collapse in={isChartVisible}>
          <ReactApexcharts type='area' height={254} series={series} options={options} />
        </Collapse>
        {/* {data.map((item, index) => (
          <Box
            key={index}
            sx={{
              rowGap: 1,
              columnGap: 4,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: index !== data.length - 1 ? 4 : undefined
            }}
          >
            <Typography variant='h6'>{item.title}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ mr: 4, color: 'text.secondary' }}>{item.amount}</Typography>
              <Typography sx={{ fontWeight: 500, color: `${item.trend === 'negative' ? 'error' : 'success'}.main` }}>
                {`${item.trend === 'negative' ? '-' : '+'}${item.trendDiff}`}
              </Typography>
            </Box>
          </Box>
        ))} */}
      </CardContent>
    </Card>
  )
}

export default CrmProjectStatus
