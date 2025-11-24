import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../../env";
import ButtonC2 from "../../../components/Buttons/ButtonC2/ButtonC2";
import { useTranslation } from 'react-i18next';
// Припускаємо, що ButtonDownloadFile знаходиться у відносному шляху
import ButtonDownloadFile from "../../../components/Buttons/ButtonDownloadFile/ButtonDownloadFile"; 

const HOME_ROUTE = '/';

interface WorkExperience {
  years: string;
  company: string;
  industry: string;
  position: string;
  duration_years: string;
  responsibilities: string;
}

interface Education {
  years: string;
  degree: string;
  institution: string;
  specialization: string;
}

interface CandidateProfile {
  skills: string[];
  contacts: { [key: string]: string };
  education: Education[];
  full_name: string;
  languages: string[];
  date_of_birth: string;
  certifications: string[];
  additional_info: string;
  work_experience: WorkExperience[];
}

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

interface ProfileData {
  candidate: CandidateProfile;
  evaluation: Evaluation;
  risk_analysis: RiskAnalysis;
  position_relevance: PositionRelevance;
  summary_conclusion: string;
}

interface FileData { // Інтерфейс для файлів
  id: string;
  file_name: string;
  content_type: string;
  file_size: number;
  candidate_id: string;
}

interface UserData {
  id: string;
  profile: ProfileData;
  files: FileData[]; // Використовуємо новий інтерфейс
  error_files?: any[];
}

interface ProfileViewProps {
  id: string;
}

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h3 style={{ borderBottom: '2px solid #007bff', paddingBottom: '5px', marginTop: '30px', color: '#007bff' }}>
    {title}
  </h3>
);

const ExperienceItem: React.FC<{ item: WorkExperience, t: (key: string) => string }> = ({ item, t }) => (
  <li style={{ borderLeft: '3px solid #ccc', paddingLeft: '10px', marginBottom: '15px' }}>
    <p><strong>{item.position}</strong> ({item.years})</p>
    <p style={{ margin: '0 0 5px 0' }}>{item.company} | {item.duration_years} {t('ProfileView.yearsAbbreviation')}.</p>
    <p style={{ fontStyle: 'italic', fontSize: '0.9em' }}>{t('ProfileView.responsibilities')}: {item.responsibilities}</p>
  </li>
);

const ScoreBadge: React.FC<{ label: string; score: number }> = ({ label, score }) => (
  <div style={{ display: 'inline-block', padding: '5px 10px', margin: '5px', borderRadius: '4px', backgroundColor: score >= 8 ? '#d4edda' : score >= 6 ? '#fff3cd' : '#f8d7da' }}>
    <strong>{label}:</strong> {score}
  </div>
);

