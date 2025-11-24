import { useParams } from 'react-router-dom';
import './InfoPageStyle.css';
import NewProfileCreateView from './NewProfileCreateView/NewProfileCreateView';
import NewPositionCreateView from './NewPositionCreateView/NewPositionCreateView';
import LeftBar from './LeftBar/LeftBar';
import ProfileView from './ProfileVIew/ProfileView';
import PositionView from './PositionView/PositionView'

export const InfoPage = () => {
  const { typeInfo, idInfo } = useParams<{ typeInfo: string; idInfo: string }>(); 

  function ChoiceView() {
    if (typeInfo === "profile") {
      if (idInfo === "create") {
        return <NewProfileCreateView />;
      }
      if (idInfo) {
          return <ProfileView id={idInfo} />;
      }
    } else if (typeInfo === "position") {
      if (idInfo === "create") {
        return <NewPositionCreateView />;
      }
      if (idInfo) {
        return <PositionView id={idInfo} />;
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