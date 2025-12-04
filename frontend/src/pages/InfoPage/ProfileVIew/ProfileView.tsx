import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import ProfileActions from './ProfileActions/ProfileActions';
import ProfileSummary from './ProfileSummary/ProfileSummary';
import CandidateDetails from './CandidateDatails/CandidateDetails';
import AnalysisScores from './AnalysisScores/AnalysisScores';
import GenerateQuestionsButton from "./GenerateQuestionsButton/GenerateQuestionsButton";
import InterviewQuestionsBlock from "./InterviewQuestionsBlock/InterviewQuestionsBlock";

import { API_ENDPOINTS, HOME_ROUTE } from "../../../env"; 

interface WorkExperience { years: string; company: string; industry: string; position: string; duration_years: string; responsibilities: string; }
interface Education { years: string; degree: string; institution: string; specialization: string; }
interface Certification { name: string; year?: string; institution?: string; }
interface CandidateProfile { 
    skills: string[]; 
    contacts: { [key: string]: string }; 
    education: Education[]; 
    full_name: string; 
    languages: string[]; 
    date_of_birth: string; 
    certifications: (string | Certification)[]; 
    additional_info: string; 
    work_experience: WorkExperience[]; 
}
export interface Evaluation { trust_score: number; integrity_score: number; overall_profile_index: number; leadership_maturity_score: number; relevance_to_position_score: number; }
export interface RiskAnalysis { notes: string; competency_mismatch: boolean; disciplinary_issues: boolean; conflict_of_interest: boolean; frequent_job_changes: boolean; }
export interface PositionRelevance { overall_score: number; experience_relevance: string; key_competencies_match: string; responsibility_level_match: string; }
export interface ProfileData { 
    candidate: CandidateProfile; 
    evaluation: Evaluation; 
    risk_analysis: RiskAnalysis; 
    position_relevance: PositionRelevance; 
    summary_conclusion: string; 
}
export interface FileData { 
    id: string; 
    file_name: string; 
    content_type: string; 
    file_size: number; 
    candidate_id: string; 
}
export interface UserData { 
    id: string; 
    profile: ProfileData; 
    files: FileData[]; 
    error_files?: any[]; 
    position_id?: string; 
}
interface PositionListApiItem { 
    id: string; 
    name: string; 
}
interface ProfileViewProps { 
    id: string; 
}

const styles = {
    container: {
        maxWidth: '1000px', 
        margin: 'var(--gap) auto', 
        padding: 'calc(var(--gap) * 2)', 
        fontFamily: 'var(--font)', 
        backgroundColor: 'var(--text-alt)', 
        borderRadius: 'var(--radius)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
    },
    debugPre: {
        backgroundColor: 'var(--text)', 
        color: 'var(--c6)',
        padding: 'var(--gap)', 
        borderRadius: 'var(--radius)', 
        overflowX: 'auto',
        fontSize: '0.8em'
    },
};


