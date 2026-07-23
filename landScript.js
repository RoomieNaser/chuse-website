//FUCK SCROLL RESTORATION BRO
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Force scroll to top
window.onload = function() {
    setTimeout(function() {
        window.scrollTo(0, 0);
    }, 10); 
};

document.addEventListener("DOMContentLoaded", function() {
    //HTML consts and vars gng
    const introBox = document.getElementById('intro-box');
    const introTextSpans = document.querySelectorAll('.intro-text span');
    const staticText = document.getElementById('we-are');
    const chuseText = document.getElementById('dynamic-chuse');
    const underline = document.getElementById('underline');
    const navbar = document.getElementById('navbar');
    const downloadBtn = document.getElementById('init-download-btn');
    const hamburger = document.getElementById('hamburger');
    const playBtn = document.getElementById('play-pronunciation');
    const chuseAudio = document.getElementById('chuse-audio');
    const bentoItems = document.querySelectorAll('.bento-item');

    const hoverSound = document.getElementById('hover-sound');
    chuseAudio.volume = 0.9;

    const marqueeSound = document.getElementById('marquee-sound');
    const marqueeItems = document.querySelectorAll('.marquee-track a');

    //Actual vars and consts
    const part1 = "We Are ";
    const part2 = "CHUSÉ";
    let index1 = 0;
    let index2 = 0;
    let fontIndex = 1;
    let colorIndex = 1;
    let currSpeed = 80;
    const minSpeed = 300;
    let brakePower = 1.0;
    const brakeIncrease = 0.04;

    //hover vars and consts
    let targetBrushSize = 0;
    let currentBrushSize = 0;
    let mouseX = 0;
    let mouseY = 0;

    let targetBgX = 0;
    let targetBgY = 0;
    let currentBgX = 0;
    let currentBgY = 0;

    //Audio vars
    let isMuted = true;

    //my first synchronization problem
    let mutex = true;
    
    document.querySelectorAll('.nav-links a[href^="#"], .hamburger-menu a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); 
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const introSection = document.querySelector('.intro');
                
                // Get the original baseline position of the section
                let targetPosition = targetSection.offsetTop;
                
                if (window.scrollY <= 10) {
                    const finalIntroHeight = Math.max(window.innerHeight * 0.15, 120);
                    const currentIntroHeight = introSection.offsetHeight;
                    const layoutShiftAmount = currentIntroHeight - finalIntroHeight;
                    targetPosition -= layoutShiftAmount;
                    introBox.classList.add('shrunk-box');
                    introSection.classList.add('shrunk-section');
                }

                window.scrollTo({
                    top: targetPosition - 90,
                    behavior: 'smooth'
                });
            }
        });
    });

    const cycleWord = document.getElementById('cycle-word');  
    if (cycleWord) {
        const words = ["Journey.", "Dream.", "Passion.", "Music."];
        let cycleIndex = 1; 

        cycleWord.addEventListener('mouseenter', () => {
            // Change to the current target word
            cycleWord.textContent = words[cycleIndex];
            
            cycleIndex++;
            
            // If we run out of words, loop back to the first replacement word
            if (cycleIndex >= words.length) {
                cycleIndex = 0; 
            }

            if (!isMuted) {
                hoverSound.play().catch(() => {});
            }
        });
    }

    //Audio logic stuff
    if (downloadBtn && hoverSound) {
        downloadBtn.addEventListener('mouseenter', () => {
            if (!isMuted) {
                hoverSound.currentTime = 0;
                hoverSound.play().catch(() => {});
            }
        });
    }

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            isMuted = !isMuted;

            if (!isMuted){
                playBtn.classList.remove('is-muted');

                if (chuseAudio) {
                    chuseAudio.currentTime = 0;
                    chuseAudio.play().catch(() => {});
                    playBtn.classList.add('is-playing');
                    
                    chuseAudio.onended = () => {
                        playBtn.classList.remove('is-playing');
                    };
                }
                if (hoverSound) {
                    hoverSound.volume = 0;
                    hoverSound.play().then(() => {
                        hoverSound.pause();
                        hoverSound.currentTime = 0;
                        hoverSound.volume = 0.4; 
                    }).catch(() => {});
                }

                if (marqueeSound) {
                    marqueeSound.volume = 0;
                    marqueeSound.play().then(() => {
                        marqueeSound.pause();
                        marqueeSound.currentTime = 0;
                        marqueeSound.volume = 0.5; 
                    }).catch(() => {});
                }
            } else {
                playBtn.classList.add('is-muted');
                playBtn.classList.remove('is-playing');

                if (chuseAudio) {
                    chuseAudio.pause();
                    chuseAudio.currentTime = 0;
                }

            }
        });
    }

    // MARQUEE HOVER SOUND
    if (marqueeItems.length > 0 && marqueeSound) {
        
        marqueeSound.preservesPitch = false; 
        if (typeof marqueeSound.webkitPreservesPitch !== 'undefined') {
            marqueeSound.webkitPreservesPitch = false;
        }

        const naturalMinor = [0, 2, 3, 5, 7, 8, 10];
        
        marqueeItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                if (!isMuted) {
                    const randomSemitone = naturalMinor[Math.floor(Math.random() * naturalMinor.length)];
                    const pitchMultiplier = Math.pow(2, randomSemitone / 12);
                    marqueeSound.playbackRate = pitchMultiplier; 
                    marqueeSound.currentTime = 0;
                    marqueeSound.play().catch(() => {});
                }
            });
        });
    }

    if (bentoItems.length > 0 && hoverSound) {
        bentoItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                if (!isMuted) {
                    hoverSound.currentTime = 0;
                    hoverSound.play().catch(() => {});
                }
            });
        });
    }


    //Performance tracking:
    let isIntroVisible = true;
    let isListenVisible = false;

    const perfObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.target.classList.contains('intro')){
                isListenVisible = entry.isIntersecting;
            }
        });
    }, {threshold: 0});

    perfObserver.observe(document.querySelector('.intro'));
    perfObserver.observe(document.getElementById('listen'));

    //BIG BOY SCROLL REVEAL FOR ALL IDS
    // Add any future section IDs to this array
    const revealSections = [
        document.getElementById('socials'),
        document.getElementById('listen'),
        document.getElementById('review'),
        document.getElementById('about-title'),
        document.querySelector('#roomie-row .member-bio'),
        document.querySelector('#impu-row .member-bio'),
        document.querySelector('#pra-row .member-bio'),
        document.querySelector('#abya-row .member-bio')
    ];

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const section = entry.target.closest('.member-row') || entry.target;
            
            if (entry.isIntersecting) {
                section.classList.add('reveal-active');
                
                setTimeout(() => {
                    section.classList.remove('reveal-hidden');
                }, 50);

                clearTimeout(section.cleanupTimeout);
                section.cleanupTimeout = setTimeout(() => {
                    section.classList.remove('reveal-active');
                }, 1200); 

            } else {
                if (entry.boundingClientRect.top > 0) {
                    section.classList.add('reveal-hidden');
                    section.classList.remove('reveal-active');
                }
            }
        });
    }, {
        threshold: 0.15 
    });

    revealSections.forEach(section => {
        if (section) {
            section.classList.add('reveal-hidden');
            revealObserver.observe(section);
        }
    });

    //TypeShit just types shit
    function typeShit(){
        if (index1 < part1.length) {
            staticText.innerHTML += part1.charAt(index1);
            index1++;
            setTimeout(typeShit, 100);
        } else if (index2 < part2.length){
            chuseText.innerHTML += part2.charAt(index2);
            
            if (index2 === 0) {
                const rect = chuseText.getBoundingClientRect();

                mouseX = rect.left + 20; 
                mouseY = rect.top + (rect.height / 2);
            }

            index2++;
            targetBrushSize = 120; 

            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            targetBgX = (mouseX - centerX) * 0.03;
            targetBgY = (mouseY - centerY) * 0.03;
            
            setTimeout(typeShit, 100);
        } else {
            growUnderline();
            bluntRotation();
        }
    }

    //Big time blunt rotation, rotates values of colors and fonts
    function bluntRotation() {
        if (currSpeed >= minSpeed && fontIndex === 1 && colorIndex === 1) {
            chuseText.classList.add(`chuse-font-2`);
            chuseText.classList.add(`chuse-color-2`);
            underline.style.width = '100%';
            targetBrushSize = 0;
            targetBgX = 0;
            targetBgY = 0;
            mutex = false;
            return;
        }

        chuseText.className = '';
        chuseText.classList.add(`chuse-font-${fontIndex}`);
        chuseText.classList.add(`chuse-color-${colorIndex}`);

        fontIndex = (fontIndex % 4) + 1;
        colorIndex = (colorIndex % 4) + 1;

        brakePower += brakeIncrease;

        currSpeed = Math.min(minSpeed, currSpeed * brakePower);

        setTimeout(bluntRotation, currSpeed);
    }

    //Underline erection
    function growUnderline() {
        underline.style.width = '100%';
        setTimeout(fadeItAll, 800);
    }

    //LET THERE BE LIGHT!!!
    function fadeItAll(){
        navbar.classList.remove('hidden');
        downloadBtn.classList.remove('hidden');
        introBox.classList.add('reveal-bg');
    }

    const heroArea = document.getElementById('hero-area');
    const heroTitle = document.getElementById('hero-title');
    const songRows = document.querySelectorAll('.song-row');

    songRows.forEach(row => {
        // 1. Hover Sound
        row.addEventListener('mouseenter', () => {
            if (!isMuted && hoverSound) {
                hoverSound.currentTime = 0;
                hoverSound.play().catch(() => {});
            }
        });

        // 2. Song Change
        row.addEventListener('click', function() {
            if (this.classList.contains('active')) return;

            const newName = this.getAttribute('data-name');
            const newSrc = this.getAttribute('data-src');
            const newColor = this.getAttribute('data-color');

            if (wavesurfer) {
                wakeUpVisualizer();
                wavesurfer.setVolume(1); 
            }

            // Update active class
            songRows.forEach(r => r.classList.remove('active'));
            this.classList.add('active');

            // --- UPDATE CSS VARIABLES & COLORS HERE ---
            const listenSection = document.getElementById('listen');
            if (listenSection && newColor) {
                listenSection.style.setProperty('--theme-color', newColor);
                listenSection.style.setProperty('--theme-shadow', newColor + '66'); 
            }
            if (typeof coreMaterial !== 'undefined' && newColor) {
                coreMaterial.color.set(newColor);
            }
            if (wavesurfer && newColor) {
                wavesurfer.setOptions({ progressColor: newColor });
            }

            // Trigger Fade Animation
            heroArea.style.opacity = '0';
            // Audio Logic
            wavesurfer.load(newSrc);
            
            // IMPORTANT: Use .once() so it only triggers for this specific click!
            wavesurfer.once('ready', () => {
            wavesurfer.play();
            masterPlayBtn.classList.add('is-playing'); // Sync the play icon instantly
            if (typeof timeDisplay !== 'undefined' && timeDisplay) {
                timeDisplay.classList.add('is-active-time');
            }
            
            setTimeout(() => {
                // Swap Text
                heroTitle.textContent = newName;
                
                // Remove/Re-add class to restart animation
                heroArea.classList.remove('fade-in-right');
                void heroArea.offsetWidth; // Trigger reflow
                heroArea.classList.add('fade-in-right');
                heroArea.style.opacity = '1';

                
            }, 300);
            
        });
    });
    });

    typeShit();

    // GO PAINT ITS ASS BRO LES GOOO
    introBox.addEventListener('mousemove', (e) => {
        if (!mutex){
            mouseX = e.clientX;
            mouseY = e.clientY;
            targetBrushSize = 100;

            const centerX = window.innerWidth/2;
            const centerY = window.innerHeight/2;
            const mvmtStrength = 0.01;

            targetBgX = (mouseX - centerX) * mvmtStrength;
            targetBgY = (mouseY - centerY) * mvmtStrength;
        }
    });

    introBox.addEventListener('mouseleave', () => {
        targetBrushSize = 0;
    });

    function animateBrush(){
        currentBrushSize += (targetBrushSize - currentBrushSize) * 0.25;

        currentBgX += (targetBgX - currentBgX) * 0.1;
        currentBgY += (targetBgY - currentBgY) * 0.1;

        introTextSpans.forEach(span => {
            span.style.setProperty('--brush-size', `${currentBrushSize}px`);
            span.style.setProperty('--mouse-x', `${mouseX}px`);
            span.style.setProperty('--mouse-y', `${mouseY}px`);
        });

        introBox.style.setProperty('--bg-x', `${currentBgX}px`);
        introBox.style.setProperty('--bg-y', `${currentBgY}px`);

        requestAnimationFrame(animateBrush);
    }

    animateBrush();


