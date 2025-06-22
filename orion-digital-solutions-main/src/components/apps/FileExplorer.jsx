import React, { useRef } from 'react';
import PropTypes from 'prop-types';

const FileExplorer = ({ onOpenImage }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (isImage || isVideo) {
      onOpenImage({
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file)
      });
    } else {
      alert('Hanya file gambar atau video yang didukung.');
    }
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  return (
    <div onClick={openFileDialog} style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      background: '#f5f5f5'
    }}>
      <input
        type="file"
        accept="image/*,video/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <div style={{ fontSize: '2rem' }}>📁</div>
      <p>Pilih file gambar / video</p>
    </div>
  );
};

FileExplorer.propTypes = {
  onOpenImage: PropTypes.func.isRequired
};

export default FileExplorer;
