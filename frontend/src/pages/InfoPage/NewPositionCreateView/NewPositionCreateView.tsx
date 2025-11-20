// src/views/NewPositionCreateView.tsx
import { useState, useCallback } from 'react';
import PositionParameterFormView from '../../../components/PositionParameterFormView/PositionParameterFormView';
import { type PositionParameter } from '../../../types/PositionParameter';
import { type Position } from '../../../types/Position';
import { useTranslation } from 'react-i18next';

interface NewPositionCreateViewProps {
  onCancel?: () => void;
}

const STORAGE_KEY = 'positions_data'; 

const NewPositionCreateView: React.FC<NewPositionCreateViewProps> = ({ onCancel }) => {
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [parameters, setParameters] = useState<PositionParameter[]>([]);
  const [nameError, setNameError] = useState('');
  const [parametersError, setParametersError] = useState('');
  const [parameterErrors, setParameterErrors] = useState<string[]>([]);

  const handleAddParameter = useCallback(() => {
    setParameters((prev) => [...prev, { title: '', description: '', point: 0 }]);
    setParameterErrors((prev) => [...prev, '']);
  }, []);

  const handleRemoveParameter = useCallback((index: number) => {
    setParameters((prev) => prev.filter((_, i) => i !== index));
    setParameterErrors((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleParameterChange = useCallback(
    (index: number, updated: PositionParameter) => {
      setParameters((prev) => prev.map((p, i) => (i === index ? updated : p)));

      let error = '';
      if (!updated.title.trim()) {
        error = t('NewPositionCreateView.errors.titleRequired');
      } else if (updated.point < 0) {
        error = t('NewPositionCreateView.errors.pointsNonNegative');
      }
      setParameterErrors((prev) => {
        const next = [...prev];
        next[index] = error;
        return next;
      });
    },
    [t]
  );

  const validate = useCallback((): boolean => {
    let isValid = true;

    if (!name.trim()) {
      setNameError(t('NewPositionCreateView.errors.nameRequired'));
      isValid = false;
    } else if (name.length > 100) {
      setNameError(t('NewPositionCreateView.errors.nameMaxLength'));
      isValid = false;
    } else {
      setNameError('');
    }

    if (parameters.length === 0) {
      setParametersError(t('NewPositionCreateView.errors.atLeastOneParameter'));
      isValid = false;
    } else {
      setParametersError('');
    }

    const newParamErrors = parameters.map((p) => {
      if (!p.title.trim()) return t('NewPositionCreateView.errors.titleRequired');
      if (p.point < 0) return t('NewPositionCreateView.errors.pointsNonNegative');
      return '';
    });
    setParameterErrors(newParamErrors);

    if (newParamErrors.some((e) => e !== '')) isValid = false;

    return isValid;
  }, [name, parameters, t]);

  const saveToJsonFile = (position: Position) => {
    // Завантажуємо існуючі дані (якщо є)
    let existing: Position[] = [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) existing = JSON.parse(saved);
      if (!Array.isArray(existing)) existing = [];
    } catch {
      existing = [];
    }

    // Додаємо нову позицію
    const updatedData = [...existing, { ...position, id: Date.now(), createdAt: new Date().toISOString() }];

    // Зберігаємо назад у localStorage (для майбутніх сесій)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData, null, 2));
    } catch (e) {
      console.warn('Не вдалося зберегти в localStorage (можливо, переповнено)');
    }

    // Створюємо та завантажуємо файл — безпечно додамо елемент в DOM і скасуємо URL трохи пізніше
    const dataStr = JSON.stringify(updatedData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `positions_${new Date().toISOString().slice(0, 10)}.json`;
    // some browsers require the link to be in the document
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();

    // Remove anchor and revoke URL after a short delay to ensure the download starts
    setTimeout(() => {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {
        // ignore
      }
      if (a.parentNode) a.parentNode.removeChild(a);
    }, 150);
  };

  const handleSubmit = useCallback(() => {
    if (!validate()) return;

    const position: Position = {
      name: name.trim(),
      parameters: parameters.map((p) => ({
        title: p.title.trim(),
        description: p.description?.trim() ?? '',
        point: p.point,
      })),
    };

    saveToJsonFile(position);

    // Опціонально: скидаємо форму після збереження
    setName('');
    setParameters([]);
    setParameterErrors([]);
    setNameError('');
    setParametersError('');

    // show a non-blocking success message instead of alert (alerts can interfere with focus/navigation)
    setSuccessMessage(t('NewPositionCreateView.success.saved'));
    setTimeout(() => setSuccessMessage(''), 3000);
  }, [name, parameters, validate, t]);

  const [successMessage, setSuccessMessage] = useState('');

  const tp = (key: string) => t(`NewPositionCreateView.${key}`);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h2>{tp('title')}</h2>

      {/* === Назва позиції === */}
      <section style={{ marginBottom: 32 }}>
        <h3>{tp('basicInfo')}</h3>
        <label>
          {tp('positionName')} <br />
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError('');
            }}
            maxLength={100}
            style={{ width: '100%', padding: 8, fontSize: 16 }}
          />
          {nameError && <div style={{ color: 'red' }}>{nameError}</div>}
          <small>
            {name.length}/100 {t('NewPositionCreateView.characters', { count: name.length })}
          </small>
        </label>
      </section>

      {/* === Параметри === */}
      <section style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3>{tp('parameters')}</h3>
          <button type="button" onClick={handleAddParameter}>
            {tp('addParameter')}
          </button>
        </div>

        {parametersError && <div style={{ color: 'red' }}>{parametersError}</div>}

        {parameters.length === 0 ? (
          <p>{tp('noParameters')}</p>
        ) : (
          parameters.map((param, index) => (
            <div key={index} style={{ marginBottom: 24 }}>
              <PositionParameterFormView
                parameter={param}
                onChange={(updated) => handleParameterChange(index, updated)}
                onRemove={() => handleRemoveParameter(index)}
                index={index + 1}
              />
              {parameterErrors[index] && (
                <div style={{ color: 'red', marginTop: 4 }}>{parameterErrors[index]}</div>
              )}
            </div>
          ))
        )}
      </section>

      {/* === Кнопки === */}
      <div style={{ marginTop: 40 }}>
        <button onClick={handleSubmit} style={{ marginRight: 16, padding: '12px 24px', fontSize: 16 }}>
          {tp('createPosition')}
        </button>
        {onCancel && (
          <button onClick={onCancel} style={{ padding: '12px 24px' }}>
            {tp('cancel')}
          </button>
        )}
      </div>

      {successMessage && (
        <div style={{ color: 'green', marginTop: 12 }}>{successMessage}</div>
      )}

      {/* === Дебаг === */}
      <details style={{ marginTop: 40 }}>
        <summary>{tp('debugJson')}</summary>
        <pre>{JSON.stringify({ name, parameters }, null, 2)}</pre>
      </details>
    </div>
  );
};

export default NewPositionCreateView;