import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

let portraitSections = []
let landscapeSections = []
let serviceSections = []
let sections = []
let currentSection = 0

let prevScrollY = 0

let timeout = null
let isScrolling = false

let header = null
let sectionNameElement = null
let menuButton = null
let scrollHints = []

function scrollToSection(index, shouldScrollInstantly) {
    console.log('sdfsd')

    if (!sections[index]) return
    const skip = sections[index]?.attributes['data-skip']?.value || false

    if (skip && currentSection > index) {
        sections[index].style.display = 'none'
        setTimeout(() => {
            sections[index].style.display = 'block'
        }, 600);
        scrollToSection(index-1)
        return
    }

    if (index < 0 || index >= sections.length || isScrolling) return;
    isScrolling = true;

    console.log(currentSection, index)

    const scrollHint = sections[index].querySelector('.scrollHint')
    if (scrollHint) {
        scrollHint.style.opacity = 0
        setTimeout(() => {
            if (scrollHint) scrollHint.style.opacity = 1
        }, 3000);
    }


    // const sectionStyles = window.getComputedStyle(sections[index])

    if (header) {
        // const sectionName = (sections[index].attributes['data-name']?.value || '').toUpperCase()
        // if (sectionNameElement.innerHTML !== sectionName) sectionNameElement.innerHTML = ''
        setTimeout(() => {
            // sectionNameElement.innerHTML = sectionName

            if (sections[index].attributes['data-color']?.value === 'dark') {
                // sectionNameElement.style.color = 'white'
                menuButton.style.color = 'white'
                // header.style.backgroundColor = 'rgba(0, 0, 0, 0.712)'
            }
            else {
                // sectionNameElement.style.color = 'black'
                menuButton.style.color = 'black'
                // header.style.backgroundColor = 'transparent'
            }
        }, 600);

    }

    serviceSections.forEach(item => item.classList.remove('show-service-description'))
    sections[index].scrollIntoView({ behavior: shouldScrollInstantly ? "auto" : "smooth" })
    // window.scrollTo({ top: sections[index].offsetTop, behavior: "smooth" });

    setTimeout(() => {

        if (!skip) {
            currentSection = index;
            isScrolling = false;

            if (sections[index].classList.contains('service') && window.innerHeight > window.innerWidth) {
                setTimeout(() => sections[index].classList.add('show-service-description'), 2000);
            }
        }
        else {
            if (skip && currentSection < index) {
                setTimeout(() => {
                    
                    const p = sections[index].querySelector('.section-label')
                    p.style.position = 'fixed'

                    p.style.opacity = 0
                    isScrolling = false;
                    scrollToSection(index+1, true)

                    setTimeout(() => {
                        p.style.position = 'relative'
                        p.style.opacity = 1
                        
                    }, 1000);
                    
                }, 1000);
            }
        }
        
    }, 300); // Adjust timeout based on animation speed

    // setTimeout(() => {
    //     if (scrollHint) scrollHint.style.opacity = 1
    // }, 4000);
}

function setSections() {
    currentSection = 0
    sections = []

    let sectionsSelector 

    if (window.innerWidth >= 1024 || window.innerWidth > window.innerHeight) sectionsSelector = '.lg-section'
    else if (window.innerWidth >= 768) sectionsSelector = '.md-section'
    else sectionsSelector = 'section'

    sections = document.querySelectorAll(sectionsSelector)

    scrollToSection(0)
}


function fitTextToContainer(textElement) {
    const container = textElement.parentElement;
    let fontSize = 100; // Start large
    textElement.style.fontSize = fontSize + "px";

    const maxWidth = container.clientWidth - 20
    
    while (container.clientHeight > 60 || textElement.scrollWidth > maxWidth && fontSize > 16) {
        fontSize -= 1;
        textElement.style.fontSize = fontSize + "px";
    }
}


