import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import 'react-quill/dist/quill.snow.css';

const WordEditor = () => {
  const [editorHtml, setEditorHtml] = useState('');
  const quillRef = useRef(null);

  const handleExportDocx = async () => {
    const content = quillRef.current.getEditor().getText();

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: content,
                  font: 'Arial',
                  size: 24,
                }),
              ],
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'document.docx');
  };

  return (
    <div className="min-h-screen bg-[#1a1b1e] text-white p-6">
      <div className="bg-white rounded-md p-4 text-black">
        <ReactQuill
          ref={quillRef}
          value={editorHtml}
          onChange={setEditorHtml}
          placeholder="Start typing your document..."
          theme="snow"
        />
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleExportDocx}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Export as .docx
        </button>
      </div>
    </div>
  );
};

export default WordEditor;
