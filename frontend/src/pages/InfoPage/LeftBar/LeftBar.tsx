import { useState } from "react";
import ItemList from "../../../components/ItemList/ItemList";
import ROUTES from "../../../ROUTES";
import ButtonC1 from "../../../components/Buttons/ButtonC1/ButtonC1";
import './LeftBarStyle.css'
import '../../../env'
import  API_URL from "../../../env";

const LeftBar = () => {
    const [activeTab, setActiveTab] = useState<'profile' | 'position'>('profile');

    return (
        <div className="chat-list-container">
            <div className="switcher-header">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`switcher-btn ${activeTab === 'profile' ? 'active' : ''}`}
                >
                    Profiles
                </button>

                <button
                    onClick={() => setActiveTab('position')}
                    className={`switcher-btn ${activeTab === 'position' ? 'active' : ''}`}
                >
                    Positions
                </button>
            </div>

            <div className="button-create-new-item">
                <ButtonC1 
                    text={activeTab === 'profile' ? 'Create New Profile' : 'Create New Position'}
                    to={
                        activeTab === 'profile'
                            ? `${ROUTES.INFO}/profile/create`
                            : `${ROUTES.INFO}/position/create`
                    }
                />
            </div>

            {activeTab === 'profile' && <ItemList sourceUrl={`${API_URL.BACK_END_URL}${API_URL.GET_LIST_PROFILE}`}  typeLink="profile" />}
            {activeTab === 'position' && <ItemList typeLink="position" />}
        </div>
    );
}

export default LeftBar;
