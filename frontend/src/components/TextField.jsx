import React, { useState } from 'react'
import ReactQuill from 'react-quill';
import { Flex } from '@chakra-ui/react';
import 'react-quill/dist/quill.snow.css';
import './customQuillStyles.css';
import { bk1, bk2, btnScheme } from '../localVars';
const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ size: [] }],
        [{ font: [] }],
        [{ align: ["right", "center", "justify"] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        [{ color: ["red", "#785412"] }],
        [{ background: ["red", "#785412"] }]
    ]
};
const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "color",
    "image",
    "background",
    "align",
    "size",
    "font"
];

export default function TextField({ description, handleProcedureContentChange, placeholder }) {

    return (
        <ReactQuill
            theme="snow"
            style={{ height: '140px', width: '100%', color: '#fff' }}

            modules={modules}
            formats={formats}
            value={description}
            onChange={handleProcedureContentChange}
            placeholder={placeholder}
        />

    )
}
