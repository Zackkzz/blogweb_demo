'use client'

import { useEffect, useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder = 'Enter content...' }: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false)
  const editorRef = useRef<any>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleEditorChange = (content: string) => {
    onChange(content)
  }

  const handleImageUpload = async (blobInfo: any, progress: (percent: number) => void): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const formData = new FormData()
      formData.append('image', blobInfo.blob(), blobInfo.filename())
      
      const token = localStorage.getItem('token')
      
      const xhr = new XMLHttpRequest()
      xhr.withCredentials = false
      xhr.open('POST', '/api/upload')
      
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          progress((e.loaded / e.total) * 100)
        }
      }
      
      xhr.onload = () => {
        if (xhr.status === 403) {
          reject({ message: 'HTTP Error: ' + xhr.status, remove: true })
          return
        }
        
        if (xhr.status < 200 || xhr.status >= 300) {
          reject('HTTP Error: ' + xhr.status)
          return
        }
        
        const json = JSON.parse(xhr.responseText)
        
        if (!json || typeof json.url !== 'string') {
          reject('Invalid JSON: ' + xhr.responseText)
          return
        }
        
        resolve(json.url)
      }
      
      xhr.onerror = () => {
        reject('Image upload failed due to a XHR Transport error. Code: ' + xhr.status)
      }
      
      xhr.send(formData)
    })
  }

  if (!mounted) {
    return (
      <div className="h-[300px] border border-gray-300 rounded-md p-4 bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading editor...</p>
      </div>
    )
  }

  return (
    <div className="rich-text-editor">
      <Editor
        apiKey="298g8tc6xes9dv7qnqzfyrs7p0mphvdjyx8xtbejbg6u9lyp"
        onInit={(evt, editor) => {
          editorRef.current = editor
        }}
        value={value}
        onEditorChange={handleEditorChange}
        init={{
          height: 400,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help | link image',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px; color: black; }',
          placeholder: placeholder,
          images_upload_handler: handleImageUpload,
          automatic_uploads: true,
          file_picker_types: 'image',
          branding: false,
          promotion: false
        }}
      />
      <style jsx global>{`
        .rich-text-editor .tox-tinymce {
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
        }
        .rich-text-editor .tox .tox-edit-area__iframe {
          background-color: white;
          color: black;
        }
        .rich-text-editor .tox .tox-edit-area {
          background-color: white;
        }
      `}</style>
    </div>
  )
}
