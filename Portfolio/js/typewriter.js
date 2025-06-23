document.addEventListener('DOMContentLoaded', function() {
    const phrases = [
        "Full-stack Developer",
        "UI/UX Designer",
        "Problem Solver",
        "Tech Enthusiast",
        "Penetration Tester"
    ];
    const el = document.getElementById("typewriter");
    const cursor = document.querySelector(".typewriter-cursor");
    let phraseIndex = 0;
    let letterIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90; // Adjust typing speed here
    let pause = 1200; // Pause after each phrase

    function type() {
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) {
            el.textContent = currentPhrase.substring(0, letterIndex - 1);
            letterIndex--;
            typingSpeed = 40; // Speed up when deleting
        } else {
            el.textContent = currentPhrase.substring(0, letterIndex + 1);
            letterIndex++;
            typingSpeed = 90; // Normal typing speed
        }

        if (!isDeleting && letterIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = pause; // Pause before deleting
        } else if (isDeleting && letterIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length; // Move to next phrase
            typingSpeed = 400; // Pause before typing next phrase
        }
        setTimeout(type, typingSpeed);
    }

    type();

    // Blinking cursor
    setInterval(() => {
        cursor.style.opacity = cursor.style.opacity === "0" ? "1" : "0";
    }, 500); // Adjust blink speed here
});