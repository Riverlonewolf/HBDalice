// app/components/StoryFlow.js
'use client';

import { useState, useEffect, useRef } from 'react';
import StoryPageDisplay from './StoryPageDisplay';
import styles from './StoryFlow.module.css';

export default function StoryFlow({
    stories,
    onStartMusic, // This will be called when the "Start Story" button on Prologue is clicked
    onAllStoriesDone,
    initialAnimationClass
}) {
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [startTyping, setStartTyping] = useState(false); // General typing trigger for the current page
    const [previousStoryIndex, setPreviousStoryIndex] = useState(-1);
    const storyFlowWrapperRef = useRef(null);

    const currentStoryData = stories[currentStoryIndex];
    const isPrologue = currentStoryData?.isPrologue === true;

    // Determine animation for StoryPageDisplay
    let storyPageDisplayAnimation = 'animate__animated animate__fast ';
    if (currentStoryIndex === 0 && isPrologue) { // Special animation for prologue entrance
        storyPageDisplayAnimation += 'animate__fadeIn'; // Or 'animate__zoomIn'
    } else if (currentStoryIndex > previousStoryIndex) {
        storyPageDisplayAnimation += 'animate__fadeInRight';
    } else if (currentStoryIndex < previousStoryIndex) {
        storyPageDisplayAnimation += 'animate__fadeInLeft';
    } else { // Fallback or first non-prologue page
        storyPageDisplayAnimation += (currentStoryIndex === 0 ? 'animate__zoomIn' : 'animate__fadeIn');
    }

    const handleNext = () => {
        setStartTyping(false); // Stop/reset typing for the new page
        setPreviousStoryIndex(currentStoryIndex);

        if (currentStoryIndex < stories.length - 1) {
            setCurrentStoryIndex(prev => prev + 1);
        } else {
            if (onAllStoriesDone) {
                onAllStoriesDone();
            }
        }
    };

    // This is the callback for the "Start Story" button on the Prologue page
    // or the "Initial Play Button" if the first story is not a prologue
    const handleTriggerStart = () => {
        if (onStartMusic) {
            onStartMusic(); // Play the main story music
        }
        if (isPrologue) {
            // If it was prologue, clicking "Start Story" button moves to the next actual story page
            handleNext(); // This will advance to stories[1]
        } else {
            // If the first story itself had a play button (not prologue case)
            setStartTyping(true); // Start typing for the current (first) story
        }
    };


    // Effect to trigger typing when the story changes and it's not the prologue waiting for button
    useEffect(() => {
        if (currentStoryData) { // Ensure currentStoryData is available
            if (!isPrologue) { // For regular story pages, start typing after a delay
                const pageTransitionDelay = 500; // Corresponds to animate__fast
                const typingTimer = setTimeout(() => {
                    setStartTyping(true);
                }, pageTransitionDelay);
                return () => clearTimeout(typingTimer);
            } else {
                // For prologue, typing might start immediately or wait for page animation
                // Let's assume prologue text also types out after page appears
                 const pageTransitionDelay = 500;
                 const typingTimer = setTimeout(() => {
                    setStartTyping(true);
                }, pageTransitionDelay);
                return () => clearTimeout(typingTimer);
            }
        }
    }, [currentStoryIndex, isPrologue, currentStoryData]);


    // Effect for wrapper animation cleanup
    useEffect(() => {
        // ... (เหมือนเดิม) ...
    }, [initialAnimationClass]);


    if (!currentStoryData) {
        return <div>Loading stories...</div>;
    }

    return (
        <div ref={storyFlowWrapperRef} className={`${styles.storyFlowWrapper} ${initialAnimationClass || ''}`}>
            <StoryPageDisplay
                key={currentStoryData.id}
                storyData={currentStoryData}
                startTyping={startTyping}
                onTriggerStartFlow={handleTriggerStart} // For Prologue's "Start Story" or first page's play button
                onNext={handleNext}
                isLastStory={currentStoryIndex === stories.length - 1 && !isPrologue}
                animationClass={storyPageDisplayAnimation}
            />
        </div>
    );
}