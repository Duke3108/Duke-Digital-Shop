import { Editor } from '@tinymce/tinymce-react'
import React, { memo } from 'react'

const MarkdownEditer = ({ label, defaultValue, value, changeValue, name, invalidField, setInvalidField }) => {
    return (
        <div className='flex flex-col gap-2'>
            <span>{label}</span>
            <Editor
                apiKey='wjc71qaua1hu3gob0zthuggb55bxtmwqe8cr1ztlm95uzuzp'
                initialValue={value}
                defaultValue={defaultValue}
                init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                        'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                        'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
                    ],
                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                    tinycomments_mode: 'embedded',
                    tinycomments_author: 'Author name',
                    mergetags_list: [
                        { value: 'First.Name', title: 'First Name' },
                        { value: 'Email', title: 'Email' },
                    ],
                    ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                }}
                onFocus={() => setInvalidField && setInvalidField([])}
                onChange={(e) => changeValue(prev => ({ ...prev, [name]: e.target.getContent() }))}
            />
            {invalidField?.some(el => el.name === name) && <small className='text-sm text-main'>{invalidField?.find(el => el.name === name)?.mes}</small>}
        </div>
    )
}

export default memo(MarkdownEditer)
