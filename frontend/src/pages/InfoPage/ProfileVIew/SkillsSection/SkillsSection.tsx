
import React from 'react';
import SectionHeader from '../../../../components/SrctionHeader/SectionHeader';

interface SkillsSectionProps {
    skills: string[];
    tp: (key: string) => string;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, tp }) => (
    <>
        <SectionHeader title={tp('skillsTitle')} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {skills.map(skill => (
                <span key={skill} style={{ backgroundColor: '#f0f0f0', padding: '5px 10px', borderRadius: '15px', fontSize: '0.9em' }}>
                    {skill}
                </span>
            ))}
        </div>
    </>
);

export default SkillsSection;