import React from 'react';
import { useTranslation } from 'react-i18next';
import { type CandidateProfile } from '../ProfileView'; 

interface CandidateDetailsProps {
    profile: CandidateProfile;
    tp: (key: string) => string;
    t: ReturnType<typeof useTranslation>['t'];
}

// --- СТИЛІ та ДОПОМІЖНІ КОМПОНЕНТИ ---
const styles = {
    header: {
        borderBottom: '2px solid var(--c1)', 
        paddingBottom: 'var(--gap)', 
        marginTop: 'calc(var(--gap) * 2)', 
        marginBottom: 'var(--gap)',
        color: 'var(--text)'
    },
    skillBadge: {
        backgroundColor: 'var(--c6)', 
        color: 'var(--text)',
        padding: '6px 12px', 
        borderRadius: '20px', 
        fontSize: '0.85em',
        fontWeight: '500' 
    },
    experienceLine: {
        borderLeft: '3px solid var(--c6)', 
        paddingLeft: 'var(--gap)', 
        marginBottom: 'var(--gap)',
        position: 'relative' as 'relative'
    },
    experienceDot: {
        position: 'absolute' as 'absolute',
        left: '-7px',
        top: '0',
        width: '12px',
        height: '12px',
        backgroundColor: 'var(--c1)',
        borderRadius: '50%',
        boxShadow: '0 0 0 3px var(--bg)'
    },
    educationLine: {
        margin: '8px 0', 
        borderLeft: '4px solid var(--c2)', 
        paddingLeft: '10px'
    }
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <h3 style={styles.header}>{title}</h3>
);

const ExperienceItem: React.FC<{ item: CandidateProfile['work_experience'][0], t: (key: string) => string }> = ({ item, t }) => (
    <li style={styles.experienceLine}>
        <div style={styles.experienceDot}></div>
        <p style={{ margin: 0 }}><strong>{item.position}</strong> ({item.years})</p>
        <p style={{ margin: '3px 0 5px 0', color: 'var(--c1)', fontWeight: '500' }}>
            {item.company} | {item.duration_years} {t('ProfileView.yearsAbbreviation')}.
        </p>
        <p style={{ fontStyle: 'italic', fontSize: '0.9em', color: '#555' }}>
            {t('ProfileView.responsibilities')}: {item.responsibilities}
        </p>
    </li>
);

// --- ОСНОВНИЙ КОМПОНЕНТ ДЕТАЛЕЙ ---

const CandidateDetails: React.FC<CandidateDetailsProps> = ({ profile, tp, t }) => {
    return (
        <>
            <SectionHeader title={tp('basicInfo')} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'calc(var(--gap) * 2)' }}>
                <p><strong>{tp('birthDate')}:</strong> {profile.date_of_birth}</p>
                <p><strong>{tp('contacts')}:</strong> {profile.contacts.email} | {profile.contacts.phone}</p>
                <p><strong>{tp('location')}:</strong> {profile.contacts.location}</p>
                <p><strong>{tp('additionalInfo')}:</strong> {profile.additional_info}</p>
            </div>

            <SectionHeader title={tp('skillsTitle')} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: 'var(--gap)' }}>
                {profile.skills.map(skill => (
                    <span key={skill} style={styles.skillBadge}>{skill}</span>
                ))}
            </div>

            <SectionHeader title={tp('experienceTitle')} />
            <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                {profile.work_experience.map((exp, index) => (<ExperienceItem key={index} item={exp} t={t} />))}
            </ul>

            <SectionHeader title={tp('educationTitle')} />
            {profile.education.map((edu, index) => (
                <p key={index} style={styles.educationLine}>
                    <strong style={{ color: 'var(--c1)' }}>{edu.degree}</strong> ({edu.years}) <br /> 
                    <span style={{ fontSize: '0.95em' }}>{edu.institution}, {edu.specialization}</span>
                </p>
            ))}
            {profile.certifications.length > 0 && (
                <p style={{ marginTop: 'var(--gap)', borderTop: '1px solid var(--c6)', paddingTop: 'var(--gap)' }}>
                    <strong style={{ color: 'var(--c3)' }}>{tp('certifications')}:</strong> 
                    {profile.certifications.map(c => typeof c === 'string' ? c : c.name).join(', ')}
                </p>
            )}
        </>
    );
};

export default CandidateDetails;