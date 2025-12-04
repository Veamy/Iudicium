import React, { useState, useCallback, useMemo } from 'react';
import ButtonC2 from '../../../../components/Buttons/ButtonC2/ButtonC2';
import ButtonDownloadFile from '../../../../components/Buttons/ButtonDownloadFile/ButtonDownloadFile';
import { API_ENDPOINTS } from "../../../../env"; 
import { type FileData } from '../ProfileView'; 

interface ProfileActionsProps {
    candidateFullName: string;
    candidateId: string;
    files: FileData[];
    isDeleting: boolean;
    onDelete: () => void;
    tp: (key: string) => string;
    isGeneratingQuestions: boolean; 
    onGenerateQuestions: (questions: string[]) => void;
    onGenerateError: (message: string) => void; 
    onGenerateStart: () => void;
}

const exportFormats = [
    { format: 'json', label: 'JSON' },
    { format: 'csv', label: 'CSV' },
    { format: 'word', label: 'Word (DOCX)' },
    { format: 'pdf', label: 'PDF' }
];

const ProfileActions: React.FC<ProfileActionsProps> = ({ 
    candidateFullName, 
    candidateId, 
    files, 
    isDeleting, 
    onDelete, 
    tp 
}) => {
    const [showExportOptions, setShowExportOptions] = useState(false);
    
    const primaryFile = files?.[0] || null;

    const downloadUrl = useMemo(() => 
        primaryFile ? API_ENDPOINTS.MINIO.DOWNLOAD(primaryFile.id) : undefined,
        [primaryFile]
    );

    const handleExport = useCallback((format: string) => {
        const fullUrl = API_ENDPOINTS.CANDIDATE.EXPORT(candidateId, format);
        
        const a = document.createElement('a');
        a.href = fullUrl;
        a.download = `${candidateFullName}_${candidateId}.${format}`; 
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        setShowExportOptions(false); 
    }, [candidateId, candidateFullName]);

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'calc(var(--gap) * 2)' }}>
            <div>
                <h1 style={{ color: 'var(--c1)', margin: 0 }}>{candidateFullName}</h1>
                <p style={{ color: 'var(--c6)', margin: '5px 0 0 0', fontWeight: '500' }}>{tp('candidateId')}: {candidateId}</p>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', position: 'relative' }}>
                
                <ButtonC2 
                    text={tp('exportButton')} 
                    onClick={() => setShowExportOptions(prev => !prev)}
                    disabled={isDeleting}
                />

                {showExportOptions && (
                    <div style={{ 
                        position: 'absolute', 
                        top: '100%', 
                        right: 0, 
                        zIndex: 10, 
                        backgroundColor: 'var(--text-alt)', 
                        border: '1px solid var(--c6)', 
                        borderRadius: 'var(--radius)', 
                        boxShadow: '0 8px 16px rgba(0,0,0,0.15)', 
                        marginTop: '5px', 
                        padding: '5px 0',
                        display: 'flex', 
                        flexDirection: 'column' 
                    }}>
                        {exportFormats.map(({ format, label }) => (
                            <button
                                key={format}
                                onClick={() => handleExport(format)}
                                style={{ 
                                    padding: '10px 20px', 
                                    border: 'none', 
                                    backgroundColor: 'transparent', 
                                    cursor: 'pointer', 
                                    textAlign: 'left',
                                    color: 'var(--text)',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg)'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                {tp('exportAs')} <strong style={{ color: 'var(--c1)' }}>{label}</strong>
                            </button>
                        ))}
                    </div>
                )}

                {primaryFile && downloadUrl && (
                    <ButtonDownloadFile 
                        title={`${tp('downloadCV')} (${primaryFile.file_name})`} 
                        sourceUrl={downloadUrl} 
                        style={{ textDecoration: 'none' }}
                    />
                )}
                
                <ButtonC2 
                    text={isDeleting ? tp('deleting') : tp('deleteButton')} 
                    onClick={onDelete} 
                    disabled={isDeleting} 
                />
            </div>
        </div>
    );
};

export default ProfileActions;