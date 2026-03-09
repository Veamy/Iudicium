import React from "react";
import './HomeStyle.css';
import { useTranslation } from 'react-i18next';
import ButtonC1 from "../../components/Buttons/ButtonC1/ButtonC1";
import ButtonC2 from "../../components/Buttons/ButtonC2/ButtonC2";
import { ROUTES } from "../../ROUTES";


const HomePage = () => {
  const { t } = useTranslation();

  const guideButtonText = t('HomePage.guide-button-text') || "Дізнатися більше";
  const analyzeButtonText = t('HomePage.analyze-button-text') || "Аналізувати";

  return (
    <>


      <div className="MainBlock">
        <h1 className="logo-display">{t('HomePage.logo')}</h1>


        <div className="nav-block">
          <p className="text-block">{t('HomePage.slogan')}</p>

          <div className="buttons-group">
            <ButtonC2 text={guideButtonText} />
            <ButtonC1
              text={analyzeButtonText}
              to={ROUTES.PROFILE_CREATE} />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;