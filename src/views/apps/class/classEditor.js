import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'

const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), { ssr: false })

const EditorControlled = ({ value, onChange }) => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())

  useEffect(() => {
    // 변환된 contentState가 현재 editorState와 다를 때만 업데이트
    const contentState = editorState.getCurrentContent()
    const rawContentState = JSON.stringify(convertToRaw(contentState))

    if (value !== rawContentState) {
      const newContentState = value ? convertFromRaw(JSON.parse(value)) : null
      if (newContentState) {
        const newEditorState = EditorState.createWithContent(newContentState)
        setEditorState(newEditorState)
      } else {
        setEditorState(EditorState.createEmpty())
      }
    }
  }, [value])

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
