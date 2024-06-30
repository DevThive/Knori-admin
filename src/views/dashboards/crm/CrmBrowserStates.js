// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import axios from 'axios'
import { useState, useEffect } from 'react'

import authConfig from 'src/configs/auth'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'

const CrmBrowserStates = () => {
  const [data, setData] = useState([])

  // 컴포넌트가 마운트 되었을 때 데이터를 불러오는 useEffect를 정의합니다.
  useEffect(() => {
    // API 호출 함수를 비동기로 선언합니다.
    const fetchData = async () => {
      try {
        const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

        const currentYear = new Date().getFullYear()

        // 여기서 'your-api-url'은 실제 데이터를 요청할 API의 URL로 대체해야 합니다.
        const response = await axios.get(`https://api.knori.or.kr/dashboard/countClassesByYear/${currentYear}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })

        // 응답으로 받은 데이터를 상태에 저장합니다.
        // console.log(response.data)
        if (Array.isArray(response.data.classReservationCounts)) {
          setData(response.data.classReservationCounts)
        } else {
          console.error('받은 데이터가 배열이 아닙니다:', response.data)

          // 필요하다면 여기서 데이터를 배열로 변환하여 setData할 수 있습니다.
          // 예: setData([response.data]); // 데이터를 배열에 포장
        }
      } catch (error) {
        console.error('데이터를 불러오는데 실패했습니다.', error)
      }
    }

    // fetchData 함수를 호출합니다.
    fetchData()
  }, []) // 빈 배열을 전달하여 컴포넌트 마운트 시에만 fetchData가 실행되도록 합니다.

  return (
    <Card>
      <CardHeader
        title='연간 예약 관리 대시보드'
        subheader={`${new Date().getFullYear()}년도 예약 현황`}

        // action={
        //   <OptionsMenu
        //     options={['Last 28 Days', 'Last Month', 'Last Year']}
        //     iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
        //   />
        // }
      />
      <CardContent>
        {data.map((item, index) => {
          return (
            <Box
              key={item.title}
              sx={{
                display: 'flex',
                '& img': { mr: 4 },
                alignItems: 'center',
                mb: index !== data.length - 1 ? 8.25 : undefined
              }}
            >
              <img width={28} src={item.imgSrc} alt={item.title} style={{ borderRadius: '50%' }} />

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
                <Typography variant='h6'>{item.title}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant='h6' sx={{ mr: 4, color: 'text.secondary' }}>
                    {item.percentage}
                  </Typography>
                  <Box sx={{ display: 'flex', position: 'relative' }}>
                    <CircularProgress
                      size={28}
                      value={100}
                      thickness={5}
                      variant='determinate'
                      sx={{ position: 'absolute', color: theme => theme.palette.customColors.trackBg }}
                    />
                    <CircularProgress
                      size={28}
                      thickness={5}
                      value={item.progress}
                      variant='determinate'
                      color={item.progressColor}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default CrmBrowserStates
