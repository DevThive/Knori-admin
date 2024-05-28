// ** React Imports
import React, { useState, useCallback, useEffect } from 'react'

import axios from 'axios'

// ** Next Import
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import EditorControlled from './noticeEditor'
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import authConfig from 'src/configs/auth'

// ** Source code imports

import { Editor } from '@tinymce/tinymce-react'

// ** Icon Imports

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import FileUploaderNotice from './noticeFile'

const MyEditor = React.memo(({ content, setContent }) => {
  return (
    <Editor
      apiKey='26sy0i9udfu6ywiu9vyfsyplgxq6m59eh12xj34jvmns430g'
      value={content} // initialValue 대신에 value 사용
      onEditorChange={(newContent, editor) => {
        setContent(newContent)
      }}
      init={{
        height: 500,
        menubar: false,
        plugins: [
          'advlist',
          'autolink',
          'lists',
          'link',
          'image',
          'charmap',
          'preview',
          'anchor',
          'searchreplace',
          'visualblocks',
          'code',
          'fullscreen',
          'insertdatetime',
          'media',
          'table',
          'code',
          'help',
          'wordcount'
        ],
        toolbar:
          'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
      }}
    />
  )
})

const Noticeeditor = props => {
  // ** States
  const [title, setTitle] = useState('') // 제목을 위한 상태
  const [content, setContent] = useState('') // 에디터 내용을 위한 상태
  const [file, setFile] = useState(null)

  const handleFileSelect = selectedFile => {
    setFile(selectedFile)
  }
  useEffect(() => {
    // console.log(typeof file) // 이 로그는 file 상태가 변경될 때마다 출력됩니다.
  }, [file])

  const handleTitleChange = e => {
    setTitle(e.target.value) // 제목 입력값이 변경될 때 상태 업데이트
  }

  // EditorControlled 컴포넌트에서 에디터 내용 변경 시 호출될 콜백 함수
  const handleEditorChange = newContent => {
    setContent(newContent) // 에디터 내용이 변경될 때 상태 업데이트
  }

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      const formData = new FormData()
      formData.append('content_name', title)
      formData.append('content', content)
      formData.append('file', file)

      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

      const response = await axios.post('https://api.knori.or.kr/notices', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${storedToken}`
        }
      })

      console.log('데이터가 성공적으로 전송되었습니다:', response.data)

      // 여기에서 props로 받은 함수들을 호출
      props.updateNotices(response.data) // `notices` 상태 업데이트
      props.closeModal() // 모달 닫기
      window.location.reload()
    } catch (error) {
      console.error('데이터 전송 중 오류가 발생했습니다:', error)
    }
  }

  return (
    <Card>
      <CardHeader title='공지사항 추가하기' />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <CustomTextField fullWidth label='제목' placeholder='제목' value={title} onChange={handleTitleChange} />
            </Grid>
            <Grid item xs={12}>
              <MyEditor content={content} setContent={setContent} />
            </Grid>

            <Grid item xs={12}>
              <FileUploaderNotice label='대표이미지' onFileSelect={handleFileSelect} />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  gap: 5,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Button type='submit' variant='contained'>
                  저장하기
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default Noticeeditor
