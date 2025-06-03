// app/components/StoryPageDisplay.js
'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './StoryPageDisplay.module.css';

// TypewriterEffect component (assuming it's defined above or imported)
// ... (TypewriterEffect component code as provided) ...
function TypewriterEffect({ text, speed, lineBreakPause, startCondition, storyId }) {
    const [displayText, setDisplayText] = useState('');
    const typingTimeoutRef = useRef(null);
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            clearTimeout(typingTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        if (!startCondition || !text) { // If no text, clear display
            setDisplayText('');
            clearTimeout(typingTimeoutRef.current);
            return;
        }
        setDisplayText(''); // Reset display text when props change
        let i = 0;
        const type = () => {
            if (!isMountedRef.current) return;
            if (i < text.length) {
                setDisplayText(prev => prev + (text.charAt(i) === '\n' ? '<br>' : text.charAt(i)));
                i++;
                typingTimeoutRef.current = setTimeout(type, text.charAt(i-1) === '\n' ? lineBreakPause : speed);
            }
        };
        // Simplified start delay logic for typewriter
        const startDelay = 700; // General delay, adjust as needed
        typingTimeoutRef.current = setTimeout(type, startDelay);

        return () => clearTimeout(typingTimeoutRef.current);
    }, [text, speed, lineBreakPause, startCondition, storyId]);

    // Only render the paragraph if there's text to display or it's actively typing
    if (!text && displayText === '') {
        return null;
    }

    return (
        <p
            id={`story-text-display-${storyId}`}
            className={`${styles.storyTextArea} ${(startCondition && text) ? styles.storyTextArea_visible : ''}`}
            dangerouslySetInnerHTML={{ __html: displayText }}
        />
    );
}


export default function StoryPageDisplay({
    storyData,
    startTyping,
    onTriggerStartFlow,
    onNext,
    isLastStory,
    animationClass
}) {
    const [showSecret, setShowStorySecret] = useState(false);
    const [imageVisible, setImageVisible] = useState(false);
    const pageDisplayRef = useRef(null);

    const isProloguePage = storyData?.isPrologue === true;

    useEffect(() => {
        setImageVisible(false); // Reset on component key change (storyData.id)

        if (isProloguePage) {
            // For prologue, no image to load/fade in. Consider "image" aspects ready.
            setImageVisible(true);
            return;
        }

        // For non-prologue pages:
        if (pageDisplayRef.current && storyData.image) {
            const handlePageAnimEnd = () => {
                if (pageDisplayRef.current) { // Check if still mounted
                    setImageVisible(true);
                }
            };
            // If no animation class, or animation is very short, show immediately or after a small delay
            if (!animationClass || animationClass.trim() === 'animate__animated animate__fast') {
                 setTimeout(() => setImageVisible(true), 50); // Small delay for fast animations or no animation
            } else {
                pageDisplayRef.current.addEventListener('animationend', handlePageAnimEnd, { once: true });
            }
            return () => {
                if (pageDisplayRef.current && animationClass && animationClass.trim() !== 'animate__animated animate__fast') {
                    pageDisplayRef.current.removeEventListener('animationend', handlePageAnimEnd);
                }
            };
        } else if (!storyData.image) { // Non-prologue page, but no image defined
            setImageVisible(true);
        }
    }, [animationClass, storyData?.image, storyData?.id, isProloguePage]);

    const toggleSecret = () => setShowStorySecret(prev => !prev);

    if (!storyData) return null;

    return (
        <div ref={pageDisplayRef} className={`${styles.storyPageContainer} ${animationClass || ''}`}>
            <div className={`${styles.storyContentBox} ${isProloguePage ? styles.prologueContentBox : ''}`}>
                {/* Title is always displayed */}
                {storyData.title && <h2 className={styles.storyTitleText}>{storyData.title}</h2>}

                {/* Image: Only for non-prologue pages that have an image */}
                {!isProloguePage && storyData.image && (
                    <Image
                        src={storyData.image}
                        alt={`ความทรงจำ ${storyData.id.replace('story-','')}`}
                        width={450}
                        height={270}
                        className={`${styles.storyImg} ${imageVisible ? styles.storyImg_visible : ''}`}
                        priority={storyData.id === 'story-1'} // Original story-1 is now stories[1]
                        style={{ objectFit: 'cover' }}
                    />
                )}

                {/* Typewriter Text: Only for non-prologue pages, or if prologue has text */}
                {/* If prologue text is "", TypewriterEffect will render nothing if modified as above */}
                <TypewriterEffect
                    text={storyData.text} // Prologue text is ""
                    speed={70}
                    lineBreakPause={300}
                    // For prologue, imageVisible will be true. Start typing its text if startTyping is true.
                    startCondition={startTyping && (isProloguePage || imageVisible)}
                    storyId={storyData.id.replace('story-','')}
                />

                {isProloguePage ? (
                    <button
                        onClick={onTriggerStartFlow}
                        className={`${styles.introActionButton} ${styles.prologueButton} animate__animated animate__pulse animate__infinite`}
                    >
                        เริ่มเรื่องราว...
                    </button>
                ) : (
                    <>
                        {/* Reveal Button Logic */}
                        {storyData.reveal && (
                            <>
                                <button onClick={toggleSecret}
                                        className={`${styles.revealBtn} ${showSecret ? styles.revealBtn_active : ''}`}>
                                    {storyData.reveal.buttonTextPart1 || (storyData.reveal.buttonText ? storyData.reveal.buttonText.split(' ')[0] : 'ดูเพิ่มเติม')}
                                    <span className={styles.revealBtnIcon}>{showSecret ? '🙈' : '💌'}</span>
                                </button>
                                <div className={`${styles.secretContentDiv} ${showSecret ? styles.secretContentDiv_visible : ''}`}
                                     dangerouslySetInnerHTML={{ __html: storyData.reveal.content }} />
                            </>
                        )}

                        {/* Nav Button */}
                        <button
                            onClick={onNext}
                            className={`${styles.introActionButton} ${styles.storyNavBtn}`}
                        >
                            {isLastStory ? 'หน้าถัดไป →' : 'หน้าถัดไป →'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}