import React from 'react';


interface WorkExperience {
  years: string;
  company: string;
  industry: string;
  position: string;
  duration_years: string;
  responsibilities: string;
}

interface ExperienceItemProps {
    item: WorkExperience;
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({ item }) => (
    <li style={{ borderLeft: '3px solid #ccc', paddingLeft: '10px', marginBottom: '15px' }}>
        <p><strong>{item.position}</strong> ({item.years})</p>
        <p style={{ margin: '0 0 5px 0' }}>{item.company} | {item.duration_years} {t('ProfileView.yearsAbbreviation')}.</p>
        <p style={{ fontStyle: 'italic', fontSize: '0.9em' }}>{t('ProfileView.responsibilities')}: {item.responsibilities}</p>
    </li>
);

export default ExperienceItem;