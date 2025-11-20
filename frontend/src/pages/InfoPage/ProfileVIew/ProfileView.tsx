import React, { useState, useEffect } from "react";
import API_URL from "../../../env"; 

interface ProfileViewProps {
  id: string;
}

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

interface UserData {
  id: string;
  profile: ProfileData;
  files: Array<any>; 
}

// =================================================================
// ПІДКОМПОНЕНТИ ДЛЯ СТРУКТУРНОГО ВИВЕДЕННЯ
// =================================================================

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h3 style={{ borderBottom: '2px solid #007bff', paddingBottom: '5px', marginTop: '30px', color: '#007bff' }}>
    {title}
  </h3>
);

const ExperienceItem: React.FC<{ item: WorkExperience }> = ({ item }) => (
  <li style={{ borderLeft: '3px solid #ccc', paddingLeft: '10px', marginBottom: '15px' }}>
    <p><strong>{item.position}</strong> ({item.years})</p>
    <p style={{ margin: '0 0 5px 0' }}>{item.company} | {item.duration_years} р.</p>
    <p style={{ fontStyle: 'italic', fontSize: '0.9em' }}>Обов'язки: {item.responsibilities}</p>
  </li>
);

const ScoreBadge: React.FC<{ label: string; score: number }> = ({ label, score }) => (
  <div style={{ display: 'inline-block', padding: '5px 10px', margin: '5px', borderRadius: '4px', backgroundColor: score >= 8 ? '#d4edda' : score >= 6 ? '#fff3cd' : '#f8d7da' }}>
    <strong>{label}:</strong> {score}
  </div>
);

const ProfileView = ({ id }: ProfileViewProps) => {
  const [user, setUser] = useState<UserData | null>(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const API_ENDPOINT = API_URL.BACK_END_URL + '/candidate/get/' + id;

  useEffect(() => {
    fetch(API_ENDPOINT, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} - Невдала спроба завантаження`);
        }
        return response.json();
      })
      .then((data: UserData) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching user profile:', err);
        const errorMessage = err.message || 'Невідома помилка під час завантаження';
        setError(errorMessage);
        setLoading(false);
      });
  }, [id, API_ENDPOINT]);

  if (loading) return <div>Завантаження профілю...</div>;
  if (error) return <div style={{ color: 'red', padding: '20px' }}>Помилка: {error}</div>;

  if (!user || !user.profile) return <div style={{ padding: '20px' }}>Дані профілю не знайдені.</div>;

  const profile = user.profile.candidate;
  const evaluation = user.profile.evaluation;
  const risk = user.profile.risk_analysis;
  const relevance = user.profile.position_relevance;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#fff' }}>
      <h1>{profile.full_name}</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>ID кандидата: {user.id}</p>

      {/* Загальний висновок */}
      <div style={{ border: '1px solid #007bff', padding: '15px', borderRadius: '5px', backgroundColor: '#e9f7ff', marginBottom: '30px' }}>
        <h4 style={{ color: '#007bff', marginTop: '0' }}>Резюме та висновок</h4>
        <p>{user.profile.summary_conclusion}</p>
      </div>

      {/* Базова інформація */}
      <SectionHeader title="Основні дані" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        <p><strong>Дата народження:</strong> {profile.date_of_birth}</p>
        <p><strong>Контакти:</strong> {profile.contacts.email}, {profile.contacts.phone}</p>
        <p><strong>Локація:</strong> {profile.contacts.location}</p>
        <p><strong>Додатково:</strong> {profile.additional_info}</p>
      </div>

      {/* Навички */}
      <SectionHeader title="Навички (Skills)" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {profile.skills.map(skill => (
          <span key={skill} style={{ backgroundColor: '#f0f0f0', padding: '5px 10px', borderRadius: '15px', fontSize: '0.9em' }}>
            {skill}
          </span>
        ))}
      </div>

      {/* Досвід роботи */}
      <SectionHeader title="Досвід роботи" />
      <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
        {profile.work_experience.map((exp, index) => (
          <ExperienceItem key={index} item={exp} />
        ))}
      </ul>

      {/* Освіта та сертифікати */}
      <SectionHeader title="Освіта та Сертифікати" />
      {profile.education.map((edu, index) => (
        <p key={index} style={{ margin: '5px 0' }}>
          <strong>{edu.degree}</strong> ({edu.years}) — {edu.institution}, {edu.specialization}
        </p>
      ))}
      {profile.certifications.length > 0 && (
        <p><strong>Сертифікати:</strong> {profile.certifications.join(', ')}</p>
      )}

      {/* Аналіз та оцінка */}
      <SectionHeader title="Оцінка та Аналіз" />
      <div>
        <h4 style={{ marginBottom: '5px' }}>Ключові показники:</h4>
        <ScoreBadge label="Trust Score" score={evaluation.trust_score} />
        <ScoreBadge label="Integrity Score" score={evaluation.integrity_score} />
        <ScoreBadge label="Overall Index" score={evaluation.overall_profile_index} />
        <ScoreBadge label="Leadership" score={evaluation.leadership_maturity_score} />
        <ScoreBadge label="Relevance" score={evaluation.relevance_to_position_score} />
      </div>

      <div style={{ marginTop: '20px' }}>
        <h4 style={{ marginBottom: '5px' }}>Релевантність до Позиції:</h4>
        <p><strong>Загальний бал:</strong> {relevance.overall_score}/10</p>
        <p><strong>Релевантність досвіду:</strong> {relevance.experience_relevance}</p>
        <p><strong>Відповідність компетенцій:</strong> {relevance.key_competencies_match}</p>
        <p><strong>Відповідність рівню:</strong> {relevance.responsibility_level_match}</p>
      </div>

      {/* Аналіз ризиків */}
      <div style={{ marginTop: '20px', padding: '10px', border: risk.notes ? '1px dashed #dc3545' : '1px dashed #ccc' }}>
        <h4 style={{ color: risk.notes ? '#dc3545' : '#333', marginTop: '0' }}>Аналіз ризиків:</h4>
        {risk.notes && <p style={{ color: '#dc3545' }}>**УВАГА:** {risk.notes}</p>}
        <p>Часта зміна роботи: {risk.frequent_job_changes ? 'Так' : 'Ні'}</p>
        <p>Несумісність компетенцій: {risk.competency_mismatch ? 'Так' : 'Ні'}</p>
      </div>

      {/* Дебаг / Сирий JSON */}
      <details style={{ marginTop: '40px' }}>
        <summary style={{ cursor: 'pointer', color: '#007bff' }}>Сирі дані JSON (для дебагу)</summary>
        <pre style={{ backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '5px', overflowX: 'auto' }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default ProfileView;