const ProfileView = ({ id }: ProfileViewProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const tp = (key: string) => String(t(`ProfileView.${key}`));

  const API_ENDPOINT = API_URL.BACK_END_URL + '/candidate/get/' + id;
  const DELETE_ENDPOINT = API_URL.BACK_END_URL + '/candidate/delete/' + id;
  const MINIO_DOWNLOAD_BASE = API_URL.BACK_END_URL + '/minio/download/'; // Базовий URL для скачування

  useEffect(() => {
    fetch(API_ENDPOINT, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} - ${String(t('ProfileView.errors.failedToLoad'))}`);
        }
        return response.json();
      })
      .then((data: UserData) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching user profile:', err);
        const errorMessage = err.message || String(t('ProfileView.errors.unknownError'));
        setError(errorMessage);
        setLoading(false);
      });
  }, [id, API_ENDPOINT, t]);

  const handleDelete = async () => {
    const confirmMessage = tp('confirmDelete').replace('{name}', user?.profile.candidate.full_name || '');

    if (!window.confirm(confirmMessage)) {
        return;
    }

    setIsDeleting(true);

    try {
        const response = await fetch(DELETE_ENDPOINT, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText || String(t('ProfileView.errors.failedToDelete'))}`);
        }

        const successAlertMessage = tp('deleteSuccess').replace('{name}', user?.profile.candidate.full_name || '');
        alert(successAlertMessage);
        navigate(HOME_ROUTE);

    } catch (err) {
        const unknownDeleteError = String(t('ProfileView.errors.unknownDeleteError'));
        const errorMessage = (err instanceof Error) ? err.message : unknownDeleteError;
        
        setError(errorMessage);
        alert(`${tp('deleteErrorPrefix')}: ${errorMessage}`);
        console.error('Error deleting profile:', err);
    } finally {
        setIsDeleting(false);
    }
  };

  if (loading) return <div>{tp('loading')}</div>;
  if (error) return <div style={{ color: 'red', padding: '20px' }}>{tp('errorPrefix')}: {error}</div>;

  if (!user || !user.profile) return <div style={{ padding: '20px' }}>{tp('notFound')}</div>;

  const profile = user.profile.candidate;
  const evaluation = user.profile.evaluation;
  const risk = user.profile.risk_analysis;
  const relevance = user.profile.position_relevance;

  // Отримання даних файлу (беремо перший файл з масиву)
  const primaryFile = user.files && user.files.length > 0 ? user.files[0] : null;
  const downloadUrl = primaryFile ? MINIO_DOWNLOAD_BASE + primaryFile.id : undefined;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#fff' }}>

      {/* Кнопки дій */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '20px' }}>
        
        {/* Кнопка скачування файлу */}
        {primaryFile && (
          <ButtonDownloadFile
            title={`${tp('downloadCV')} (${primaryFile.file_name})`}
            sourceUrl={downloadUrl}
          />
        )}
        
        {/* Кнопка видалення профілю */}
        <ButtonC2
          text={isDeleting ? tp('deleting') : tp('deleteButton')}
          onClick={handleDelete}
          disabled={isDeleting}
        />
      </div>

      <h1>{profile.full_name}</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>{tp('candidateId')}: {user.id}</p>

      {/* Загальний висновок */}
      <div style={{ border: '1px solid #007bff', padding: '15px', borderRadius: '5px', backgroundColor: '#e9f7ff', marginBottom: '30px' }}>
        <h4 style={{ color: '#007bff', marginTop: '0' }}>{tp('summaryTitle')}</h4>
        <p>{user.profile.summary_conclusion}</p>
      </div>

      {/* Базова інформація */}
      <SectionHeader title={tp('basicInfo')} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        <p><strong>{tp('birthDate')}:</strong> {profile.date_of_birth}</p>
        <p><strong>{tp('contacts')}:</strong> {profile.contacts.email}, {profile.contacts.phone}</p>
        <p><strong>{tp('location')}:</strong> {profile.contacts.location}</p>
        <p><strong>{tp('additionalInfo')}:</strong> {profile.additional_info}</p>
      </div>

      {/* Навички */}
      <SectionHeader title={tp('skillsTitle')} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {profile.skills.map(skill => (
          <span key={skill} style={{ backgroundColor: '#f0f0f0', padding: '5px 10px', borderRadius: '15px', fontSize: '0.9em' }}>
            {skill}
          </span>
        ))}
      </div>

      {/* Досвід роботи */}
      <SectionHeader title={tp('experienceTitle')} />
      <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
        {profile.work_experience.map((exp, index) => (
          <ExperienceItem key={index} item={exp} t={t} />
        ))}
      </ul>

      {/* Освіта та сертифікати */}
      <SectionHeader title={tp('educationTitle')} />
      {profile.education.map((edu, index) => (
        <p key={index} style={{ margin: '5px 0' }}>
          <strong>{edu.degree}</strong> ({edu.years}) — {edu.institution}, {edu.specialization}
        </p>
      ))}
  

      {/* Аналіз та оцінка */}
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

      {/* Аналіз ризиків */}
      <div style={{ marginTop: '20px', padding: '10px', border: risk.notes ? '1px dashed #dc3545' : '1px dashed #ccc' }}>
        <h4 style={{ color: risk.notes ? '#dc3545' : '#333', marginTop: '0' }}>{tp('riskTitle')}:</h4>
        {risk.notes && <p style={{ color: '#dc3545' }}>**{tp('risk.attention')}:** {risk.notes}</p>}
        <p>{tp('risk.frequentJobChanges')}: {risk.frequent_job_changes ? tp('risk.yes') : tp('risk.no')}</p>
        <p>{tp('risk.competencyMismatch')}: {risk.competency_mismatch ? tp('risk.yes') : tp('risk.no')}</p>
      </div>


      {/* Дебаг / Сирий JSON */}
      <details style={{ marginTop: '40px' }}>
        <summary style={{ cursor: 'pointer', color: '#007bff' }}>{tp('debugJson')}</summary>
        <pre style={{ backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '5px', overflowX: 'auto' }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default ProfileView; 