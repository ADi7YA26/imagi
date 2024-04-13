import { navLinks } from "@/constants"
import { Link, useLocation } from "react-router-dom"
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Button } from "../ui/button";

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="flex size-full flex-col gap-4">
        <Link to="/" className="sidebar-logo">
          <img src="/images/logo-text.svg" alt="logo" width={180} height={28}  />
        </Link>

        <nav className="sidebar-nav">
          <SignedIn>
            <ul className="sidebar-nav_elements">
              {navLinks.slice(0,6).map((link) => {
                const isActive = link.route === location.pathname;
                return (
                  <li key={link.route} className={`sidebar-nav_element group ${isActive ? 'bg-purple-gradient text-white': 'text-gray-700'}`}>
                    <Link to={link.route} className="sidebar-link">
                      <img src={link.icon} alt="logo" width={24} height={24} className={`${isActive && 'brightness-200'}`} />
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>

            <ul className="sidebar-nav_elements">
              {navLinks.slice(6).map((link) => {
                const isActive = link.route === location.pathname;
                return (
                  <li key={link.route} className={`sidebar-nav_element group ${isActive ? 'bg-purple-gradient text-white': 'text-gray-700'}`}>
                    <Link to={link.route} className="sidebar-link">
                      <img src={link.icon} alt="logo" width={24} height={24} className={`${isActive && 'brightness-200'}`} />
                      {link.label}
                    </Link>
                  </li>
                )
              })}

              <li className="flex-center cursor-pointer gap-2 p-4">
                <UserButton afterSignOutUrl='/' showName />
              </li>
            </ul>
          </SignedIn>

          <SignedOut>
            <Button asChild className="button bg-purple-gradient bg-cover">
              <Link to="/sign-in">Login</Link>
            </Button>
          </SignedOut>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar