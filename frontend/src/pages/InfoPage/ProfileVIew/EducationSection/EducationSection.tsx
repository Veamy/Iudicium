import React from 'react';
import SectionHeader from '../../../../components/SrctionHeader/SectionHeader';


interface Education {
  years: string;
  degree: string;
  institution: string;
  specialization: string;
}

interface Certification {
  name: string;
  year?: string;
  institution?: string;
}

interface EducationSectionProps {
    education: Education[];
    certifications: (string | Certification)[];
    tp: (key: string) => string;
}

const EducationSection: React.FC<EducationSectionProps> = ({ education, certifications, tp }) => (
    <>
        <SectionHeader title={tp('educationTitle')} />
        {education.map((edu, index) => (
            <p key={index} style={{ margin: '5px 0' }}>
                <strong>{edu.degree}</strong> ({edu.years}) — {edu.institution}, {edu.specialization}
            </p>
        ))}
        {certifications.length > 0 && (
            <p>
                <strong>{tp('certifications')}:</strong>
                {certifications.map(c => 
                    typeof c === 'string' ? c : c.name
                ).join(', ')}
            </p>
        )}
    </>
);

export default EducationSection;