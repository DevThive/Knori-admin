import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { styled } from '@mui/material/styles'

const StyledDropzone = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: '12px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  cursor: 'pointer',
  backgroundColor: theme.palette.action.hover,
  '&:hover': {
    backgroundColor: theme.palette.action.selected
  }
}))

const StyledIcon = styled(CloudUploadIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: '64px'
}))

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2)
}))

const StyledImagePreview = styled('img')({
  maxWidth: '100%',
  maxHeight: '200px',
  marginTop: '20px'
})

const FileUploaderSingle = ({ onFileSelect }) => {
  const [previewSrc, setPreviewSrc] = useState(null)

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0]
      onFileSelect(file)
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewSrc(reader.result)
      }
      reader.readAsDataURL(file)
    }
  })

  return (
    <StyledDropzone {...getRootProps()}>
      <input {...getInputProps()} />
      <StyledIcon />
      <StyledTypography>파일을 여기에 놓거나 클릭하여 업로드 하세요.</StyledTypography>
      {previewSrc && <StyledImagePreview src={previewSrc} alt='File preview' />}
    </StyledDropzone>
  )
}

export default FileUploaderSingle
