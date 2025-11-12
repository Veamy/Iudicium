import AppRoutes from './AppRoutes';
import CustomNavbar from './widgets/CustomNavbar/CustomNavbar';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <>
      <CustomNavbar/>
      <main style={{ minHeight: 'calc(100vh - 70px)' }}>
        <AppRoutes />
      </main>
    </>
  );
}

export default App;