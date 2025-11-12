import React from "react";
import './HomeStyle.css';
import { useTranslation } from 'react-i18next';

const HomePageEn = () => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="MainBlock"
      style={{backgroundImage : "url(/img/homeIlustration.jpeg)" }}>
      <p className="text-block">
        {t('welcome')}
      </p>
      </div>
    </div>
  );
};

export default HomePageEn;
