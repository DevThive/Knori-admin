// React 및 필요한 라이브러리 import
import { useState, useEffect } from 'react'
import axios from 'axios'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import authConfig from 'src/configs/auth'

const ScheduleModal = props => {
  // 시간 데이터와 사용자 선택을 관리하기 위한 state
  const [schedule, setSchedule] = useState([])

  // 컴포넌트 마운트 시 시간 데이터 가져오기
  useEffect(() => {
    fetchSchedule()
  }, [])

  const fetchSchedule = async () => {
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
    try {
      const response = await axios.get(`https://api.knori.or.kr/class-schedule/admin/${props.scheduleData}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      })
      setSchedule(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  // 시간 선택 핸들러
  const handleSelect = async index => {
    const newSchedule = [...schedule]
    const newState = newSchedule[index].state === 1 ? 0 : 1
    newSchedule[index].state = newState

    // API 호출을 통해 서버 상태 업데이트
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
    try {
      await axios.patch(
        `https://api.knori.or.kr/class-schedule/show/${newSchedule[index].id}`,
        {
          state: newState
        },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        }
      )

      // 클라이언트 상태 업데이트
      setSchedule(newSchedule)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Card>
      <CardHeader title='시간관리' />
      <CardContent>
        <form onSubmit={e => e.preventDefault()}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Box
                sx={{
                  gap: 2,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {schedule.map((item, index) => (
                  <Button
                    key={index}
                    variant={item.state === 1 ? 'contained' : 'outlined'}
                    onClick={() => handleSelect(index)}
                  >
                    {item.time}
                  </Button>
                ))}
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default ScheduleModal
