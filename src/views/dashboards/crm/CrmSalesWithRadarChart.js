import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import axios from 'axios'

import authConfig from 'src/configs/auth'

import OptionsMenu from 'src/@core/components/option-menu'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

const CrmSalesWithRadarChart = () => {
  const theme = useTheme()

  const [series, setSeries] = useState([
    { name: '예약', data: [] },
    { name: '방문', data: [] }
  ])

  // options 상태와 이 상태를 업데이트하는 함수 추가
  const [options, setOptions] = useState({
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    colors: [theme.palette.primary.main, theme.palette.info.main],
    plotOptions: {
      radar: {
        size: 110,
        polygons: {
          strokeColors: theme.palette.divider,
          connectorColors: theme.palette.divider
        }
      }
    },
    stroke: { width: 0 },
    fill: {
      opacity: [1, 0.85]
    },
    labels: [], // 초기 labels 값을 빈 배열로 설정
    markers: { size: 0 },
    legend: {
      fontSize: '13px',
      fontFamily: theme.typography.fontFamily,
      labels: { colors: theme.palette.text.secondary },
      itemMargin: {
        vertical: 4,
        horizontal: 10
      },
      markers: {
        width: 12,
        height: 12,
        radius: 10,
        offsetY: 1,
        offsetX: theme.direction === 'ltr' ? -4 : 5
      }
    },
    grid: {
      show: false,
      padding: {
        top: 10
      }
    },
    xaxis: {
      labels: {
        show: true,
        style: {
          fontSize: theme.typography.body2.fontSize,
          colors: [
            theme.palette.text.disabled,
            theme.palette.text.disabled,
            theme.palette.text.disabled,
            theme.palette.text.disabled,
            theme.palette.text.disabled,
            theme.palette.text.disabled
          ]
        }
      }
    },
    yaxis: { show: false },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.lg,
        options: {
          chart: { height: 337 }
        }
      }
    ]
  })

  useEffect(() => {
    const fetchData = async () => {
      const labels = []
      for (let i = 5; i >= 0; i--) {
        const d = new Date()
        d.setMonth(d.getMonth() - i)
        labels.push(d.toLocaleString('default', { month: 'short', year: 'numeric' }))
      }
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      try {
        const reservationResponse = await axios.get('https://api.knori.or.kr/dashboard/halfmonthreservation', {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
        const reservationData = reservationResponse.data.map(item => item.reservationCount)

        const visitResponse = await axios.get('https://api.knori.or.kr/dashboard/findhalfmonthvisiting', {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })

        // API 응답 구조에 맞게 visitData도 변환해야 하지만, 예시 응답이 주어지지 않았으므로 예시로 처리합니다.
        const visitData = visitResponse.data.map(item => item.reservationCount) // 이 부분은 실제 응답 구조에 맞게 수정해야 합니다.

        setSeries([
          { name: '예약', data: reservationData },
          { name: '방문', data: visitData }
        ])

        // labels 직접 업데이트
        setOptions(prevOptions => ({ ...prevOptions, labels }))
      } catch (error) {
        console.error('An error occurred while fetching the data.', error)
      }
    }

    fetchData()
  }, [theme])

  return (
    <Card>
      <CardHeader
        title='방문 & 예약'
        subheader='6개월 기준'
        action={
          <OptionsMenu
            options={['Last Month', 'Last 6 months', 'Last Year']}
            iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
          />
        }
      />
      <CardContent>
        <ReactApexcharts type='radar' height={357} series={series} options={options} />
      </CardContent>
    </Card>
  )
}

export default CrmSalesWithRadarChart
