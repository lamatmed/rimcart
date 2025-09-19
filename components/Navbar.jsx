"use client";
import { PackageIcon, Search, ShoppingCart, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useUser, useClerk, UserButton, Protect } from "@clerk/nextjs";

const Navbar = () => {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const cartCount = useSelector((state) => state.cart.total);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/shop?search=${search}`);
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`sticky top-0 z-50 bg-white transition-all duration-300 ${isScrolled ? "shadow-md" : ""}`}>
      <div className="mx-4 md:mx-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto py-3 md:py-4 transition-all">
          {/* Logo and mobile menu button */}
          <div className="flex items-center gap-4">
            <button
              className="sm:hidden p-1 rounded-md text-slate-600 hover:bg-slate-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <Link
              href="/"
              className="relative text-2xl md:text-4xl font-semibold text-slate-700 flex items-center"
              onClick={closeMobileMenu}
            >
              <span className="text-green-600">rim</span>cart
              <span className="text-green-600 text-3xl md:text-5xl leading-0">.</span>
              <Protect plan={'plus'}>
                <p className="absolute text-xs font-semibold -top-1 -right-8 px-2 py-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
                  plus
                </p>
              </Protect>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
            <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
            <Link href="/shop" className="hover:text-green-600 transition-colors">Shop</Link>
            <Link href="/about" className="hover:text-green-600 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-green-600 transition-colors">Contact</Link>

            <form
              onSubmit={handleSearch}
              className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-2.5 rounded-full transition-all focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-opacity-50"
            >
              <Search size={18} className="text-slate-600" />
              <input
                className="w-full bg-transparent outline-none placeholder-slate-600"
                type="text"
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                required
              />
            </form>

            <Link
              href="/cart"
              className="relative flex items-center gap-2 text-slate-600 hover:text-green-600 transition-colors p-2 rounded-md hover:bg-slate-50"
            >
              <ShoppingCart size={20} />
              <span className="hidden md:block">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-xs font-medium text-white bg-green-600 min-w-[18px] h-4.5 flex items-center justify-center rounded-full px-1">
                  {cartCount}
                </span>
              )}
            </Link>

            {!user ? (
              <button
                onClick={openSignIn}
                className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm md:text-base"
              >
                Login
              </button>
            ) : (
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action
                    labelIcon={<PackageIcon size={16} />}
                    label="My Orders"
                    onClick={() => router.push("/orders")}
                  />
                </UserButton.MenuItems>
              </UserButton>
            )}
          </div>

          {/* Mobile Cart and User Button */}
          <div className="flex sm:hidden items-center gap-3">
            <Link
              href="/cart"
              className="relative p-2 text-slate-600 rounded-md hover:bg-slate-50"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-xs font-medium text-white bg-green-600 min-w-[18px] h-4.5 flex items-center justify-center rounded-full px-1">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action
                    labelIcon={<ShoppingCart size={16} />}
                    label="Cart"
                    onClick={() => router.push("/cart")}
                  />
                </UserButton.MenuItems>
                <UserButton.MenuItems>
                  <UserButton.Action
                    labelIcon={<PackageIcon size={16} />}
                    label="My Orders"
                    onClick={() => router.push("/orders")}
                  />
                </UserButton.MenuItems>
              </UserButton>
            ) : (
              <button
                onClick={openSignIn}
                className="px-4 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-sm transition text-white rounded-full"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`sm:hidden bg-white transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-96 shadow-lg' : 'max-h-0'}`}>
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="flex flex-col space-y-3">
            <Link 
              href="/" 
              className="py-2 px-4 text-slate-700 hover:text-green-600 hover:bg-slate-50 rounded-md transition-colors"
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link 
              href="/shop" 
              className="py-2 px-4 text-slate-700 hover:text-green-600 hover:bg-slate-50 rounded-md transition-colors"
              onClick={closeMobileMenu}
            >
              Shop
            </Link>
            <Link 
              href="/about" 
              className="py-2 px-4 text-slate-700 hover:text-green-600 hover:bg-slate-50 rounded-md transition-colors"
              onClick={closeMobileMenu}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="py-2 px-4 text-slate-700 hover:text-green-600 hover:bg-slate-50 rounded-md transition-colors"
              onClick={closeMobileMenu}
            >
              Contact
            </Link>
            
            <form
              onSubmit={handleSearch}
              className="flex items-center w-full text-sm gap-2 bg-slate-100 px-4 py-2.5 rounded-full mt-2"
            >
              <Search size={18} className="text-slate-600" />
              <input
                className="w-full bg-transparent outline-none placeholder-slate-600"
                type="text"
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                required
              />
            </form>
          </div>
        </div>
      </div>

      <hr className="border-gray-300" />
    </nav>
  );
};

export default Navbar;