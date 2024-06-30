// ** React Imports
import React, { useState, useEffect } from 'react'

// ** MUI Imports
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Avatar from '@mui/material/Avatar'
import TabContext from '@mui/lab/TabContext'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'

import axios from 'axios'

import authConfig from 'src/configs/auth'

// ** Custom Components Import
import Icon from 'src/@core/components/icon'
import OptionsMenu from 'src/@core/components/option-menu'
import CustomAvatar from 'src/@core/components/mui/avatar'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const CrmEarningReportsWithTabs = () => {
  // ** State
  const [value, setValue] = useState('매출')

  const [tabData, setTabData] = useState([
    {
      type: '매출',
      avatarIcon: 'tabler:shopping-cart',
      series: [{ data: [28, 10, 45, 38, 15, 30, 35, 28, 8, 42, 32, 12] }]
    },
    {
      type: '예약',
      avatarIcon: 'tabler:chart-bar',
      series: [{ data: [35, 25, 15, 40, 42, 25, 48, 8, 30] }]
    }
  ])

  async function updateSalesData() {
    const year = new Date().getFullYear()
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

    const salesData = await Promise.all(
      [...Array(12).keys()].map(async month => {
        try {
          const response = await axios.get(`https://api.knori.or.kr/dashboard/monthly-cost/${year}/${month + 1}`, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          })

          return response.data
        } catch (error) {
          console.error(`API 호출 중 오류 발생: ${error}`)

          return 0
        }
      })
    )

    // 매출 데이터를 업데이트
    setTabData(currentTabData =>
      currentTabData.map(tab => (tab.type === '매출' ? { ...tab, series: [{ data: salesData, type: '매출' }] } : tab))
    )
  }

  async function updateReservationData() {
    const year = new Date().getFullYear()
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

    // 여기에서 예약 데이터를 가져오는 로직을 구현해야 합니다.
    // 예시로, 예약 데이터를 가져오는 API 엔드포인트를 사용했습니다.
    // 실제 API 엔드포인트는 달라질 수 있습니다.
    const reservationData = await Promise.all(
      [...Array(12).keys()].map(async month => {
        try {
          const response = await axios.get(
            `https://api.knori.or.kr/dashboard/monthly-reservation/${year}/${month + 1}`,
            {
              headers: {
                Authorization: `Bearer ${storedToken}`
              }
            }
          )

          // console.log(response.data)

          return response.data
        } catch (error) {
          console.error(`API 호출 중 오류 발생: ${error}`)

          return 0
        }
      })
    )

    // 예약 데이터를 업데이트
    setTabData(currentTabData =>
      currentTabData.map(tab =>
        tab.type === '예약' ? { ...tab, series: [{ data: reservationData, type: '예약' }] } : tab
      )
    )
  }

  useEffect(() => {
    updateSalesData()
    updateReservationData()
  }, [])

  const renderTabPanels = (value, theme, options, colors) => {
    return tabData.map((item, index) => {
      const max = Math.max(...item.series[0].data)
      const seriesIndex = item.series[0].data.indexOf(max)

      const finalColors = colors.map((color, i) =>
        seriesIndex === i ? hexToRGBA(theme.palette.primary.main, 1) : color
      )

      return (
        <TabPanel key={index} value={item.type}>
          <ReactApexcharts type='bar' height={263} options={{ ...options, colors: finalColors }} series={item.series} />
        </TabPanel>
      )
    })
  }

  const renderTabs = (value, theme) => {
    return tabData.map((item, index) => {
      const RenderAvatar = item.type === value ? CustomAvatar : Avatar

      return (
        <Tab
          key={index}
          value={item.type}
          label={
            <Box
              sx={{
                width: 110,
                height: 94,
                borderWidth: 1,
                display: 'flex',
                alignItems: 'center',
                borderRadius: '10px',
                flexDirection: 'column',
                justifyContent: 'center',
                borderStyle: item.type === value ? 'solid' : 'dashed',
                borderColor: item.type === value ? theme.palette.primary.main : theme.palette.divider
              }}
            >
              <RenderAvatar
                variant='rounded'
                {...(item.type === value && { skin: 'light' })}
                sx={{
                  mb: 2,
                  width: 34,
                  height: 34,
                  ...(item.type !== value && { backgroundColor: 'action.selected' })
                }}
              >
                <Icon icon={item.avatarIcon} />
              </RenderAvatar>
              <Typography sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
                {item.type}
              </Typography>
            </Box>
          }
        />
      )
    })
  }

  // ** Hook
  const theme = useTheme()

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  const colors = Array(9).fill(hexToRGBA(theme.palette.primary.main, 0.16))

  let currentIndex = 0

  const seriesTypes = {
    0: '매출', // 첫 번째 시리즈의 타입은 '매출'
    1: '예약' // 두 번째 시리즈의 타입은 '예약' (예시)
    // 추가적인 시리즈 타입 정보...
  }

  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        distributed: true,
        columnWidth: '35%',
        startingShape: 'rounded',
        dataLabels: { position: 'top' }
      }
    },
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: {
      offsetY: -15,
      formatter: function (val, opts) {
        const type = opts.w.config.series[opts.seriesIndex].type

        // console.log(opts)

        if (type === '매출') {
          const millions = val / 10000

          // 만원 단위로 포맷팅하여 반환
          return `${millions.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}만원`
        } else if (type === '예약') {
          // 건수로 반환
          return `${val}건`
        }
      },
      style: {
        fontWeight: 500,
        colors: [theme.palette.text.secondary],
        fontSize: theme.typography.body1.fontSize
      }
    },
    colors,
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
        top: 20,
        left: -5,
        right: -8,
        bottom: -12
      }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { color: theme.palette.divider },
      categories: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
      labels: {
        style: {
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize
        }
      }
    },
    yaxis: {
      labels: {
        offsetX: -15,
        formatter: function (val) {
          // val 값이 1만 이상일 경우
          // if (val >= 10000) {
          //   // "만원" 단위로 포맷팅
          //   const millions = val / 10000

          //   return `${millions.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}만원`
          // } else {
          //   // 1만 이하일 경우 "건"으로 표시
          //   return `${val}건`
          // }

          return `${val}`
        },
        style: {
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize
        }
      }
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.sm,
        options: {
          plotOptions: {
            bar: { columnWidth: '60%' }
          },
          grid: {
            padding: { right: 20 }
          }
        }
      }
    ]
  }

  return (
    <Card>
      <CardHeader
        title='매출 및 예약 보고서'
        subheader='Yearly Earnings Overview'

        // action={
        //   <OptionsMenu
        //     options={['Last Week', 'Last Month', 'Last Year']}
        //     iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
        //   />
        // }
      />
      <CardContent sx={{ '& .MuiTabPanel-root': { p: 0 } }}>
        <TabContext value={value}>
          <TabList
            variant='scrollable'
            scrollButtons='auto'
            onChange={handleChange}
            aria-label='earning report tabs'
            sx={{
              border: '0 !important',
              '& .MuiTabs-indicator': { display: 'none' },
              '& .MuiTab-root': { p: 0, minWidth: 0, borderRadius: '10px', '&:not(:last-child)': { mr: 4 } }
            }}
          >
            {renderTabs(value, theme)}
          </TabList>
          {renderTabPanels(value, theme, options, colors)}
        </TabContext>
      </CardContent>
    </Card>
  )
}

export default CrmEarningReportsWithTabs
