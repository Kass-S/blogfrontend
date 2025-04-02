
import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import Link from "next/link";

export function NavbarComponent() {
  return (
    <Navbar fluid rounded>
      <NavbarToggle />
      <NavbarCollapse>
        <NavbarLink as={Link} href="/">Login Page</NavbarLink>
        <NavbarLink as={Link} href="/Blogs">Blog Page</NavbarLink>
        <NavbarLink as={Link} href="/Dashboard">Dashboard Page</NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}
