// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import List from '@mui/material/List'
import Input from '@mui/material/Input'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import { createFilterOptions } from '@mui/material/Autocomplete'

// ** Custom Component Imports
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import { EditorState } from 'draft-js'

import { convertToRaw } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'

// import { nodemailer } from 'nodemailer'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'
import CustomAvatar from 'src/@core/components/mui/avatar'
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'

// ** Styled Component Imports
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const menuItemsArr = [
  {
    name: 'Ross Geller',
    value: 'ross',
    src: '/images/avatars/1.png'
  },
  {
    name: 'Pheobe Buffay',
    value: 'pheobe',
    src: '/images/avatars/2.png'
  },
  {
    name: 'Joey Tribbiani',
    value: 'joey',
    src: '/images/avatars/3.png'
  },
  {
    name: 'Rachel Green',
    value: 'rachel',
    src: '/images/avatars/4.png'
  },
  {
    name: 'Chandler Bing',
    value: 'chandler',
    src: '/images/avatars/5.png'
  },
  {
    name: 'Monica Geller',
    value: 'monica',
    src: '/images/avatars/8.png'
  }
]
const filter = createFilterOptions()

const ComposePopup = props => {
  // ** Props
  const { mdAbove, composeOpen, composePopupWidth, toggleComposeOpen } = props

  // ** States
  const [emailTo, setEmailTo] = useState([])
  const [ccValue, setccValue] = useState([])
  const [subjectValue, setSubjectValue] = useState('')
  const [bccValue, setbccValue] = useState([])

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const [editorHtml, setEditorHtml] = useState('')
  const [editorText, setEditorText] = useState('')

  const [visibility, setVisibility] = useState({
    cc: false,
    bcc: false
  })
  const toggleVisibility = value => setVisibility({ ...visibility, [value]: !visibility[value] })

  const handleMailDelete = (value, state, setState) => {
    const arr = state
    const index = arr.findIndex(i => i.value === value)
    arr.splice(index, 1)
    setState([...arr])
  }

  const handlePopupClose = () => {
    toggleComposeOpen()
    setEmailTo([])
    setccValue([])
    setbccValue([])
    setSubjectValue('')
    setEditorState()
    setVisibility({
      cc: false,
      bcc: false
    })
  }

  const onEditorStateChange = newEditorState => {
    const currentContent = newEditorState.getCurrentContent() // 현재 에디터의 컨텐츠를 가져옵니다.
    const rawContentState = convertToRaw(currentContent) // 컨텐츠를 원시 JS 객체로 변환합니다.
    const textString = rawContentState.blocks.map(block => block.text).join('\n') // 각 블록의 텍스트를 \n으로 연결하여 전체 텍스트를 만듭니다.
    // console.log(textString) // 콘솔에 전체 텍스트를 출력합니다.

    const htmlString = stateToHTML(currentContent) // 컨텐츠를 HTML 형식으로 변환합니다.
    // console.log(htmlString) // HTML 형식의 텍스트를 콘솔에 출력합니다.

    setEditorText(textString)
    setEditorState(newEditorState) // setState 함수로 상태를 업데이트합니다.
    setEditorHtml(htmlString) // HTML 형식의 텍스트를 상태로 업데이트합니다.
  }

  // const handleSendMail = () => {
  //   console.log(emailTo, ccValue, bccValue, subjectValue, editorHtml)
  // }

  const handleSendMail = async () => {
    console.log(emailTo, ccValue, bccValue, subjectValue, editorHtml)
  }

  const handleMinimize = () => {
    toggleComposeOpen()
    setEmailTo(emailTo)
    setccValue(ccValue)
    setbccValue(bccValue)
    setVisibility(visibility)
    setEditorState(editorState)
    setSubjectValue(subjectValue)
  }

  const renderCustomChips = (array, getTagProps, state, setState) => {
    return array.map((item, index) => (
      <Chip
        size='small'
        key={item.value}
        label={item.name}
        {...getTagProps({ index })}
        deleteIcon={<Icon icon='tabler:x' />}
        onDelete={() => handleMailDelete(item.value, state, setState)}
      />
    ))
  }

  const renderListItem = (props, option, array, setState) => {
    return (
      <ListItem {...props} key={option.value} sx={{ cursor: 'pointer' }} onClick={() => setState([...array, option])}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {option.src.length ? (
            <CustomAvatar src={option.src} alt={option.name} sx={{ mr: 3, width: 22, height: 22 }} />
          ) : (
            <CustomAvatar skin='light' color='primary' sx={{ mr: 3, width: 22, height: 22, fontSize: '.75rem' }}>
              {getInitials(option.name)}
            </CustomAvatar>
          )}
          <Typography sx={{ fontSize: theme => theme.typography.body2.fontSize }}>{option.name}</Typography>
        </Box>
      </ListItem>
    )
  }

  const addNewOption = (options, params) => {
    const filtered = filter(options, params)
    const { inputValue } = params
    const isExisting = options.some(option => inputValue === option.name)
    if (inputValue !== '' && !isExisting) {
      filtered.push({
        name: inputValue,
        value: inputValue,
        src: ''
      })
    }

    // @ts-ignore
    return filtered
  }

  return (
    <Drawer
      hideBackdrop
      elevation={18}
      anchor='bottom'
      open={composeOpen}
      variant='temporary'
      onClose={toggleComposeOpen}
      sx={{
        top: 'auto',
        left: 'auto',
        display: 'block',
        bottom: theme => theme.spacing(5),
        zIndex: theme => theme.zIndex.drawer + 1,
        right: theme => theme.spacing(mdAbove ? 6 : 4),
        '& .Mui-focused': { boxShadow: 'none !important' },
        '& .MuiDrawer-paper': {
          borderRadius: 1,
          position: 'static',
          width: composePopupWidth
        }
      }}
    >
      <Box
        sx={{
          px: 5,
          py: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'action.hover'
        }}
      >
        <Typography variant='h5' sx={{ fontWeight: 500 }}>
          새 메일
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton sx={{ p: 1, mr: 2 }} onClick={handleMinimize}>
            <Icon icon='tabler:minus' fontSize={20} />
          </IconButton>
          <IconButton sx={{ p: 1 }} onClick={handlePopupClose}>
            <Icon icon='tabler:x' fontSize={20} />
          </IconButton>
        </Box>
      </Box>
      <Box
        sx={{
          px: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: theme => `1px solid ${theme.palette.divider}`
        }}
      >
        <Box sx={{ width: '90%', display: 'flex', alignItems: 'center' }}>
          <div>
            <InputLabel
              htmlFor='email-to-select'
              sx={{ mr: 3, fontSize: theme => theme.typography.body2.fontSize, lineHeight: 1.539 }}
            >
              받는사람:
            </InputLabel>
          </div>
          <CustomAutocomplete
            multiple
            freeSolo
            value={emailTo}
            clearIcon={false}
            id='email-to-select'
            filterSelectedOptions
            options={menuItemsArr}
            ListboxComponent={List}
            filterOptions={addNewOption}
            getOptionLabel={option => option.name}
            renderOption={(props, option) => renderListItem(props, option, emailTo, setEmailTo)}
            renderTags={(array, getTagProps) => renderCustomChips(array, getTagProps, emailTo, setEmailTo)}
            sx={{
              width: '100%',
              '& .MuiOutlinedInput-root': { p: 2 },
              '& .MuiAutocomplete-endAdornment': { display: 'none' }
            }}
            renderInput={params => (
              <CustomTextField
                {...params}
                autoComplete='new-password'
                sx={{
                  '& .MuiFilledInput-root.MuiInputBase-sizeSmall': { border: '0 !important', p: '0 !important' },
                  '& .MuiFilledInput-input.MuiInputBase-inputSizeSmall': {
                    px: theme => `${theme.spacing(1.5)} !important`,
                    py: theme => `${theme.spacing(2.125)} !important`
                  }
                }}
              />
            )}
          />
        </Box>
        <Typography variant='body2' sx={{ color: 'primary.main' }}>
          <Box component='span' sx={{ cursor: 'pointer' }} onClick={() => toggleVisibility('cc')}>
            참조
          </Box>
          <Box component='span' sx={{ mx: 1 }}>
            |
          </Box>
          <Box component='span' sx={{ cursor: 'pointer' }} onClick={() => toggleVisibility('bcc')}>
            비참조
          </Box>
        </Typography>
      </Box>
      {visibility.cc ? (
        <Box
          sx={{
            px: 5,
            display: 'flex',
            alignItems: 'center',
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <div>
            <InputLabel sx={{ mr: 3, fontSize: theme => theme.typography.body2.fontSize }} htmlFor='email-cc-select'>
              참조:
            </InputLabel>
          </div>
          <CustomTextField
            fullWidth
            sx={{
              '& .MuiFilledInput-root.MuiInputBase-sizeSmall': { border: '0 !important', p: '0 !important' }
            }}
            onChange={event => {
              setccValue(event.target.value) // 입력된 값을 setccValue 함수에 전달
            }}
          />
        </Box>
      ) : null}
      {visibility.bcc ? (
        <Box
          sx={{
            px: 5,
            display: 'flex',
            alignItems: 'center',
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <div>
            <InputLabel sx={{ mr: 3, fontSize: theme => theme.typography.body2.fontSize }} htmlFor='email-bcc-select'>
              비참조:
            </InputLabel>
          </div>
          <CustomTextField
            fullWidth
            sx={{
              '& .MuiFilledInput-root.MuiInputBase-sizeSmall': { border: '0 !important', p: '0 !important' }
            }}
            onChange={event => {
              setbccValue(event.target.value) // 입력된 값을 setccValue 함수에 전달
            }}
          />
        </Box>
      ) : null}
      <Box
        sx={{
          px: 5,
          display: 'flex',
          alignItems: 'center',
          borderBottom: theme => `1px solid ${theme.palette.divider}`
        }}
      >
        <div>
          <InputLabel
            htmlFor='email-subject-input'
            sx={{ mr: 3, fontSize: theme => theme.typography.body2.fontSize, lineHeight: 1.539 }}
          >
            제목:
          </InputLabel>
        </div>
        <Input
          fullWidth
          value={subjectValue}
          id='email-subject-input'
          onChange={e => setSubjectValue(e.target.value)}
          sx={{ '&:before, &:after': { display: 'none' }, '& .MuiInput-input': { py: 2.125 } }}
        />
      </Box>
      <EditorWrapper
        sx={{
          '& .rdw-editor-wrapper .rdw-editor-main': { px: 5 },
          '& .rdw-editor-wrapper, & .rdw-option-wrapper': { border: 0 }
        }}
      >
        <ReactDraftWysiwyg
          editorState={editorState}
          onEditorStateChange={onEditorStateChange}
          placeholder='Write your message...'
          toolbar={{
            options: ['inline', 'list', 'link', 'image'],
            inline: {
              inDropdown: false,
              options: ['bold', 'italic', 'underline']
            },
            list: {
              inDropdown: false,
              options: ['unordered', 'ordered']
            },
            link: {
              inDropdown: false,
              options: ['link']
            }
          }}
        />
      </EditorWrapper>
      <Box
        sx={{
          py: 4,
          px: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: theme => `1px solid ${theme.palette.divider}`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button variant='contained' onClick={handleSendMail} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='tabler:send' fontSize='1.125rem' />
            전송
          </Button>
          <IconButton size='small' sx={{ ml: 3, color: 'text.secondary' }}>
            <Icon icon='tabler:paperclip' fontSize='1.25rem' />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <OptionsMenu
            iconButtonProps={{ size: 'small' }}
            iconProps={{ fontSize: '1.25rem' }}
            options={['Print', 'Check spelling', 'Plain text mode']}
            menuProps={{
              anchorOrigin: { vertical: 'top', horizontal: 'right' },
              transformOrigin: { vertical: 'bottom', horizontal: 'right' }
            }}
          />
          <IconButton size='small' onClick={handlePopupClose}>
            <Icon icon='tabler:trash' fontSize='1.25rem' />
          </IconButton>
        </Box>
      </Box>
    </Drawer>
  )
}

export default ComposePopup
