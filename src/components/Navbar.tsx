import { Link, useLocation } from "react-router-dom";
import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import jorcLogo from "@/assets/jorc-logo.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/programs", label: "Programs" },
  { to: "/facility", label: "Facility" },
  { to: "/community", label: "Community" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={jorcLogo} alt="JORC Logo" className="h-10 w-10 rounded-full object-cover" />
            <span className="font-bold text-jorc-green text-sm hidden sm:block leading-tight">JONAH OTUNLA<br />RESOURCE CENTER</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === l.to
                    ? "text-jorc-green bg-jorc-green-lighter"
                    : "text-foreground hover:text-jorc-green hover:bg-jorc-green-lighter"
                }`}
              >
                {l.label}
              </Link>
            ))}

            <Link
              to="/stakeholder/report"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                pathname === "/stakeholder/report"
                  ? "text-jorc-green bg-jorc-green-lighter"
                  : "text-foreground hover:text-jorc-green hover:bg-jorc-green-lighter"
              }`}
            >
              Stakeholder Report
            </Link>

            <Link
              to="/donate"
              className="ml-3 px-5 py-2 rounded-lg bg-jorc-green text-white text-sm font-semibold hover:bg-jorc-green-light transition-colors inline-flex items-center gap-1.5"
            >
              <Heart className="h-4 w-4" />
              Donate
            </Link>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-2">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                pathname === l.to ? "text-jorc-green bg-jorc-green-lighter" : "text-foreground hover:bg-jorc-green-lighter"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/stakeholder/report"
            onClick={() => setOpen(false)}
            className={`block px-3 py-2 rounded-md text-sm font-medium ${
              pathname === "/stakeholder/report" ? "text-jorc-green bg-jorc-green-lighter" : "text-foreground hover:bg-jorc-green-lighter"
            }`}
          >
            Stakeholder Report
          </Link>
          <Link
            to="/donate"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-white bg-jorc-green hover:bg-jorc-green-light text-center"
          >
            <Heart className="h-4 w-4 inline-block mr-1.5" />
            Donate
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
