import { Link } from "react-router-dom";
import styled from "styled-components";
import { useLocation, useHistory } from "react-router-dom";

const externalHeaderLocations = ["login", "register"];

function Navbar({ children }: { children?: any }) {
  const history = useHistory();
  const currentPath = useLocation().pathname;
  console.log("currentPath", currentPath);
  const isPathExternal =
    currentPath &&
    externalHeaderLocations.filter((pathName) => currentPath.includes(pathName))
      .length > 0;

  /* 
  cases:
  Landing Page:
    - Authtoken is present in local storage
      ~ See Your Closet
      ~ Home (landing page)
    - Authtoken is not present in local storage
      ~ Home (landing page)
      ~ Login
      ~ Register
  Login Page:
    - Home (landing page)
    - Register
  Register Page:
    - Home (landing page)
    - Login
  Your profile home page:
    - Home (logged in profile)
    - Account
  Account Page:
   - Home (logged in profile)
  */

  const determineNavbarDetails = () => {
    let navbarComponents = [];
    const authTokenPresent = localStorage.getItem("closetlyToken");

    switch (currentPath) {
      case "/home":
        navbarComponents = [
          ...navbarComponents,
          <HeaderLink to="/home">Home</HeaderLink>,
          <HeaderLink to="/account">Account</HeaderLink>,
        ];
        break;
      case "/account":
        navbarComponents = [
          ...navbarComponents,
          <HeaderLink to="/home">Home</HeaderLink>,
          <p
            onClick={() => {
              localStorage.removeItem("closetlyToken");
              history.push("/login");
            }}
          >
            Logout
          </p>,
        ];
        break;
      case "/login":
        navbarComponents = [
          ...navbarComponents,
          <HeaderLink to="/">Home</HeaderLink>,
          <HeaderLink to="/register">Register</HeaderLink>,
        ];
        break;
      case "/register":
        navbarComponents = [
          ...navbarComponents,
          <HeaderLink to="/">Home</HeaderLink>,
          <HeaderLink to="/login">Login</HeaderLink>,
        ];
        break;
      case "/":
        if (authTokenPresent) {
          navbarComponents = [
            ...navbarComponents,
            <HeaderLink to="/">Home</HeaderLink>,
            <HeaderLink to="/home">See Your Closet</HeaderLink>,
          ];
        } else {
          navbarComponents = [
            ...navbarComponents,
            <HeaderLink to="/">Home</HeaderLink>,
            <HeaderLink to="/login">Login</HeaderLink>,
            <HeaderLink to="/register">Register</HeaderLink>,
          ];
        }
        break;
    }
    return navbarComponents;
  };

  return <Nav id="navigation-wrapper">{determineNavbarDetails()}</Nav>;
}

export default Navbar;

const HeaderLink = styled(Link)`
  margin: 0 10px 0 10px;
`;
const Nav = styled.nav`
  display: flex;
  flex-direction: row;
  height: 2em;
  align-items: center;
  background-color: #dac5f5;
  height: 100%;
`;