document.addEventListener('DOMContentLoaded', () => {
    setSections()

    const navButtons = document.querySelectorAll('.nav-button')
    portraitSections = document.querySelectorAll('.section')
    landscapeSections = document.querySelectorAll('.lg-section')
    serviceSections = document.querySelectorAll('.service')
    
    scrollHints = document.querySelectorAll('.scrollHint')

    scrollHints.forEach(item => item.addEventListener('click', () => scrollToSection(currentSection+1)))

    header = document.querySelector('header')
    sectionNameElement = header.querySelector('.sectionName')
    menuButton = header.querySelector('#menuButton')

    window.addEventListener('resize', () => {
        setSections()
    }, )
    window.addEventListener("orientationchange", () => {
        setSections()
    });

    // Prevent default scrolling
    window.addEventListener('wheel', (e) => {
        e.preventDefault()

    }, { passive: false });
    window.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    window.addEventListener('keydown', (e) => {
        if (["ArrowUp", "ArrowDown", "Space"].includes(e.code)) {
            e.preventDefault();
        }
    });

    let touchStartY = 0;
    let touchEndY = 0;
    let touchStartTime = 0;

    window.addEventListener("touchstart", (e) => {
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
    });
    window.addEventListener("touchend", (e) => {
        touchEndY = e.changedTouches[0].clientY;
        touchEndY = e.changedTouches[0].clientY;

        let touchDistance = touchStartY - touchEndY;
        let touchDuration = Date.now() - touchStartTime;

        // Ignore very slow swipes (likely inertia scrolling)
        let speed = Math.abs(touchDistance) / touchDuration; 

        if (speed < 0.3) return; // Adjust threshold if needed
        if (isScrolling) return

        if (touchDistance > 50) {
            scrollToSection(currentSection + 1);
        } else if (touchDistance < 50) {
            scrollToSection(currentSection - 1);
        }
    });

    window.addEventListener("keydown", (event) => {
        if (event.code === "ArrowDown" || event.code === "Space") {
            scrollToSection(currentSection + 1);
        } else if (event.code === "ArrowUp") {
            scrollToSection(currentSection - 1);
        }
    });

    let lastScrollTime = 0

    window.addEventListener("wheel", (event) => {

        const now = Date.now();
        const timeSinceLastScroll = now - lastScrollTime;
        lastScrollTime = now;
        if (isScrolling) return
        
        console.log(event.deltaY, timeSinceLastScroll)
        // Ignore small deltaY values (caused by inertia)
        // if (Math.abs(event.deltaY) < 10) return; 

        // Ignore fast consecutive scrolls (within 300ms)
        if (timeSinceLastScroll < 300) return;  

        if (event.deltaY > 0) {
            scrollToSection(currentSection + 1);
        } else {
            scrollToSection(currentSection - 1);
        }
    });


    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                // observer.unobserve(entry.target); // Stop observing once animated
            }
            else {
                entry.target.classList.remove("active");
            }
        });
    }, { threshold: 0.01 });

    document.querySelectorAll('.animated').forEach((el) => {
        observer.observe(el)
    });

    document.getElementById('menuButton').addEventListener('click', () => {
        const menu = document.getElementById('menu')
        menu.showModal()
        menu.style.opacity = 1
    })

    document.getElementById('closeMenuButton').addEventListener('click', () => {
        const menu = document.getElementById('menu')
        menu.style.opacity = 0
        setTimeout(() => {
            menu.close()
        }, 1000);
    })

    document.querySelectorAll('.fit-to-width').forEach(item => fitTextToContainer(item))
    
    serviceSections.forEach(section => {
        section.addEventListener('click', () => {
            serviceSections.forEach(item => {
                item !== section && item.classList.remove('show-service-description')
                item == section && item.classList.toggle('show-service-description')
            })
        })
    })

    document.querySelectorAll('#galeryButton').forEach(button => {
        button.addEventListener('click', () => {
            window.open('galery', '_blank')
        })
    })

    navButtons.forEach(item => item.addEventListener('click', () => {
        let sectionIndex
        sections.forEach((section, index) => {
            if (section.attributes['data-section']?.value === item.innerHTML) sectionIndex = index
        })

        menu.close()

        currentSection = 0
        scrollToSection(sectionIndex)
    }))

})

// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vite.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector('#counter'))