//NCS VISUALISER STUFF
const canvas = document.getElementById('ncs-canvas');
let audioCtx, analyser, dataArray, bufferLength;
let isVisualizerSetup = false;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
camera.position.z = 100;

// utilize gpu ts way too heavy
const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    alpha: true, 
    antialias: true,
    powerPreference: "high-performance"
});
renderer.setSize(400, 400);

// OPTIMIZATION 1: Capping pixel ratio 
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

// OPTIMIZATION 2: don't need as much detail dude
const geometry = new THREE.IcosahedronGeometry(25, 1); 

const coreMaterial = new THREE.MeshBasicMaterial({ color:0xC954FF, transparent: true, opacity: 0.3 });
const wireMaterial = new THREE.MeshBasicMaterial({ color: 0xf9f1f0, wireframe: true, transparent: true, opacity: 0.7 });

const coreMesh = new THREE.Mesh(geometry, coreMaterial);
const wireMesh = new THREE.Mesh(geometry, wireMaterial);
scene.add(coreMesh, wireMesh);



// Animation Loop
const drawVisualizer = () => {
    requestAnimationFrame(drawVisualizer);
    if (!isListenVisible) return;
    
    let activeBars = false;
    let bassScale = 1;
    let reactiveRotation = 0.002; 

    // Audio Analysis
    if (isVisualizerSetup && wavesurfer?.isPlaying()) {
        analyser.getByteFrequencyData(dataArray);

        const kickBass = (dataArray[1] + dataArray[2]) / 2;
        
        if (kickBass > 5 && wavesurfer.getVolume() > 0.05) {
            activeBars = true
            const normalizedBass = kickBass / 255;
            const punch = Math.pow(normalizedBass, 4); 
            
            //PUNCH ITS ASS
            bassScale = 1 + (punch * 0.3); 
            
            reactiveRotation = 0.002 + (punch * 0.06); 
        }
    }

    // Sphere Transformation
    const targetScale = new THREE.Vector3(bassScale, bassScale, bassScale);
    
    // DECAY
    wireMesh.scale.lerp(targetScale, 0.15); 
    coreMesh.scale.lerp(targetScale.clone().multiplyScalar(0.95), 0.15);
    
    // Rotation 
    wireMesh.rotation.y += reactiveRotation;
    wireMesh.rotation.x += activeBars ? reactiveRotation * 0.5 : 0; 
    coreMesh.rotation.y += reactiveRotation;

    renderer.render(scene, camera);
};

