/* =========================================================
   HARI OM KUMAR — PROFESSIONAL PORTFOLIO
   Main JavaScript
========================================================= */

"use strict";


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* Enable JavaScript-dependent animations */

    document.documentElement.classList.add("js-enabled");


    /* =========================================================
       01. ELEMENTS
    ========================================================= */

    const header =
        document.querySelector(".site-header");

    const menuButton =
        document.getElementById("menuButton");

    const navLinks =
        document.getElementById("navLinks");

    const navigationLinks =
        document.querySelectorAll(".nav-links a");

    const sections =
        document.querySelectorAll("main section[id]");

    const revealElements =
        document.querySelectorAll(".reveal");

    const contactForm =
        document.getElementById("contactForm");

    const yearElement =
        document.getElementById("year");


    /* =========================================================
       02. MOBILE NAVIGATION
    ========================================================= */

    if (menuButton && navLinks) {

        menuButton.addEventListener("click", () => {

            const isOpen =
                navLinks.classList.toggle("open");

            document.body.classList.toggle(
                "menu-open",
                isOpen
            );

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuButton.setAttribute(
                "aria-label",
                isOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
            );

        });


        /* Close menu when navigation link is clicked */

        navigationLinks.forEach(link => {

            link.addEventListener("click", () => {

                navLinks.classList.remove("open");

                document.body.classList.remove(
                    "menu-open"
                );

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuButton.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );

            });

        });


        /* Close menu when clicking outside */

        document.addEventListener("click", event => {

            const clickedInsideNavigation =
                navLinks.contains(event.target);

            const clickedMenuButton =
                menuButton.contains(event.target);

            if (
                !clickedInsideNavigation &&
                !clickedMenuButton &&
                navLinks.classList.contains("open")
            ) {

                navLinks.classList.remove("open");

                document.body.classList.remove(
                    "menu-open"
                );

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuButton.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );

            }

        });

    }


    /* =========================================================
       03. HEADER SCROLL EFFECT
    ========================================================= */

    const updateHeader = () => {

        if (!header) {
            return;
        }

        if (window.scrollY > 30) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    };

    updateHeader();

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );


    /* =========================================================
       04. ACTIVE NAVIGATION
    ========================================================= */

    const updateActiveNavigation = () => {

        if (
            !sections.length ||
            !navigationLinks.length
        ) {
            return;
        }

        let currentSection = "home";

        const scrollPosition =
            window.scrollY + 180;


        sections.forEach(section => {

            const sectionTop =
                section.offsetTop;

            const sectionHeight =
                section.offsetHeight;

            if (
                scrollPosition >= sectionTop &&
                scrollPosition <
                    sectionTop + sectionHeight
            ) {

                currentSection =
                    section.getAttribute("id");

            }

        });


        navigationLinks.forEach(link => {

            const linkTarget =
                link.getAttribute("href");

            link.classList.toggle(
                "active",
                linkTarget === `#${currentSection}`
            );

        });

    };

    updateActiveNavigation();

    window.addEventListener(
        "scroll",
        updateActiveNavigation,
        { passive: true }
    );


    /* =========================================================
       05. SCROLL REVEAL ANIMATION
    ========================================================= */

    if (
        "IntersectionObserver" in window &&
        revealElements.length
    ) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.08,

                    rootMargin:
                        "0px 0px -40px 0px"
                }
            );


        revealElements.forEach(element => {

            revealObserver.observe(element);

        });

    } else {

        /* Fallback for older browsers */

        revealElements.forEach(element => {

            element.classList.add("visible");

        });

    }


    /* =========================================================
       06. CONTACT FORM
       REAL FLASK BACKEND CONNECTION
    ========================================================= */

    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const nameInput =
                    document.getElementById("name");

                const emailInput =
                    document.getElementById("email");

                const messageInput =
                    document.getElementById("message");

                const submitButton =
                    contactForm.querySelector(
                        'button[type="submit"]'
                    );


                if (
                    !nameInput ||
                    !emailInput ||
                    !messageInput ||
                    !submitButton
                ) {

                    console.error(
                        "Contact form elements are missing."
                    );

                    return;

                }


                const name =
                    nameInput.value.trim();

                const email =
                    emailInput.value.trim();

                const message =
                    messageInput.value.trim();


                /* -----------------------------------------
                   Required field validation
                ----------------------------------------- */

                if (!name) {

                    alert(
                        "Please enter your name."
                    );

                    nameInput.focus();

                    return;

                }


                if (!email) {

                    alert(
                        "Please enter your email."
                    );

                    emailInput.focus();

                    return;

                }


                if (!message) {

                    alert(
                        "Please enter your message."
                    );

                    messageInput.focus();

                    return;

                }


                /* -----------------------------------------
                   Email validation
                ----------------------------------------- */

                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (!emailPattern.test(email)) {

                    alert(
                        "Please enter a valid email address."
                    );

                    emailInput.focus();

                    return;

                }


                /* -----------------------------------------
                   Prevent oversized input
                ----------------------------------------- */

                if (name.length > 100) {

                    alert(
                        "Name is too long."
                    );

                    nameInput.focus();

                    return;

                }


                if (message.length > 5000) {

                    alert(
                        "Message is too long."
                    );

                    messageInput.focus();

                    return;

                }


                /* -----------------------------------------
                   Flask backend URL

                   This is the REAL local backend
                   we are testing right now.
                ----------------------------------------- */

                const API_URL =
                    "http://127.0.0.1:5000/send-message";


                /* -----------------------------------------
                   Disable button while sending
                ----------------------------------------- */

                const originalButtonText =
                    submitButton.textContent;

                submitButton.disabled = true;

                submitButton.textContent =
                    "Sending...";


                try {

                    /* -------------------------------------
                       Send form data to Flask backend
                    ------------------------------------- */

                    const response =
                        await fetch(
                            API_URL,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({
                                    name: name,
                                    email: email,
                                    message: message
                                })
                            }
                        );


                    /* -------------------------------------
                       Read backend response
                    ------------------------------------- */

                    const result =
                        await response.json();


                    /* -------------------------------------
                       Backend rejected the request
                    ------------------------------------- */

                    if (
                        !response.ok ||
                        !result.success
                    ) {

                        throw new Error(
                            result.message ||
                            "Unable to send message."
                        );

                    }


                    /* -------------------------------------
                       Email was actually accepted
                       by the backend.
                    ------------------------------------- */

                    alert(
                        "Your message has been sent successfully!"
                    );


                    contactForm.reset();


                } catch (error) {

                    console.error(
                        "Contact form error:",
                        error
                    );


                    alert(
                        "Unable to send your message. " +
                        "Please try again."
                    );


                } finally {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        originalButtonText;

                }

            }
        );

    }


    /* =========================================================
       07. CURRENT YEAR
    ========================================================= */

    if (yearElement) {

        yearElement.textContent =
            new Date().getFullYear();

    }


    /* =========================================================
       08. SMOOTH INTERNAL LINKS
    ========================================================= */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const targetId =
                        link.getAttribute("href");


                    if (
                        !targetId ||
                        targetId === "#"
                    ) {

                        return;

                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) {

                        return;

                    }


                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        });


    /* =========================================================
       09. CERTIFICATE IMAGE
    ========================================================= */

    const certificateImage =
        document.querySelector(
            ".certificate-preview img"
        );


    if (certificateImage) {

        certificateImage.addEventListener(
            "error",
            () => {

                certificateImage.alt =
                    "Certificate image could not be loaded.";

                console.warn(
                    "Certificate image not found. " +
                    "Make sure certificate.jpg is in the " +
                    "same folder as index.html."
                );

            }
        );

    }


    /* =========================================================
       10. PROFILE IMAGE
    ========================================================= */

    const profileImages =
        document.querySelectorAll(
            ".hero-profile-image, .about-photo img"
        );


    profileImages.forEach(image => {

        image.addEventListener(
            "error",
            () => {

                console.warn(
                    "Profile image not found. " +
                    "Make sure profile.jpg is in the " +
                    "same folder as index.html."
                );

            }
        );

    });


    /* =========================================================
       11. RESUME IMAGE
    ========================================================= */

    const resumeImage =
        document.querySelector(
            ".resume-preview img"
        );


    if (resumeImage) {

        resumeImage.addEventListener(
            "error",
            () => {

                console.warn(
                    "Resume image not found. " +
                    "Make sure resume.jpg is in the " +
                    "same folder as index.html."
                );

            }
        );

    }


    /* =========================================================
       12. KEYBOARD ACCESSIBILITY
    ========================================================= */

    document.addEventListener(
        "keydown",
        event => {

            /* Escape closes mobile navigation */

            if (
                event.key === "Escape" &&
                navLinks &&
                navLinks.classList.contains("open")
            ) {

                navLinks.classList.remove("open");

                document.body.classList.remove(
                    "menu-open"
                );


                if (menuButton) {

                    menuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );
const API_URL = "https://portfoliohariom.onrender.com/send-message";
                    menuButton.setAttribute(
                        "aria-label",
                        "Open navigation menu"
                    );

                }

            }

        }
    );


    /* =========================================================
       13. PAGE LOADED
    ========================================================= */

    document.body.classList.add(
        "page-loaded"
    );

});
