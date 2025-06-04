// app/components/QuizGate.js
'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './QuizGate.module.css';

export default function QuizGate({
    question,
    options,
    correctAnswer,
    onCorrect,
    onIncorrect,
    friendName,
    initialAnimation // Prop for initial page animation
}) {
    const [feedback, setFeedback] = useState('');
    const [feedbackType, setFeedbackType] = useState('');
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const quizGateWrapperRef = useRef(null);

    const handleOptionClick = (userAnswer) => {
        if (buttonsDisabled) return;
        setButtonsDisabled(true);
        setShowFeedback(true);

        if (userAnswer === correctAnswer) {
            setFeedback(`สุดยอดคุณเป็นอลิซตัวจริง! ถูกต้อง! 🎉`);
            setFeedbackType(styles.correct);
            setTimeout(() => { if (onCorrect) onCorrect(); }, 1800);
        } else {
            setFeedback("อุ๊ย... ผิดซะแล้ว! คุณคือ...ตัวปลอม!!!");
            setFeedbackType(styles.incorrect);
            setTimeout(() => { if (onIncorrect) onIncorrect(); }, 2000);
        }
    };

    useEffect(() => {
        if (quizGateWrapperRef.current && initialAnimation) {
            const pageElement = quizGateWrapperRef.current;
            const animationClasses = initialAnimation.split(' ').filter(cls => cls.startsWith('animate__'));
            const handlePageAnimEnd = () => {
                animationClasses.forEach(cls => pageElement.classList.remove(cls));
                pageElement.classList.remove('animate__animated');
            };
            pageElement.addEventListener('animationend', handlePageAnimEnd, { once: true });
            return () => { if (pageElement) pageElement.removeEventListener('animationend', handlePageAnimEnd); };
        }
    }, [initialAnimation]);

    return (
        <div ref={quizGateWrapperRef} className={`${styles.quizGateWrapper} ${initialAnimation || ''}`}>
            <div className={`${styles.quizContentBox} animate__animated animate__fadeInUp animate__faster`}> {/* เปลี่ยน animation */}
                <h2 className={styles.quizTitleText}>
                    <span className={styles.quizTitleIcon}></span> {/* Icon (คุณสามารถใส่ SVG หรือ <img> ที่นี่) */}
                    คำถาม ?
                </h2>
                <p className={styles.quizQuestionP}>{question}</p>
                <div className={styles.quizOptionsDiv}>
                    {options.map((option) => (
                        <button
                            key={option.value}
                            className={`${styles.quizOptionBtn} ${buttonsDisabled ? styles.disabled : ''}`}
                            onClick={() => handleOptionClick(option.value)}
                            disabled={buttonsDisabled}
                            aria-label={`ตัวเลือก: ${option.text}`}
                        >
                            {option.text}
                        </button>
                    ))}
                </div>
                {showFeedback && (
                    <p className={`${styles.quizFeedbackP} ${feedbackType} ${styles.visible}`}>
                        {feedback}
                    </p>
                )}
            </div>
        </div>
    );
}