const ProfileView = ({ id }: ProfileViewProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [positionName, setPositionName] = useState<string | null>(null);
    const [positionsLoading, setPositionsLoading] = useState(false);
    const [interviewQuestions, setInterviewQuestions] = useState<string[]>([]);
    const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
    const [questionError, setQuestionError] = useState<string | null>(null);

    const tp = useCallback((key: string) => String(t(`ProfileView.${key}`)), [t]);

    const apiEndpoints = useMemo(() => ({
        GET_PROFILE: API_ENDPOINTS.CANDIDATE.GET_ONE(id),
        DELETE_PROFILE: API_ENDPOINTS.CANDIDATE.DELETE(id),
        GET_ALL_POSITIONS: API_ENDPOINTS.POSITION.GET_ALL,
        GET_QUESTIONS: API_ENDPOINTS.AI.GET_QUESTIONS(id),
    }), [id]);

    const { DELETE_PROFILE, GET_PROFILE, GET_ALL_POSITIONS, GET_QUESTIONS } = apiEndpoints;

    const handleGenerateSuccess = useCallback((questions: string[]) => {
        setInterviewQuestions(questions);
        setQuestionError(null);
        setIsGeneratingQuestions(false);
    }, []);

    const handleGenerateError = useCallback((message: string) => {
        setQuestionError(message);
        setInterviewQuestions([]);
        setIsGeneratingQuestions(false);
    }, []);
    
    const handleGenerateStart = useCallback(() => {
        setIsGeneratingQuestions(true);
    }, []);


    useEffect(() => {
        setLoading(true);
        fetch(GET_PROFILE, { method: 'GET', credentials: 'include' })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP ${response.status} - ${tp('errors.failedToLoad')}`);
            }
            return response.json();
          })
          .then((data: UserData) => {
            setUser(data);
            setLoading(false);
          })
          .catch((err) => {
            const errorMessage = err.message || tp('errors.unknownError');
            setError(errorMessage);
            setLoading(false);
          });
    }, [GET_PROFILE, tp]);


    useEffect(() => {
        if (user?.id && user.position_id) {
            setPositionsLoading(true);
            fetch(GET_ALL_POSITIONS, { method: 'GET', credentials: 'include' })
                .then(res => {
                    if (!res.ok) throw new Error("Failed to fetch positions list");
                    return res.json();
                })
                .then((data: PositionListApiItem[] | { items: PositionListApiItem[] }) => {
                    const list = Array.isArray(data) ? data : data.items || [];
                    const matchedPosition = list.find(p => p.id === user.position_id);
                    
                    setPositionName(matchedPosition ? matchedPosition.name : tp('positionNotFound'));
                })
                .catch(err => {
                    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                    setPositionName(`${tp('positionError')} (Деталі: ${errorMessage})`); 
                })
                .finally(() => {
                    setPositionsLoading(false);
                });
        } else if (user && !user.position_id) {
            setPositionName(tp('positionNotAssigned')); 
        }
    }, [user?.id, user?.position_id, GET_ALL_POSITIONS, tp]); 
  
    const isTotalLoading = loading || positionsLoading;

    const handleDelete = useCallback(async () => {
        const fullName = user?.profile.candidate.full_name || '';
        const confirmMessage = tp('confirmDelete').replace('{name}', fullName);

        if (!window.confirm(confirmMessage)) return;

        setIsDeleting(true);

        try {
            const response = await fetch(DELETE_PROFILE, { method: 'DELETE', credentials: 'include' });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText || tp('errors.failedToDelete')}`);
            }

            const successAlertMessage = tp('deleteSuccess').replace('{name}', fullName);
            alert(successAlertMessage);
            navigate(HOME_ROUTE);

        } catch (err) {
            const unknownDeleteError = tp('errors.unknownDeleteError');
            const errorMessage = (err instanceof Error) ? err.message : unknownDeleteError;
            setError(errorMessage);
            alert(`${tp('deleteErrorPrefix')}: ${errorMessage}`);
        } finally {
            setIsDeleting(false);
        }
    }, [user, DELETE_PROFILE, navigate, tp]);

    if (isTotalLoading) return <div style={{ color: 'var(--c1)', padding: '20px', textAlign: 'center' }}>{tp('loading')}</div>; 
    if (error) return <div style={{ color: 'var(--alert)', padding: '20px', border: '1px solid var(--alert)', margin: '20px', borderRadius: 'var(--radius)' }}>{tp('errorPrefix')}: {error}</div>;
    if (!user || !user.profile) return <div style={{ padding: '20px', color: 'var(--c6)' }}>{tp('notFound')}</div>;

    const { candidate, evaluation, risk_analysis, position_relevance, summary_conclusion } = user.profile;
    
    return (
        <div style={styles.container}>

            <ProfileActions 
                candidateFullName={candidate.full_name}
                candidateId={user.id}
                files={user.files}
                isDeleting={isDeleting}
                onDelete={handleDelete}
                tp={tp}
                
                isGeneratingQuestions={isGeneratingQuestions}
                onGenerateQuestions={handleGenerateSuccess}
                onGenerateError={handleGenerateError}
                onGenerateStart={handleGenerateStart}
            />

            <ProfileSummary 
                positionName={positionName}
                summaryConclusion={summary_conclusion}
                tp={tp}
            />

            <InterviewQuestionsBlock
                questions={interviewQuestions}
                error={questionError}
                tp={tp}
            />

            <CandidateDetails 
                profile={candidate} 
                tp={tp}
                t={t}
            />

            <AnalysisScores 
                evaluation={evaluation}
                riskAnalysis={risk_analysis}
                positionRelevance={position_relevance}
                tp={tp}
            />

            <details style={{ marginTop: 'calc(var(--gap) * 3)', borderTop: '1px solid var(--c6)', paddingTop: 'var(--gap)' }}>
                <summary style={{ cursor: 'pointer', color: 'var(--c1)', fontWeight: '600' }}>{tp('debugJson')}</summary>
                <pre >
                    {JSON.stringify(user, null, 2)}
                </pre>
            </details>
        </div>
    );
};

export default ProfileView;