drawVisualizer();

    // WAVESURFER STUFF
    const waveformContainer = document.getElementById('waveform');
    const masterPlayBtn = document.getElementById('master-play');
    const timeDisplay = document.getElementById('time-display');
    
    
    // NEW: We need a variable to track our fade animation so we can cancel it if they click rapidly
    let fadeInterval;
    
    if (waveformContainer && masterPlayBtn) {
        wavesurfer = WaveSurfer.create({
            container: '#waveform',
            waveColor: 'rgba(255, 255, 255, 0.8)', 
            progressColor: 'rgba(197, 6, 255, 0.93)', 
            barWidth: 3, 
            barGap: 2,
            barRadius: 3,
            cursorWidth: 0, 
            height: 50,
            normalize: true 
        });

        wavesurfer.load('assets/LYA.mp3');
        
        const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
            return `${mins}:${secs}`;
        };

        wavesurfer.on('timeupdate', (currentTime) => {
            if (timeDisplay) {
                timeDisplay.textContent = formatTime(currentTime);
            }
        });

        // Ensure it says 0:00 the second the track fully loads
        wavesurfer.on('ready', () => {
            if (timeDisplay) timeDisplay.textContent = "0:00";
        });

        //global sync for play and pause
        wavesurfer.on('play', () => masterPlayBtn.classList.add('is-playing'));
        wavesurfer.on('pause', () => masterPlayBtn.classList.remove('is-playing'));

        // Add this right above your masterPlayBtn logic
        function wakeUpVisualizer() {
            if (!isVisualizerSetup) {
                const audioElement = wavesurfer.getMediaElement();
                audioElement.crossOrigin = "anonymous"; 
                
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioCtx.createAnalyser();
                
                const source = audioCtx.createMediaElementSource(audioElement);
                source.connect(analyser);
                analyser.connect(audioCtx.destination);
                
                analyser.fftSize = 256; 
                bufferLength = analyser.frequencyBinCount;
                dataArray = new Uint8Array(bufferLength);
                
                isVisualizerSetup = true;
            }
            
            // Always make sure it's awake!
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
        }
        //FADE FAKER
        masterPlayBtn.addEventListener('click', () => {
            wakeUpVisualizer();

            clearInterval(fadeInterval);
            const fadeSteps = 20; 
            const stepTime = 15; 
            
            if (wavesurfer.isPlaying()) {
                let currentVol = wavesurfer.getVolume();
                
                fadeInterval = setInterval(() => {
                    currentVol -= (1 / fadeSteps);
                    
                    if (currentVol <= 0.05) {
                        wavesurfer.setVolume(0);
                        wavesurfer.pause();
                        masterPlayBtn.classList.remove('is-playing');
                        if (timeDisplay) {
                            timeDisplay.classList.remove('is-active-time');
                        }

                        clearInterval(fadeInterval);
                    } else {
                        wavesurfer.setVolume(currentVol);
                    }
                }, stepTime);
                
            } else {
                wavesurfer.setVolume(0);
                wavesurfer.play();
                masterPlayBtn.classList.add('is-playing');

                if (timeDisplay){
                    timeDisplay.classList.add('is-active-time');
                }
                
                let currentVol = 0;
                
                fadeInterval = setInterval(() => {
                    currentVol += (1 / fadeSteps);
                    
                    if (currentVol >= 0.95) { // When it's basically full volume, lock it to 1
                        wavesurfer.setVolume(1);
                        clearInterval(fadeInterval);
                    } else {
                        wavesurfer.setVolume(currentVol);
                    }
                }, stepTime);
            }
        });
    }

});

