// app/components/GiftBoxDisplay.js
'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './GiftBoxDisplay.module.css'; // Import CSS Module

export default function GiftBoxDisplay({ onGiftClick, onGiftOpened, initialAnimation }) {
    const [isBoxOpening, setIsBoxOpening] = useState(false); // To track if the opening process has started
    const giftLidRef = useRef(null);
    const giftBoxPageRef = useRef(null); // Ref for the main page wrapper

    const handleBoxClick = () => {
        if (!isBoxOpening) {
            setIsBoxOpening(true); // This will add the 'opened' class via className logic below
            if (onGiftClick) {
                onGiftClick(); // Notify parent (page.js) that interaction has started (to clear timeout)
            }
        }
    };

    useEffect(() => {
        // This effect listens for the end of the CSS animation on the lid
        if (isBoxOpening && giftLidRef.current) {
            const lidElement = giftLidRef.current;
            const handleLidAnimationEnd = () => {
                console.log("Gift lid CSS animation finished.");
                if (onGiftOpened) {
                    onGiftOpened(); // Notify parent (page.js) that the opening animation is complete
                }
            };
            lidElement.addEventListener('animationend', handleLidAnimationEnd, { once: true });
            return () => {
                if (lidElement) { // Check if element still exists during cleanup
                    lidElement.removeEventListener('animationend', handleLidAnimationEnd);
                }
            };
        }
    }, [isBoxOpening, onGiftOpened]); // Rerun if isBoxOpening changes

    // Effect to remove Animate.css classes from the page wrapper after its animation ends
    useEffect(() => {
        if (giftBoxPageRef.current && initialAnimation) {
            const pageElement = giftBoxPageRef.current;
            const animationClasses = initialAnimation.split(' ').filter(cls => cls.startsWith('animate__'));

            const handlePageAnimEnd = () => {
                animationClasses.forEach(cls => pageElement.classList.remove(cls));
                pageElement.classList.remove('animate__animated'); // Remove base class too
            };
            pageElement.addEventListener('animationend', handlePageAnimEnd, { once: true });
            return () => {
                if (pageElement) {
                    pageElement.removeEventListener('animationend', handlePageAnimEnd);
                }
            };
        }
    }, [initialAnimation]);

    return (
        <div ref={giftBoxPageRef} className={`${styles.giftBoxPageWrapper} ${initialAnimation || ''}`}>
            <div className={styles.giftContainer}>
                <p className={styles.giftInstruction}>คลิกที่กล่องเพื่อเปิดของขวัญสิ!</p>
                <div
                    id="clickableGiftBoxComponent" // Added an ID for easier selection if needed
                    className={`${styles.giftBoxClickable} ${isBoxOpening ? styles.opened : ''}`}
                    onClick={handleBoxClick}
                    role="button" // For accessibility
                    tabIndex={0} // For accessibility
                    onKeyPress={(e) => e.key === 'Enter' && handleBoxClick()} // For accessibility
                >
                    <div className={styles.giftLidElement} ref={giftLidRef}>
                        <div className={`${styles.giftRibbon} ${styles.topLeft}`}></div>
                        <div className={`${styles.giftRibbon} ${styles.topRight}`}></div>
                        <div className={styles.giftBowElement}>
                            <div className={`${styles.giftBowLoop} ${styles.left}`}></div>
                            <div className={`${styles.giftBowLoop} ${styles.right}`}></div>
                            <div className={styles.giftBowCenterKnot}></div>
                        </div>
                    </div>
                    <div className={styles.giftBaseElement}>
                        <div className={`${styles.giftRibbon} ${styles.sideLeft}`}></div>
                        <div className={`${styles.giftRibbon} ${styles.sideRight}`}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}