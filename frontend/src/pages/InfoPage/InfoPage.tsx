import { useParams } from 'react-router-dom';
import './InfoPageStyle.css'; // Припускаємо, що тут визначено chat-main-container
import NewProfileCreateView from './NewProfileCreateView/NewProfileCreateView';
import NewPositionCreateView from './NewPositionCreateView/NewPositionCreateView';
import LeftBar from './LeftBar/LeftBar';
import ProfileView from './ProfileVIew/ProfileView';
import PositionView from './PositionView/PositionView';


const CREATE = 'create';
const TYPE_PROFILE = 'profile';
const TYPE_POSITION = 'position';
const FALLBACK_MESSAGE = 'Unknown page – 404';

export const InfoPage = () => {
  const { typeInfo, idInfo } = useParams<{ typeInfo: string; idInfo: string }>(); 

  const renderView = () => {
    if (typeInfo === TYPE_PROFILE) {
      if (idInfo === CREATE) {
        return <NewProfileCreateView />;
      }
      if (idInfo) {
          return <ProfileView id={idInfo} />;
      }
    } 
    
    if (typeInfo === TYPE_POSITION) {
      if (idInfo === CREATE) {
        return <NewPositionCreateView />;
      }
      if (idInfo) {
        return <PositionView id={idInfo} />;
      }
    }
    
    return <></>;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg)', width: '100%' }}>
      <LeftBar /> 
      
      <div 
        className="chat-main-container" 
        style={{
            flexGrow: 1, 
            padding: 'calc(var(--gap) * 1.5)', 
            overflowY: 'auto',
            width: '100%'
        }}
      >
        <div key={`${typeInfo}-${idInfo}`} >
            {renderView()}
        </div>
      </div>
    </div>
  );
};

export default InfoPage;