//scroll throttling - had to use ai for this ffs
let isScrollTicking = false;

window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const introSection = document.querySelector('.intro');
    const introBox = document.getElementById('intro-box');

    // 1. INSTANT EXECUTION: Keep the hero shrink snappy and perfectly responsive
    if (scrollPos > 10) {
        introBox.classList.add('shrunk-box');
        introSection.classList.add('shrunk-section'); 
    } else {
        introBox.classList.remove('shrunk-box');
        introSection.classList.remove('shrunk-section'); 
    }

    // 2. THROTTLED EXECUTION: Save the heavy navigation layout math for the animation frames
    if (!isScrollTicking) {
        window.requestAnimationFrame(() => {
            const navLinks = document.querySelectorAll('.nav-links a');
            const sections = document.querySelectorAll('section');

            let current = "";
            
            // This .offsetTop check is the heavy lifter, so it stays throttled!
            sections.forEach((section) => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute("id");
                }
            });

            navLinks.forEach((link) => {
                link.classList.remove("active");
                const href = link.getAttribute("href");
                // Added a safety check to ensure href exists
                if (href && current && href.includes(current)) {
                    link.classList.add("active");
                }
            });

            // Open the gate for the next frame
            isScrollTicking = false; 
        });
        
        // Close the gate until the frame finishes drawing
        isScrollTicking = true; 
    }
}, { passive: true }); // ADDED: passive:true is a huge free scroll optimization!