import React from 'react';
import SectionHeader from '../../../../components/SrctionHeader/SectionHeader';

// Використовуємо той самий тип, що й у батьківському компоненті, щоб уникнути помилки сумісності
interface Contacts {
    [key: string]: string; // Інтерфейс відповідає: contacts: { [key: string]: string }
}

interface BasicCandidateProfile {
    date_of_birth: string;
    contacts: Contacts;
    additional_info: string;
}

interface BasicInfoSectionProps {
    profile: BasicCandidateProfile;
    tp: (key: string) => string;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ profile, tp }) => (
    <>
        <SectionHeader title={tp('basicInfo')} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <p><strong>{tp('birthDate')}:</strong> {profile.date_of_birth}</p>
            <p><strong>{tp('contacts')}:</strong> {profile.contacts.email}, {profile.contacts.phone}</p>
            <p><strong>{tp('location')}:</strong> {profile.contacts.location}</p>
            <p><strong>{tp('additionalInfo')}:</strong> {profile.additional_info}</p>
        </div>
    </>
);

export default BasicInfoSection;