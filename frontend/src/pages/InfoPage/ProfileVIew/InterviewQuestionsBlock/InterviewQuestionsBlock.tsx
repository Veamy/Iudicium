import React, { type FC } from 'react';

interface InterviewQuestionsBlockProps {
    questions: string[];
    error: string | null;
    tp: (key: string) => string;
}

const InterviewQuestionsBlock: FC<InterviewQuestionsBlockProps> = ({ questions, error, tp }) => {
    
    const showBlock = questions.length > 0 || error;
    
    if (!showBlock) return null;

    return (
        <div style={{ marginBottom: 'calc(var(--gap) * 2)', padding: 'var(--gap)', backgroundColor: 'var(--bg)', borderRadius: 'var(--radius)', borderLeft: '5px solid var(--c3)' }}>
            <h4 style={{ color: 'var(--c3)', marginTop: '0', borderBottom: '1px solid var(--c6)', paddingBottom: '5px' }}>
                {tp('interviewQuestionsTitle')}
            </h4>
            
            {error ? (
                <p style={{ color: 'var(--alert)', fontWeight: '500' }}>
                    {tp('errors.questionsLoadError')}: {error}
                </p>
            ) : (
                <ol style={{ paddingLeft: '20px', marginTop: '10px' }}>
                    {questions.map((q, index) => (
                        <li key={index} style={{ marginBottom: '10px', color: 'var(--text)' }}>
                            {q}
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
};

export default InterviewQuestionsBlock;