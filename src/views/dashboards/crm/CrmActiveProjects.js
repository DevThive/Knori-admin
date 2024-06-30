import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'
import axios from 'axios'
import { useState, useEffect } from 'react'

import authConfig from 'src/configs/auth'

const CrmActiveProjects = () => {
  // 상태를 저장할 useState를 정의합니다. 초기값으로 빈 배열을 설정합니다.
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

        const response = await axios.get('https://api.knori.or.kr/dashboard/countsByClass', {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
        setData(response.data)

        // console.log(response.data)
      } catch (error) {
        console.error('데이터를 불러오는데 실패했습니다.', error)
      }
    }

    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader title='클래스 이용자 수' subheader='전체 클래스 이용자 통계' />
      <CardContent>
        {/* data가 배열인지 확인하고, 배열일 때만 map 함수를 실행합니다. */}
        {Array.isArray(data) &&
          data.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: index !== data.length - 1 ? 4.5 : undefined
              }}
            >
              <img alt={item.title} src={item.imgSrc} width={32} style={{ borderRadius: '50%' }} />
              <Box
                sx={{
                  ml: 4,
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
                  <Typography variant='h6'>{item.title}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LinearProgress
                    value={item.progress}
                    variant='determinate'
                    color={item.progressColor}
                    sx={{ mr: 4, height: 8, width: 80 }}
                  />
                  <Typography sx={{ color: 'text.disabled' }}>{`${item.progress}%`}</Typography>
                </Box>
              </Box>
            </Box>
          ))}
      </CardContent>
    </Card>
  )
}

export default CrmActiveProjects
