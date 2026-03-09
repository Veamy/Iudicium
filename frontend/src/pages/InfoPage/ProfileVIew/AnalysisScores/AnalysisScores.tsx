import React from 'react';
import type {  Evaluation, RiskAnalysis, PositionRelevance } from '../ProfileView'; 

interface AnalysisScoresProps {
    evaluation: Evaluation;
    riskAnalysis: RiskAnalysis;
    positionRelevance: PositionRelevance;
    tp: (key: string) => string;
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
    relevanceBlock: {
        marginTop: 'calc(var(--gap) * 2)', 
        padding: 'var(--gap)', 
        backgroundColor: 'var(--bg)',
        borderRadius: 'var(--radius)',
        borderLeft: '5px solid var(--c2)'
    }
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <h3 style={styles.header}>{title}</h3>
);

const getScoreColors = (score: number) => {
    if (score >= 8) return { bgColor: 'var(--c4)', textColor: 'var(--text-alt)' }; 
    if (score >= 6) return { bgColor: 'var(--c6)', textColor: 'var(--text)' }; 
    return { bgColor: 'var(--alert)', textColor: 'var(--text-alt)' }; 
};

const ScoreBadge: React.FC<{ label: string; score: number }> = ({ label, score }) => {
    const { bgColor, textColor } = getScoreColors(score);

    const badgeStyle = { 
        display: 'inline-block', 
        padding: '8px 15px', 
        margin: '5px', 
        borderRadius: 'var(--radius)', 
        backgroundColor: bgColor,
        color: textColor,
        fontWeight: '600',
        transition: 'background-color 0.3s'
    };

    return (
        <div style={badgeStyle}>
            {label}: <span style={{ fontWeight: '700' }}>{score}</span>
        </div>
    );
};

// --- ОСНОВНИЙ КОМПОНЕНТ АНАЛІЗУ ---

const AnalysisScores: React.FC<AnalysisScoresProps> = ({ evaluation, riskAnalysis: risk, positionRelevance: relevance, tp }) => {
    
    const isRiskAlert = !!risk.notes || risk.frequent_job_changes || risk.competency_mismatch;
    
    const riskBlockStyle = {
        marginTop: 'calc(var(--gap) * 2)', 
        padding: 'var(--gap)', 
        borderRadius: 'var(--radius)',
        border: isRiskAlert ? '2px solid var(--alert)' : '1px solid var(--c6)',
        backgroundColor: isRiskAlert ? 'rgba(250, 45, 45, 0.05)' : 'transparent',
    };

    return (
        <>
            <SectionHeader title={tp('analysisTitle')} />
            <div>
                <h4 style={{ marginBottom: 'var(--gap)', color: 'var(--c1)' }}>{tp('keyIndicators')}:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--gap)' }}>
                    <ScoreBadge label={tp('labels.trust')} score={evaluation.trust_score} />
                    <ScoreBadge label={tp('labels.integrity')} score={evaluation.integrity_score} />
                    <ScoreBadge label={tp('labels.overall')} score={evaluation.overall_profile_index} />
                    <ScoreBadge label={tp('labels.leadership')} score={evaluation.leadership_maturity_score} />
                    <ScoreBadge label={tp('labels.relevance')} score={evaluation.relevance_to_position_score} />
                </div>
            </div>

            <div style={styles.relevanceBlock}>
                <h4 style={{ marginBottom: '5px', color: 'var(--c2)' }}>{tp('relevanceTitle')}:</h4>
                <p><strong>{tp('relevance.overallScore')}:</strong> <span style={{ color: 'var(--c1)', fontWeight: '600' }}>{relevance.overall_score}/10</span></p>
                <p><strong>{tp('relevance.experience')}:</strong> {relevance.experience_relevance}</p>
                <p><strong>{tp('relevance.competencies')}:</strong> {relevance.key_competencies_match}</p>
                <p><strong>{tp('relevance.level')}:</strong> {relevance.responsibility_level_match}</p>
            </div>

            <div style={riskBlockStyle}>
                <h4 style={{ color: isRiskAlert ? 'var(--alert)' : 'var(--text)', marginTop: '0' }}>{tp('riskTitle')}:</h4>
                {risk.notes && <p style={{ color: 'var(--alert)', fontWeight: '600' }}>**{tp('risk.attention')}:** {risk.notes}</p>}
                <p><strong>{tp('risk.frequentJobChanges')}:</strong> <span style={{ color: risk.frequent_job_changes ? 'var(--alert)' : 'var(--c4)' }}>{risk.frequent_job_changes ? tp('risk.yes') : tp('risk.no')}</span></p>
                <p><strong>{tp('risk.competencyMismatch')}:</strong> <span style={{ color: risk.competency_mismatch ? 'var(--alert)' : 'var(--c4)' }}>{risk.competency_mismatch ? tp('risk.yes') : tp('risk.no')}</span></p>
            </div>
        </>
    );
};

export default AnalysisScores;