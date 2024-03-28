import React from 'react'

// import { Editor } from 'react-draft-wysiwyg'
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import dynamic from 'next/dynamic'

const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), { ssr: false })

const EditorControlled = ({ value, onChange }) => {
  // 에디터 상태를 관리하는 useState
  const [editorState, setEditorState] = React.useState(() => {
    if (value) {
      const contentState = convertFromRaw(JSON.parse(value))

      return EditorState.createWithContent(contentState)
    }

    return EditorState.createEmpty()
  })

  React.useEffect(() => {
    // 이 함수는 useEffect 내부에서만 사용되므로 여기에 정의합니다.
    const createEditorState = () => {
      if (value) {
        const contentState = convertFromRaw(JSON.parse(value))

        return EditorState.createWithContent(contentState)
      }

      return EditorState.createEmpty()
    }

    setEditorState(createEditorState())

    // 이제 'createEditorState' 함수는 의존성 문제를 일으키지 않습니다.
  }, [value]) // 'value'는 여전히 의존성 배열에 포함되어야 합니다.

  // 에디터의 상태 변경 시 호출되는 함수
  const onEditorStateChange = newEditorState => {
    setEditorState(newEditorState)
    const contentState = newEditorState.getCurrentContent()
    onChange(JSON.stringify(convertToRaw(contentState)))
  }

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={onEditorStateChange}
      wrapperClassName='demo-wrapper'
      editorClassName='demo-editor'
    />
  )
}

export default EditorControlled
