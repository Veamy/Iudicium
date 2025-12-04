

import React, { type FC, useCallback } from 'react';



import ButtonC2 from '../../../../components/Buttons/ButtonC2/ButtonC2';
import { API_ENDPOINTS } from '../../../../env';

interface GenerateQuestionsButtonProps {
    candidateId: string;
    isGenerating: boolean;
    isDisabled: boolean;
    onGenerate: (questions: string[]) => void;
    onError: (message: string) => void;
    tp: (key: string) => string;
}

const GenerateQuestionsButton: FC<GenerateQuestionsButtonProps> = ({ 
    candidateId, 
    isGenerating, 
    isDisabled,
    onGenerate, 
    onError, 
    tp 
}) => {

    const handleClick = useCallback(async () => {
        if (!candidateId || isGenerating || isDisabled) return;

        try {
            const endpoint = API_ENDPOINTS.AI.GET_QUESTIONS(candidateId);
            const response = await fetch(endpoint, { method: 'GET', credentials: 'include' });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: tp('errors.genericApiError') }));
                throw new Error(`HTTP ${response.status}: ${errorData.detail || errorData.msg || tp('errors.genericApiError')}`);
            }

            // API повертає рядок, але JSON-парсинг дасть нам масив рядків (якщо data: string[])
            const data = await response.json(); 
            
            // Перевірка, чи це коректний масив
            if (Array.isArray(data)) {
                onGenerate(data);
            } else if (typeof data === 'string' && data.startsWith('[')) {
                // Якщо API повернув JSON-масив, але з заголовком text/plain
                const parsedData = JSON.parse(data);
                if (Array.isArray(parsedData)) {
                    onGenerate(parsedData);
                } else {
                    throw new Error(tp('errors.invalidResponseFormat'));
                }
            } else {
                throw new Error(tp('errors.invalidResponseFormat'));
            }

        } catch (err) {
            const errorMessage = (err instanceof Error) ? err.message : tp('errors.unknownQuestionError');
            onError(errorMessage);
        }
    }, [candidateId, isGenerating, isDisabled, onGenerate, onError, tp]);


    return (
        <ButtonC2 
            text={isGenerating ? tp('generatingQuestions') : tp('generateQuestionsButton')}
            onClick={handleClick}
            disabled={isGenerating || isDisabled}
        />
    );
};

export default GenerateQuestionsButton;