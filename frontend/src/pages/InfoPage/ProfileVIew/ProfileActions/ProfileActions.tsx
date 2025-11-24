// ProfileActions.tsx
import React from 'react';
import ButtonC2 from '../../../../components/Buttons/ButtonC2/ButtonC2';
import ButtonDownloadFile from '../../../../components/Buttons/ButtonDownloadFile/ButtonDownloadFile';
import { type FileData } from '../ProfileView';

interface ProfileActionsProps {
    primaryFile: FileData | null;
    downloadUrl: string | undefined;
    isDeleting: boolean;
    handleDelete: () => void;
    tp: (key: string) => string;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({ primaryFile, downloadUrl, isDeleting, handleDelete, tp }) => (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '20px' }}>
        {primaryFile && (
            <ButtonDownloadFile
                title={`${tp('downloadCV')} (${primaryFile.file_name})`}
                sourceUrl={downloadUrl}
            />
        )}
        <ButtonC2
            text={isDeleting ? tp('deleting') : tp('deleteButton')}
            onClick={handleDelete}
            disabled={isDeleting}
        />
    </div>
);

export default ProfileActions;