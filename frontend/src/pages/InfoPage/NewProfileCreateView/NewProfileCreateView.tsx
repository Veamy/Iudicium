// src/views/NewProfileCreateView/NewProfileCreateView.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadFileButton from '../../../components/UploadFileButton/UploadFileButton';
import UploadedFileListView from '../../../components/UploadedFileListView/UploadedFileListView';
import ROUTES from '../../../ROUTES';

// Тип відповіді від бекенда
interface ProfileResponse {
    id: string;
    profile: any; 
    files: any[];
}

const NewProfileCreateView = () => {
    const navigate = useNavigate();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [promptText, setPromptText] = useState('');
    const [isSending, setIsSending] = useState(false); // <--- ДОДАНО СТАН ДЛЯ ЗАВАНТАЖЕННЯ

    const handleFilesSelected = (newFiles: File[]) => {
        setSelectedFiles((prev) => {
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
        if (selectedFiles.length === 0) {
            alert('Будь ласка, виберіть хоча б один файл.');
            return;
        }

        setIsSending(true); // <--- ПОЧАТОК ЗАВАНТАЖЕННЯ

        const formData = new FormData();
        formData.append('prompt', promptText || 'Створити профіль кандидата на основі наданих документів.');
        
        selectedFiles.forEach((file) => {
          formData.append('file', file);
        });

        try {
          const response = await fetch('/api/v1/ai/generate', { 
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP ${response.status}: ${errorData.message || 'Не вдалося створити профіль.'}`);
          }
          
          const data: ProfileResponse = await response.json();

          if (data.id) {
            const newPath = `${ROUTES.INFO}/profile/${data.id}`; 
            navigate(newPath);
          } else {
             alert('Профіль створено, але ID відсутній у відповіді.');
             setSelectedFiles([]);
          }

        } catch (error) {
          console.error('Помилка завантаження файлів:', error);
          
          const errorMessage = (error instanceof Error) 
                               ? error.message 
                               : 'Невідома помилка під час завантаження файлів.';
          
          alert(`Сталася помилка під час завантаження файлів: ${errorMessage}`);
        } finally {
            setIsSending(false); // <--- КІНЕЦЬ ЗАВАНТАЖЕННЯ (незалежно від результату)
        }
    };

  return (
    <div className="new-profile-create-view" style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <h2>Create New Profile</h2>

      {/* Поле для prompt */}
      <div style={{ marginBottom: '20px' }}>
          <label htmlFor="prompt-input" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Текст запиту (Prompt):
          </label>
          <textarea
              id="prompt-input"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              rows={3}
              placeholder="Введіть будь-які додаткові інструкції для AI (наприклад: 'Зверни особливу увагу на досвід роботи з Python')."
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box', resize: 'vertical' }}
              disabled={isSending} // Вимикаємо поле під час завантаження
          />
      </div>

      {/* Upload Button */}
      <UploadFileButton
        onFilesSelected={handleFilesSelected}
        multiple
        accept="image/*,.pdf,.doc,.docx"
        className="upload-btn-primary" 
        disabled={isSending} // Вимикаємо кнопку під час завантаження
      >
        📎 Завантажити Файли (Резюме/CV)
      </UploadFileButton>

      <UploadedFileListView
        files={selectedFiles}/>

      {selectedFiles.length > 0 && (
        <div className="upload-actions" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setSelectedFiles([])} 
            className="btn-secondary"
            disabled={isSending} // Вимикаємо кнопку під час завантаження
          >
            Очистити все
          </button>
          <button
            onClick={sendFilesToServer}
            className="btn-primary"
            disabled={isSending} // <--- ВИМИКАЄМО КНОПКУ ПІД ЧАС ЗАВАНТАЖЕННЯ
            style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {/* ЗМІНЮЄМО ТЕКСТ КНОПКИ НА СПІНЕР/ІНДИКАТОР */}
            {isSending ? (
                <>
                    <span style={{ marginRight: '5px' }}>Створення...</span>
                    {/* Простий CSS спінер для прикладу */}
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{
                        display: 'inline-block',
                        width: '1em',
                        height: '1em',
                        verticalAlign: 'middle',
                        borderRadius: '50%',
                        border: '2px solid white',
                        borderRightColor: 'transparent',
                        animation: 'spin 1s linear infinite'
                    }} />
                    {/* CSS для спінера (потрібно додати до CSS-файлу):
                    @keyframes spin { 100% { transform: rotate(360deg); } }
                    */}
                </>
            ) : (
                'Створити Профіль'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default NewProfileCreateView;