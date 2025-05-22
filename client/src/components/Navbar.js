// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import '../styles/Navbar.css';

// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
  
//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };
  
//   return (
//     <nav className="navbar">
//       <div className="navbar-container">
//         <Link to="/" className="navbar-logo">
//           DevOnboard
//         </Link>
        
//         <ul className="nav-menu">
//           {user ? (
//             <>
//               <li className="nav-item">
//                 <Link to="/dashboard" className="nav-link">
//                   Dashboard
//                 </Link>
//               </li>
//               <li className="nav-item">
//                 <Link to="/challenges" className="nav-link">
//                   Challenges
//                 </Link>
//               </li>
//               <li className="nav-item">
//                 <Link to="/deployments" className="nav-link">
//                   Deployments
//                 </Link>
//               </li>
//               <li className="nav-item">
//                 <Link to="/troubleshoot" className="nav-link">
//                   Troubleshoot
//                 </Link>
//               </li>
//               <li className="nav-item">
//                 <Link to="/certifications" className="nav-link">
//                   Certifications
//                 </Link>
//               </li>
//               <li className="nav-item dropdown">
//                 <div className="nav-link dropdown-toggle">
//                   {user.name}
//                 </div>
//                 <div className="dropdown-menu">
//                   <Link to="/profile" className="dropdown-item">
//                     Profile
//                   </Link>
//                   <button onClick={handleLogout} className="dropdown-item">
//                     Logout
//                   </button>
//                 </div>
//               </li>
//             </>
//           ) : (
//             <>
//               <li className="nav-item">
//                 <Link to="/login" className="nav-link">
//                   Login
//                 </Link>
//               </li>
//               <li className="nav-item">
//                 <Link to="/register" className="nav-link">
//                   Register
//                 </Link>
//               </li>
//             </>
//           )}
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// client/src/components/Navbar.js - Update with admin menu items
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo">
          DevOnboard
        </NavLink>
        
        <ul className="nav-menu">
          {user ? (
            <>
              <li className="nav-item">
                <NavLink to="/dashboard" className={({ isActive }) => 
                  isActive ? "nav-link active" : "nav-link"
                }>
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/challenges" className={({ isActive }) => 
                  isActive ? "nav-link active" : "nav-link"
                }>
                  Challenges
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/deployments" className={({ isActive }) => 
                  isActive ? "nav-link active" : "nav-link"
                }>
                  Deployments
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/troubleshoot" className={({ isActive }) => 
                  isActive ? "nav-link active" : "nav-link"
                }>
                  Troubleshoot
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/certifications" className={({ isActive }) => 
                  isActive ? "nav-link active" : "nav-link"
                }>
                  Certifications
                </NavLink>
              </li>
              
              {/* Admin menu items */}
              {user.role === 'admin' && (
                <li className="nav-item">
                  <NavLink to="/admin" className={({ isActive }) => 
                    isActive ? "nav-link admin-link active" : "nav-link admin-link"
                  }>
                    Admin
                  </NavLink>
                </li>
              )}
              
              <li className="nav-item dropdown">
                <div className="nav-link dropdown-toggle">
                  {user.name}
                </div>
                <div className="dropdown-menu">
                  <NavLink to="/profile" className={({ isActive }) => 
                    isActive ? "dropdown-item active" : "dropdown-item"
                  }>
                    Profile
                  </NavLink>
                  <button onClick={handleLogout} className="dropdown-item">
                    Logout
                  </button>
                </div>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <NavLink to="/login" className={({ isActive }) => 
                  isActive ? "nav-link active" : "nav-link"
                }>
                  Login
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/register" className={({ isActive }) => 
                  isActive ? "nav-link active" : "nav-link"
                }>
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;