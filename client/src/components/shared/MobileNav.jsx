import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react"
import { Link, useLocation } from "react-router-dom"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { navLinks } from "@/constants"
import { Button } from "../ui/button"


const MobileNav = () => {
  const location = useLocation();

  return (
    <header className="header">
      <Link to="/" className="flex items-center gap-2 md:py-2" >
        <img src="/images/logo-text.svg" alt="logo" width={120} height={28} />
      </Link>

      <nav className="flex gap-2">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
          <Sheet>
            <SheetTrigger>
              <img src="/icons/menu.svg" alt="menu" width={32} height={32} className="cursor-pointer" />
            </SheetTrigger>
            <SheetContent className="sheet-content sm:w-64">
              <>
                <img src="/images/logo-text.svg" alt="logo" width={120} height={23} />
                <ul className="header-nav_elements">
                {navLinks.map((link) => {
                  const isActive = link.route === location.pathname;
                  return (
                    <li key={link.route} className={`${isActive && 'gradient-text'} p-18 flex whitespace-nowrap text-dark-700`}>
                      <Link to={link.route} className="sidebar-link cursor-pointer">
                        <img src={link.icon} alt="logo" width={24} height={24} />
                        {link.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
              </>
            </SheetContent>
          </Sheet>
        </SignedIn>

        <SignedOut>
            <Button asChild className="button bg-purple-gradient bg-cover">
              <Link to="/sign-in">Login</Link>
            </Button>
          </SignedOut>
      </nav>
    </header>
  )
}

export default MobileNav