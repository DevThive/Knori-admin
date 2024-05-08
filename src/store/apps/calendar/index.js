// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import authConfig from 'src/configs/auth'

// ** Axios Imports
import axios from 'axios'

// ** Fetch Events
export const fetchEvents = createAsyncThunk('appCalendar/fetchEvents', async calendars => {
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

  // axios.get의 두 번째 인자로 params와 headers를 포함하는 설정 객체를 전달합니다.
  const response = await axios.get('https://api.knori.or.kr/calendar', {
    params: { calendars },
    headers: {
      Authorization: `Bearer ${storedToken}`
    }
  })

  return response.data
})

// ** Add Event
export const addEvent = createAsyncThunk('appCalendar/addEvent', async (event, { dispatch }) => {
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

  const response = await axios.post('https://api.knori.or.kr/calendar', event, {
    headers: {
      Authorization: `Bearer ${storedToken}`
    }
  }) // 데이터 구조 변경
  await dispatch(fetchEvents(['Personal', 'Business', 'Holiday']))

  console.log(event)

  return response.data // 응답 데이터 구조에 따라 이 부분도 적절히 수정
})

// ** Update Event
export const updateEvent = createAsyncThunk('appCalendar/updateEvent', async (event, { dispatch }) => {
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

  console.log(event.id, event.description)

  const response = await axios.put(`https://api.knori.or.kr/calendar/${event.id}`, event, {
    headers: {
      Authorization: `Bearer ${storedToken}`
    }
  })
  await dispatch(fetchEvents(['Personal', 'Business', 'Holiday']))

  return response.data.event
})

// ** Delete Event
export const deleteEvent = createAsyncThunk('appCalendar/deleteEvent', async (id, { dispatch }) => {
  const response = await axios.delete('/apps/calendar/remove-event', {
    params: { id }
  })
  await dispatch(fetchEvents(['Personal', 'Business', 'Holiday']))

  return response.data
})

export const appCalendarSlice = createSlice({
  name: 'appCalendar',
  initialState: {
    events: [],
    selectedEvent: null,
    selectedCalendars: ['Personal', 'Business', 'Holiday']
  },
  reducers: {
    handleSelectEvent: (state, action) => {
      state.selectedEvent = action.payload
    },
    handleCalendarsUpdate: (state, action) => {
      const filterIndex = state.selectedCalendars.findIndex(i => i === action.payload)
      if (state.selectedCalendars.includes(action.payload)) {
        state.selectedCalendars.splice(filterIndex, 1)
      } else {
        state.selectedCalendars.push(action.payload)
      }
      if (state.selectedCalendars.length === 0) {
        state.events.length = 0
      }
    },
    handleAllCalendars: (state, action) => {
      const value = action.payload
      if (value === true) {
        state.selectedCalendars = ['Personal', 'Business', 'Holiday']
      } else {
        state.selectedCalendars = []
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchEvents.fulfilled, (state, action) => {
      state.events = action.payload
    })
  }
})

export const { handleSelectEvent, handleCalendarsUpdate, handleAllCalendars } = appCalendarSlice.actions

export default appCalendarSlice.reducer
