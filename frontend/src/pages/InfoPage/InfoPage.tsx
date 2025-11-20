import { useParams } from 'react-router-dom';
import './InfoPageStyle.css';
import NewProfileCreateView from './NewProfileCreateView/NewProfileCreateView';
import NewPositionCreateView from './NewPositionCreateView/NewPositionCreateView';
import LeftBar from './LeftBar/LeftBar';

// ⚠️ НЕ ЗАБУДЬ ІМПОРТУВАТИ ЦІ КОМПОНЕНТИ, ЯКЩО ЇХ ЩЕ НЕМАЄ:
// import ProfileDetailView from './ProfileDetailView/ProfileDetailView';
// import PositionDetailView from './PositionDetailView/PositionDetailView';

export const InfoPage = () => {
  // 1. Деструктуризація (як ти і зробив)
  const { typeInfo, idInfo } = useParams(); 

  function ChoiceView() {
    if (typeInfo === "profile") {
      if (idInfo !== "create") {
        // ⚠️ Перевір, що idInfo існує, або оброби ситуацію, коли він undefined
        return <p> Pivo</p>;
      }
      return <NewProfileCreateView />;
    } else if (typeInfo === "position") {
      if (idInfo !== "create") {
        return <p> Pivo</p>;
      }
      return <NewPositionCreateView />;
    }
    return <h1>Unknown page – 404</h1>;
  }

  return (
    <div>
      <LeftBar /> 
      <div className="chat-main-container">

        <div key={`${typeInfo}-${idInfo}`}>
            {ChoiceView()}
        </div>
      </div>
    </div>
  );
};

export default InfoPage;