import { useParams } from 'react-router-dom';
import './InfoPageStyle.css';
import NewProfileCreateView from './NewProfileCreateView/NewProfileCreateView';
import NewPositionCreateView from './NewPositionCreateView/NewPositionCreateView';
import LeftBar from './LeftBar/LeftBar';
import ProfileView from './ProfileVIew/ProfileView';


export const InfoPage = () => {
  const { typeInfo, idInfo } = useParams<{ typeInfo: string; idInfo: string }>(); 

  function ChoiceView() {
    if (typeInfo === "profile") {
      if (idInfo === "create") {
        return <NewProfileCreateView />;
      }
      // Виправлено синтаксис передачі пропсів та додано перевірку на наявність idInfo
      if (idInfo) {
          return <ProfileView id={idInfo} />;
      }
    } else if (typeInfo === "position") {
      if (idInfo === "create") {
        return <NewPositionCreateView />;
      }
      if (idInfo) {
        return <p> Pivo ID: {idInfo}</p>;
      }
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