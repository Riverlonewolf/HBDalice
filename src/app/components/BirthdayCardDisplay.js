// app/components/BirthdayCardDisplay.js
'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './BirthdayCardDisplay.module.css';

// Subtle confetti for elegant effect
function createElegantConfetti(container) {
    if (!container || typeof document === 'undefined') return;

    const confetti = document.createElement('div');
    confetti.className = 'elegant-confetti';
    
    // Subtle gold and white particles
    const colors = [
        'rgba(212, 175, 55, 0.8)',  // Elegant gold
        'rgba(255, 255, 255, 0.9)', // Pure white
        'rgba(240, 230, 200, 0.7)'  // Champagne
    ];
    
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = -20 - (Math.random() * 30) + 'px';
    confetti.style.animationDuration = (Math.random() * 5 + 8) + 's'; // Slower, more elegant
    confetti.style.animationDelay = Math.random() * 3 + 's';
    
    const scale = Math.random() * 0.3 + 0.5; // Smaller, more subtle
    confetti.style.transform = `scale(${scale})`;
    confetti.style.zIndex = '5';

    container.appendChild(confetti);

    confetti.addEventListener('animationend', () => {
        confetti.remove();
        if (typeof document !== 'undefined' && document.visibilityState === 'visible' && container.closest(`.${styles.cardWrapper}`)) {
            createElegantConfetti(container);
        }
    });
}

export default function BirthdayCardDisplay({ friendName, yourName, wishText, animationClass, cardSpecificAnimation }) {
    const confettiContainerRef = useRef(null);
    const cardRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 200);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (confettiContainerRef.current && isLoaded) {
            // Clear previous confetti
            while (confettiContainerRef.current.firstChild) {
                confettiContainerRef.current.removeChild(confettiContainerRef.current.firstChild);
            }
            
            // Create subtle confetti
            const numberOfConfetti = 30; // Much fewer for elegance
            for (let i = 0; i < numberOfConfetti; i++) {
                setTimeout(() => {
                    createElegantConfetti(confettiContainerRef.current);
                }, i * 200); // Slower creation
            }
        }
    }, [isLoaded]);

    useEffect(() => {
        if (cardRef.current && cardSpecificAnimation) {
            const cardElement = cardRef.current;
            const animationClasses = cardSpecificAnimation.split(' ').filter(cls => cls.startsWith('animate__'));

            const handleCardAnimEnd = () => {
                animationClasses.forEach(cls => cardElement.classList.remove(cls));
                cardElement.classList.remove('animate__animated');
            };
            
            cardElement.addEventListener('animationend', handleCardAnimEnd, { once: true });
            return () => {
                if (cardElement) {
                    cardElement.removeEventListener('animationend', handleCardAnimEnd);
                }
            };
        }
    }, [cardSpecificAnimation]);

    return (
        <div className={`${styles.elegantCardPageWrapper} ${animationClass || ''} ${isLoaded ? styles.loaded : ''}`}>
            {/* Subtle background pattern */}
            <div className={styles.backgroundPattern}></div>

            {/* Main card */}
            <div ref={cardRef} className={`${styles.elegantCard} ${cardSpecificAnimation || ''}`}>
                {/* Subtle confetti overlay */}
                <div ref={confettiContainerRef} className={styles.confettiContainer}></div>
                
                {/* Card content */}
                <div className={styles.cardContent}>
                    <header className={styles.elegantHeader}>
                        <div className={styles.titleSection}>
                            <h1 className={styles.mainTitle}>Happy Birthday</h1>
                            <div className={styles.decorativeLine}></div>
                            <h2 className={styles.nameTitle}>{friendName}</h2>
                        </div>
                    </header>

                    <main className={styles.elegantBody}>
                        <div className={styles.messageContainer}>
                            <p className={styles.wishMessage} dangerouslySetInnerHTML={{ __html: wishText }} />
                        </div>
                        
                        <div className={styles.signatureContainer}>
                            <div className={styles.signatureLine}></div>
                            <p className={styles.fromSignature}>
                                <span className={styles.withLove}>จาก</span>
                                <span className={styles.senderSignature}>{yourName}</span>
                            </p>
                        </div>
                    </main>

                    <footer className={styles.elegantFooter}>
                        <div className={styles.subtleIcons}>
                            <span>🤍</span>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}