import React from 'react';
import ExperienceItem from './ExperienceItem'; 
import SectionHeader from '../../../../components/SrctionHeader/SectionHeader';

// Визначаємо інтерфейс безпосередньо тут, щоб уникнути імпорту з ProfileView
interface WorkExperience {
  years: string;
  company: string;
  industry: string;
  position: string;
  duration_years: string;
  responsibilities: string;
}

interface ExperienceSectionProps {
    workExperience: WorkExperience[];
    t: (key: string) => string;
    tp: (key: string) => string;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ workExperience, t, tp }) => (
    <>
        <SectionHeader title={tp('experienceTitle')} />
        <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
            {workExperience.map((exp, index) => (
                <ExperienceItem key={index} item={exp} t={t} />
            ))}
        </ul>
    </>
);

export default ExperienceSection;