
import { useState } from 'react';
import UploadFileButton from '../../../components/UploadFileButton/UploadFileButton';
import UploadedFileListView from '../../../components/UploadedFileListView/UploadedFileListView';

const NewProfileCreateView = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleFilesSelected = (newFiles: File[]) => {
        setSelectedFiles((prev) => {
        // Optional: deduplicate by name + size + lastModified
        const existing = new Set(prev.map(f => `${f.name}-${f.size}-${f.lastModified}`));
        const filtered = newFiles.filter(
            f => !existing.has(`${f.name}-${f.size}-${f.lastModified}`)
        );
        return [...prev, ...filtered];
        });
    };

    const handleRemoveFile = (indexToRemove: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== indexToRemove));
    };

    const sendFilesToServer = async () => {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append('files', file);
        });
        try {
          const response = await fetch('/api/profiles/create', {
            method: 'POST',
            body: formData,
          });
          if (response.ok) {
            alert('Profile created successfully!');
            setSelectedFiles([]);
          } else {
            alert('Failed to create profile.');
          }
        } catch (error) {
          console.error('Error uploading files:', error);
          alert('An error occurred while uploading files.');
        }
    };

  return (
    <div className="new-profile-create-view">
      <h2>Create New Profile</h2>

      {/* Upload Button */}
      <UploadFileButton
        onFilesSelected={handleFilesSelected}
        multiple
        accept="image/*,.pdf,.doc,.docx"
        className="upload-btn-primary" 
      >
        📎 Upload Files (Images, PDFs, Docs)
      </UploadFileButton>

      <UploadedFileListView
        files={selectedFiles}
      />

      {selectedFiles.length > 0 && (
        <div className="upload-actions">
          <button onClick={() => setSelectedFiles([])} className="btn-secondary">
            Clear All
          </button>
          <button
            onClick={sendFilesToServer}
            className="btn-primary"
          >
            Create Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default NewProfileCreateView;