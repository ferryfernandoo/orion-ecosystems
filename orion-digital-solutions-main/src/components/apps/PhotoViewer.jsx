import React, { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const PhotoViewer = ({ externalFile }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // Kalau ada file dari luar (FileExplorer), langsung tampilkan
  useEffect(() => {
    if (externalFile) {
      setFile(externalFile);
      setPreviewUrl(externalFile.url || URL.createObjectURL(externalFile));
    }
  }, [externalFile]);

  const handleFile = (selectedFile) => {
    if (selectedFile && (selectedFile.type.startsWith('image/') || selectedFile.type.startsWith('video/'))) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFile(selectedFile);
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={openFileDialog}
      style={{
        padding: '1rem',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '2px dashed #ccc',
        borderRadius: '8px',
        backgroundColor: '#fdfdfd',
        cursor: 'pointer'
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
      />

      <div
        style={{
          marginBottom: '1rem',
          padding: '0.5rem',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          textAlign: 'center',
        }}
      >
        {file ? file.name : 'Click or drag a photo/video file here'}
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f9f9f9',
          border: '1px solid #eee',
          borderRadius: '4px',
        }}
      >
        {previewUrl ? (
          file.type.startsWith('image/') ? (
            <img
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
          ) : (
            <video
              src={previewUrl}
              controls
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
          )
        ) : (
          <div style={{ fontSize: '2rem', color: '#999' }}>🖼️📁 Click or Drop to Open</div>
        )}
      </div>
    </div>
  );
};

PhotoViewer.propTypes = {
  externalFile: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    url: PropTypes.string
  })
};

export default PhotoViewer;
