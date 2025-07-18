import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import primaryLogo from '../../assets/logos/primary-logo-black.png';
import primaryLogoWhite from '../../assets/logos/primary-logo-white.png'
import Button from '../Buttons/Button.jsx';
import './NavBar.css';

const BookBtnSidebar = lazy(() => import('../BookBtnSidebar/BookBtnSidebar.jsx'));

// NavBar Component
const NavBar = ({ setNavHeight, setToggleDisplay, toggleDisplay }) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const navRef = useRef(null);
    const location = useLocation();
    const [isHomePage, setIsHomePage] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Effect to monitor window size and handle navbar display
    useEffect(() => {
        const handleResize = () => {
            const currentWidth = window.innerWidth;
            setWindowWidth(currentWidth);

            // Dynamically determine if it's a mobile view
            if (currentWidth <= 1024) {
                setToggleDisplay(false);
            } else {
                setToggleDisplay(true);
            }
        };

        // Attach resize event listener
        window.addEventListener('resize', handleResize);

        // Initial call to handle the current window size
        handleResize();

        // Cleanup: Remove the resize event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Close navbar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            const currentWidth = window.innerWidth;

            if (currentWidth <= 1024 && toggleDisplay && navRef.current && !navRef.current.contains(event.target)) {
                setToggleDisplay(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    });

    // Runs every time the user navigates to a different page
    useEffect(() => {
        closeMobileNav();
        verifyHomePage();
        window.scrollTo(0, 0);
    }, [location.pathname]);

    // Add scroll lock when nav menu is open
    useEffect(() => {
        const isMobileView = window.innerWidth <= 1024;

        if (isMobileView && toggleDisplay) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [toggleDisplay]);

    // Automatically closes nav bar when navigating to a new tab    
    const closeMobileNav = () => {
        const isMobileView = window.innerWidth <= 1024;

        if (isMobileView && toggleDisplay) {
            setToggleDisplay(!toggleDisplay)
        }
    }

    // Checks to see if user is on homepage
    const verifyHomePage = () => {
        if (location.pathname != '/') {
            setIsHomePage(false);
        } else {
            setIsHomePage(true);
        }
    }

    // Toggle the sidebar visibility for the nav book button
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Set the height of the navbar to use as margin-top number on non homepage numbers
    useEffect(() => {
        const updateNavHeight = () => {
            if (navRef.current) {
                const isMobileView = window.innerWidth <= 1024;

                // Only update navHeight when not in mobile open state
                if (!(isMobileView && toggleDisplay)) {
                    setNavHeight(navRef.current.offsetHeight);
                }
            }
        };

        updateNavHeight();
        window.addEventListener('resize', updateNavHeight);

        return () => window.removeEventListener('resize', updateNavHeight);
    }, [toggleDisplay, windowWidth, setNavHeight]);

    // Handles have the navbar styles when user scrolls on the page
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;

            // Custom threshold for homepage
            const threshold = location.pathname === '/' ? 300 : 0;

            setIsScrolled(scrollY > threshold);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname]);

    return (
        <nav
            ref={navRef}
            id='nav-bar-container'
            className={`
                ${isHomePage && !isScrolled ? "nav-bar-container-home" : "nav-bar-container-not-home"} 
                ${(windowWidth <= 1024 && toggleDisplay) ? 'mobile-open' : ''}
                ${isScrolled ? 'nav-bar-container-scrolled' : ''}
            `}
        >
            {/* Upper Navbar */}
            <div id="upper-nav-container">
                {/* Navbar Toggle Button */}
                <button id="nav-toggle-btn" onClick={() => setToggleDisplay(!toggleDisplay)}>
                    {toggleDisplay ? <i className="fa-solid fa-xmark"></i> : <i className="fa-solid fa-bars"></i>}
                </button>

                {/* Logo */}
                <NavLink to="/" onClick={() => closeMobileNav()}>
                    <img
                        id="nav-logo"
                        src={isHomePage && !isScrolled ? primaryLogoWhite : primaryLogo}
                        alt="The word Monopoly Concierge with a top over it"
                    />
                </NavLink>

                {/* Call-to-Action Button */}
                <Button
                    btnIdName={'nav-cta-btn'}
                    displayName='BOOK'
                    btnAction={toggleSidebar}
                    btnClassName={isHomePage && !isScrolled ? "cta-btn-home" : "cta-btn-not-home"}
                />
            </div>

            {/* Navbar Tabs */}
            <ul
                id="nav-tab-container"
                style={{
                    display: toggleDisplay ? 'flex' : 'none', 
                }}
                className={isHomePage && !isScrolled ? "nav-tab-container-home" : "nav-tab-container-not-home"}
            >
                <NavLink
                    to="/properties"
                    onClick={() => closeMobileNav()}
                    className={isHomePage && !isScrolled ? "nav-links nav-links-home" : "nav-links nav-links-not-home"}
                >
                    <li className="nav-tabs">Properties</li>
                </NavLink>
                <NavLink
                    to="/services"
                    onClick={() => closeMobileNav()}
                    className={isHomePage && !isScrolled ? "nav-links nav-links-home" : "nav-links nav-links-not-home"}
                >
                    <li className="nav-tabs">Concierge Services</li>
                </NavLink>
                <NavLink
                    to="/charters"
                    onClick={() => closeMobileNav()}
                    className={isHomePage && !isScrolled ? "nav-links nav-links-home" : "nav-links nav-links-not-home"}
                >
                    <li className="nav-tabs">Jet Charters</li>
                </NavLink>
                <NavLink
                    to="/rentals"
                    onClick={() => closeMobileNav()}
                    className={isHomePage && !isScrolled ? "nav-links nav-links-home" : "nav-links nav-links-not-home"}
                >
                    <li className="nav-tabs">Car Rentals</li>
                </NavLink>

                <NavLink
                    to="/chronicles"
                    onClick={() => closeMobileNav()}
                    className={isHomePage && !isScrolled ? "nav-links nav-links-home" : "nav-links nav-links-not-home"}
                >
                    <li className="nav-tabs">Concierge Chronicles</li>
                </NavLink>
            </ul>
            <Suspense fallback={null}>
                <BookBtnSidebar isOpen={isSidebarOpen} closeSidebar={toggleSidebar} screenSize={windowWidth} />
            </Suspense>
        </nav>
    );
};

export default NavBar;

NavBar.propTypes = {
    setNavHeight: PropTypes.func,
    setToggleDisplay: PropTypes.func,
    toggleDisplay: PropTypes.bool
} 