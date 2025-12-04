import React from 'react';

interface ProfileSummaryProps {
    positionName: string | null;
    summaryConclusion: string;
    tp: (key: string) => string;
}

const styles = {
    positionBlock: {
        marginBottom: 'calc(var(--gap) * 2)', 
        padding: 'var(--gap)', 
        backgroundColor: 'var(--bg)', 
        borderRadius: 'var(--radius)', 
        borderLeft: '5px solid var(--c1)'
    },
    summaryBlock: {
        border: '1px solid var(--c1)', 
        padding: 'var(--gap)', 
        borderRadius: 'var(--radius)', 
        backgroundColor: 'var(--bg)', 
        marginBottom: 'calc(var(--gap) * 2)'
    }
};

const ProfileSummary: React.FC<ProfileSummaryProps> = ({ positionName, summaryConclusion, tp }) => {
    return (
        <>
            <div style={styles.positionBlock}>
                <strong>{tp('position')}:</strong> 
                <span style={{ 
                    color: positionName && positionName.includes('Error') ? 'var(--alert)' : 'var(--c1)', 
                    fontWeight: '600',
                    marginLeft: '8px'
                }}>
                    {positionName || tp('positionUnknown')}
                </span>
            </div>

            <div style={styles.summaryBlock}>
                <h4 style={{ color: 'var(--c1)', marginTop: '0', borderBottom: '1px solid var(--c6)', paddingBottom: '5px' }}>{tp('summaryTitle')}</h4>
                <p>{summaryConclusion}</p>
            </div>
        </>
    );
};

export default ProfileSummary;