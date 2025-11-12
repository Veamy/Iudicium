// src/widgets/Navbar/Navbar.tsx
import { Navbar, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import './CustomNavbar.css'; 
import { LanguageSwitcher } from '../../components/LanguageSwitcher/LanguageSwitcher';

const CustomNavbar = () => {
  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="text-block">
          Iudicium
        </Navbar.Brand>
      </Container>

      <LanguageSwitcher />
    </Navbar>
  );
};

export default CustomNavbar;