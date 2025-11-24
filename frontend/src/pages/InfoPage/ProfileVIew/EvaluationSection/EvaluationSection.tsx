import React from 'react';
import ScoreBadge from './ScoreBadge'; 
import SectionHeader from '../../../../components/SrctionHeader/SectionHeader';

interface Evaluation {
  trust_score: number;
  integrity_score: number;
  overall_profile_index: number;
  leadership_maturity_score: number;
  relevance_to_position_score: number;
}

interface RiskAnalysis {
  notes: string;
  competency_mismatch: boolean;
  disciplinary_issues: boolean;
  conflict_of_interest: boolean;
  frequent_job_changes: boolean;
}

interface PositionRelevance {
  overall_score: number;
  experience_relevance: string;
  key_competencies_match: string;
  responsibility_level_match: string;
}

interface EvaluationSectionProps {
    evaluation: Evaluation;
    risk: RiskAnalysis;
    relevance: PositionRelevance;
    tp: (key: string) => string;
}

const EvaluationSection: React.FC<EvaluationSectionProps> = ({ evaluation, risk, relevance, tp }) => (
    <>
        <SectionHeader title={tp('analysisTitle')} />
        <div>
            <h4 style={{ marginBottom: '5px' }}>{tp('keyIndicators')}:</h4>
            <ScoreBadge label={tp('labels.trust')} score={evaluation.trust_score} />
            <ScoreBadge label={tp('labels.integrity')} score={evaluation.integrity_score} />
            <ScoreBadge label={tp('labels.overall')} score={evaluation.overall_profile_index} />
            <ScoreBadge label={tp('labels.leadership')} score={evaluation.leadership_maturity_score} />
            <ScoreBadge label={tp('labels.relevance')} score={evaluation.relevance_to_position_score} />
        </div>

        <div style={{ marginTop: '20px' }}>
            <h4 style={{ marginBottom: '5px' }}>{tp('relevanceTitle')}:</h4>
            <p><strong>{tp('relevance.overallScore')}:</strong> {relevance.overall_score}/10</p>
            <p><strong>{tp('relevance.experience')}:</strong> {relevance.experience_relevance}</p>
            <p><strong>{tp('relevance.competencies')}:</strong> {relevance.key_competencies_match}</p>
            <p><strong>{tp('relevance.level')}:</strong> {relevance.responsibility_level_match}</p>
        </div>

        <div style={{ marginTop: '20px', padding: '10px', border: risk.notes ? '1px dashed #dc3545' : '1px dashed #ccc' }}>
            <h4 style={{ color: risk.notes ? '#dc3545' : '#333', marginTop: '0' }}>{tp('riskTitle')}:</h4>
            {risk.notes && <p style={{ color: '#dc3545' }}>**{tp('risk.attention')}:** {risk.notes}</p>}
            <p>{tp('risk.frequentJobChanges')}: {risk.frequent_job_changes ? tp('risk.yes') : tp('risk.no')}</p>
            <p>{tp('risk.competencyMismatch')}: {risk.competency_mismatch ? tp('risk.yes') : tp('risk.no')}</p>
        </div>
    </>
);

export default EvaluationSection;