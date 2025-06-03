// app/page.js
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';

// Import Child Components (ตรวจสอบ path ให้ถูกต้อง)
import QuizGate from './components/QuizGate';
import StoryFlow from './components/StoryFlow';
import GiftBoxDisplay from './components/GiftBoxDisplay';
import BirthdayCardDisplay from './components/BirthdayCardDisplay';

// --- DATA CONSTANTS ---
const FRIEND_NAME = "หยก";
const YOUR_NAME = "ริเวอร์";

// <<<< ตรวจสอบ Path และชื่อไฟล์เพลงให้ถูกต้อง (รวม .mp3) >>>>
const PRE_QUIZ_AND_QUIZ_SONG = "/audio/song0.mp3";
const INTRO_STORY_SONG = "/audio/song1.mp3";
const GIFT_SONG = "/audio/song2.mp3"; // เพลง/เสียงตอนเปิดกล่อง
const CARD_SONG = "/audio/song3.mp3"; // เพลงสำหรับการ์ด

const storyContentsData = [
    {
        id: 'story-prologue-start',
        title: "การเดินทางกำลังจะเริ่ม...",
        image: null,
        text: `  เอาล่ะ! เรื่องราวความทรงจำระหว่างเรากำลังจะเริ่มต้นขึ้นแล้ว
เตรียมตัวให้พร้อม แล้วกดปุ่มเพื่อย้อนวันวานกันเลย!`,
        isPrologue: true,
        hasMusicButton: true, // Prologue จะมีปุ่มเริ่มเพลง Intro
        reveal: null
    },
    {
        id: 'story-1',
        title: "จุดเริ่มต้นของเรา...",
        image: "/picture/pic1.jpg",
        text: `  ถึงหยกที่น่ารัก

ย้อนกลับไปเมื่อ 2 ปีที่แล้ว ตอนที่เราเป็นเด็กปี 1 ใหม่ๆ
ใครจะคิดว่าเราจะได้รู้จักกันที่สนามแบดของมอ
วันนั้นเราไปเล่นแบดด้วย แล้วหยกมาเมคเฟรน 
เป็นจุดเริ่มต้นของมิตรภาพเรา 🏸😊`,
        reveal: null
    },
    {
        id: 'story-1b',
        title: "วันเวลาที่ผ่านมา...",
        image: "/picture/pic1.jpg", 
        text: `  ตอนนั้นเรายังเรียนปี 1 เหมือนกัน
มีเวลาว่างให้ไปเล่นแบด ไปกินข้าวด้วยกัน
ได้มีโอกาสที่หยกพาไปงานเพลงที่ Central World ไปดู PUN
มันน่าตื่นตาตื่นใจมากๆสำหรับเราได้ใช้ชีวิตในกรุงเทพจริงๆ
ช่วงเวลาเหล่านั้นเป็นช่วงเวลาที่ดีจริงๆ `,
        reveal: null
    },
    {
        id: 'story-2',
        title: "เมื่อเราเดินแยกทาง...",
        image: "/picture/pic2.jpg",
        text: `  แล้วพอขึ้นปี 2 เราก็เริ่มเดินแยกทางกัน
เราเรียนวิทย์คอม ส่วนหยกเรียนเภสัช
ต่างคนก็ต่างมีเส้นทางของตัวเอง
มีการบ้าน มีสอบ มีความยุ่งวุ่นวายของแต่ละสาขา

แม้เราจะไม่ได้เจอกันบ่อยเหมือนเดิม
แต่ทุกครั้งที่ได้เจอกัน มันยังคงเป็นช่วงเวลาที่อบอุ่นเหมือนเดิม`,
        reveal: {
            buttonTextPart1: "มีอะไรอยากบอกเพิ่ม...",
            buttonText: "มีอะไรอยากบอกเพิ่มอีกนิด... 💌",
            content: "<p>จริงๆ แล้วทุกครั้งที่เราได้เจอกัน ริเวอร์จะถ่ายรูปไว้เสมอ<br>เพราะรู้ว่าโอกาสแบบนี้หาได้ยากแล้ว 🤫📸</p><img src='/picture/pic4.jpg' alt='รูปที่ถ่ายไว้' class='secret-image-js' />"
        }
    },
    {
        id: 'story-2b',
        title: "ระยะทางที่ไม่ใช่อุปสรรค...",
        image: "/picture/pic3.jpg",
        text: `  เภสัชเรียนหนักจริงๆ ส่วนวิทย์คอมก็มีโค้ดให้เขียนไม่รู้จบ
แต่ ทุกครั้งที่เราได้คุยกัน ไม่ว่าจะเดินผ่านกัน
หรือมีโอกาสที่เพื่อนชวนไปตีเเบดเเล้วได้เจอกัน
มันทำให้รู้สึกว่าเราไม่ได้ห่างไกลกันเลย`,
        reveal: null
    },
    {
        id: 'story-3',
        title: "ขอบคุณสำหรับทุกอย่าง...",
        image: "/picture/pic3.jpg",
        text: `  และในวันพิเศษของหยกวันนี้...
เราอยากจะบอกว่าขอบคุณมากๆ 
ขอบคุณสำหรับทุกเสียงหัวเราะ ทุกความทรงจำ
และทุกช่วงเวลาที่เราได้ใช้ด้วยกัน

ถึงแม้เราจะไม่ได้เจอกันบ่อยเหมือนเดิม
แต่อยากให้หยกรู้ว่า... เรายังคิดถึงเสมอ 💙`,
        reveal: null
    },
    {
        id: 'story-4',
        title: "...",
        image: null,
        text: `  นานๆ ทีเราถึงจะได้เจอกัน
แต่ทุกครั้งที่เจอ มันยังคงเป็นหยกคนเดิมที่พึ่งพาเเละไว้ใจได้เสมอ`,
        reveal: {
            buttonTextPart1: "ข้อความพิเศษ...",
            buttonText: "ข้อความพิเศษจากใจ... 💝",
            content: "<p style='text-align: center; font-size: 1.1em; color: #ff6b9d;'><br>ขอบคุณทุกความทรงจำดีๆ<br>ขอบคุณมากๆที่เราได้รู้จักกัน<br><br>ขอบคุณจากหัวใจ</p>"
        }
    }
];

const quizQuestionText = `${FRIEND_NAME}ที่ฉันรู้จักเรียน คณะอะไร?`;
const quizOptionsData = [
    { text: "ก. คณะหมูกรอบ", value: "คณะหมูกรอบ" },
    { text: "ข. คณะรักษาความสงบแห่งชาติ", value: "คณะรักษาความสงบแห่งชาติ" },
    { text: "ค. คณะตลก", value: "คณะตลก" },
    { text: "ง. คณะเภสัชศาสตร์", value: "คณะเภสัชศาสตร์" }
];
const quizCorrectAnswerValue = "คณะเภสัชศาสตร์";
const WISH_TEXT = `ขอให้วันเกิดปีนี้เป็นวันที่พิเศษสุดๆ<br>
เต็มไปด้วยความสุข รอยยิ้ม และเสียงหัวเราะนะ<br>
สุขภาพแข็งแรง คิดอะไรก็สมหวัง<br>
ขอให้เจอแต่สิ่งดีๆ คนดีๆ โอกาสดีๆ ในทุกๆ วันของชีวิต<br>
ถ้าเจอเรื่องแย่ๆ ก็ขอให้ผ่านไปไวเหมือนกับตอนไปเที่ยวนะ5555<br>
ขอบคุณที่อยู่ข้างกันเสมอ <br>
อย่าลืมดูแลตัวเองด้วยนะ :)<br>
รักเสมอ❤️`;

// --- END DATA CONSTANTS ---

export default function BirthdayPage() {
    const [currentStage, setCurrentStage] = useState('preQuiz'); // หรือ 'quiz' ถ้าไม่ใช้ preQuiz
    const [giftPageTimeoutId, setGiftPageTimeoutId] = useState(null);
    const [isGiftClicked, setIsGiftClicked] = useState(false);
    const [isGiftBoxOpeningProcess, setIsGiftBoxOpeningProcess] = useState(false);


    const audioRef = useRef(null);
    const router = useRouter();

    const clearGiftTimeout = useCallback(() => {
        if (giftPageTimeoutId) {
            clearTimeout(giftPageTimeoutId);
            setGiftPageTimeoutId(null);
        }
    }, [giftPageTimeoutId]);

    const playMusic = useCallback((newSrc, volume = 0.7, loop = true) => {
        if (audioRef.current) {
            const currentAudioSrcPath = audioRef.current.src ? audioRef.current.src.replace(window.location.origin, '') : null;
            if (currentAudioSrcPath !== newSrc || audioRef.current.paused) {
                console.log(`Audio: Setting src to ${newSrc} and attempting to play (loop: ${loop}).`);
                audioRef.current.src = newSrc;
                audioRef.current.loop = loop;
                audioRef.current.load();
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        audioRef.current.volume = volume;
                        console.log(`Audio: Now playing ${newSrc}`);
                    }).catch(error => {
                        console.warn(`Audio: Autoplay prevented for ${newSrc}:`, error);
                    });
                }
            } else if (currentAudioSrcPath === newSrc) {
                audioRef.current.volume = volume; // Adjust volume if same song is playing
                console.log(`Audio: Adjusted volume for already playing ${newSrc}`);
            }
        }
    }, []);

    const pauseMusic = useCallback(() => {
        if (audioRef.current && !audioRef.current.paused) {
            audioRef.current.pause();
            console.log(`Audio: Paused ${audioRef.current.src}`);
        }
    }, []);

    useEffect(() => {
        console.log("Stage changed to:", currentStage);
        // Music management that happens automatically when a stage loads
        // Excludes music triggered by specific interactions like clicking the gift box
        if (currentStage === 'preQuiz' || currentStage === 'quiz') {
            playMusic(PRE_QUIZ_AND_QUIZ_SONG, 0.6, true);
        } else if (currentStage === 'intro') {
            // If Quiz song was playing and it's different from Intro song, pause it.
            // Intro song itself is started by a button click in StoryFlow/Prologue.
            if (audioRef.current &&
                audioRef.current.src.includes(PRE_QUIZ_AND_QUIZ_SONG.substring(1)) &&
                PRE_QUIZ_AND_QUIZ_SONG !== INTRO_STORY_SONG) {
                pauseMusic();
            }
        } else if (currentStage === 'card') {
            // This logic will play CARD_SONG when card stage is entered
            // It assumes any previous song (like GIFT_SONG) should be stopped.
            if (CARD_SONG) {
                 // Ensure GIFT_SONG is paused if it was playing and is different
                if (GIFT_SONG && audioRef.current && audioRef.current.src.includes(GIFT_SONG.substring(1)) && GIFT_SONG !== CARD_SONG) {
                    pauseMusic();
                }
                playMusic(CARD_SONG, 0.7, true);
            } else if (GIFT_SONG && audioRef.current && audioRef.current.src.includes(GIFT_SONG.substring(1))) {
                // If no CARD_SONG, but GIFT_SONG was playing, continue it or adjust volume
                if(audioRef.current) audioRef.current.volume = 0.5;
            }
            // (Else, if no card song and no gift song, music might have been paused from 'gift' stage)
        }
        // Note: Music for 'gift' stage is handled differently (on click, or silence after intro)

    }, [currentStage, playMusic, pauseMusic]);


    const handleProceedToQuiz = () => setCurrentStage('quiz');
    const handleQuizCorrect = () => setCurrentStage('intro');
    const handleQuizIncorrect = () => { pauseMusic(); router.push('/imposter'); };

    const handleStartStoryMusic = () => { // Called from StoryFlow (e.g., Prologue button)
        console.log("Request to start INTRO_STORY_SONG from StoryFlow");
        playMusic(INTRO_STORY_SONG, 0.7, true);
    };

    const handleAllStoriesDone = () => { // Called when "ไปดูคำอวยพรกัน!" is clicked
        console.log("All stories done. Pausing current music (Intro song) and going to gift stage.");
        pauseMusic(); // <<<< หยุดเพลง Intro ทันที
        setCurrentStage('gift');
        setIsGiftClicked(false);
        setIsGiftBoxOpeningProcess(false); // Reset this state
        const timerId = setTimeout(() => {
            if (!isGiftClicked && currentStage === 'gift') {
                clearGiftTimeout();
                setCurrentStage('card'); // If time's up, go to card (useEffect for 'card' will handle music)
            }
        }, 10000); // 10 seconds timeout for gift interaction
        setGiftPageTimeoutId(timerId);
    };

    const handleGiftBoxInteractionStart = () => { // Called when gift box is clicked
        clearGiftTimeout();
        setIsGiftClicked(true);
        setIsGiftBoxOpeningProcess(true); // To trigger .opened class in GiftBoxDisplay CSS

        console.log("Gift box clicked. Playing GIFT_SONG (if defined).");
        if (GIFT_SONG) {
            playMusic(GIFT_SONG, 0.6, false); // Play gift opening sound/music (non-looping if it's an effect)
        } else {
            // If no specific gift song, ensure other music is paused.
            // (It should have been paused when entering 'gift' stage if INTRO_STORY_SONG was playing)
        }
    };

    const handleGiftAnimationFinished = () => { // Called after CSS animation of gift box opening
        console.log("GiftBoxDisplay reported opening animation finished.");
        // GIFT_SONG (if short effect) might have finished.
        // If GIFT_SONG is a BGM, it might still be playing.
        // The useEffect for currentStage === 'card' will handle CARD_SONG.

        setTimeout(() => {
            if (isGiftClicked) { // Proceed only if user initiated
                setCurrentStage('card');
            }
        }, 500); // Short delay before transitioning to card, allows GIFT_SONG to finish if very short
    };

    useEffect(() => { // Gift timeout cleanup
        if (currentStage !== 'gift') {
            clearGiftTimeout();
        }
        return clearGiftTimeout;
    }, [currentStage, clearGiftTimeout]);

    let pageContent = null;
    // --- RENDER LOGIC ---
    switch (currentStage) {
        case 'preQuiz':
            pageContent = (
                <div className="page-stage-wrapper pre-quiz-wrapper animate__animated animate__fadeIn">
                    <div className="pre-quiz-content-box animate__animated animate__zoomIn">
                        <h1 className="pre-quiz-title">การเดินทางกำลังจะเริ่ม!</h1>
                        <p className="pre-quiz-text">
                            ก่อนที่เราจะดำดิ่งไปในความทรงจำ<br/>
                            มีบททดสอบเล็กๆน้อยๆรออยู่...
                        </p>
                        <p className="pre-quiz-subtext">
                            (แต่ไม่ต้องคิดมาก555555 😉)
                        </p>
                        <button
                            onClick={handleProceedToQuiz}
                            className="pre-quiz-button animate__animated animate__pulse animate__infinite"
                        >
                            เริ่มการทดสอบ! →
                        </button>
                    </div>
                </div>
            );
            break;
        case 'quiz':
            pageContent = (
                <QuizGate
                    question={quizQuestionText}
                    options={quizOptionsData}
                    correctAnswer={quizCorrectAnswerValue}
                    onCorrect={handleQuizCorrect}
                    onIncorrect={handleQuizIncorrect}
                    friendName={FRIEND_NAME}
                    initialAnimation="animate__animated animate__fadeIn"
                />
            );
            break;
        case 'intro':
            pageContent = (
                <StoryFlow
                    stories={storyContentsData}
                    onStartMusic={handleStartStoryMusic}
                    onAllStoriesDone={handleAllStoriesDone}
                    initialAnimationClass="animate__animated animate__fadeIn"
                />
            );
            break;
        case 'gift':
            pageContent = (
                <GiftBoxDisplay
                    onGiftClick={handleGiftBoxInteractionStart}
                    onGiftOpened={handleGiftAnimationFinished}
                    initialAnimation="animate__animated animate__fadeIn"
                    // Pass isOpening prop if GiftBoxDisplay needs to trigger CSS animation via class
                    isOpening={isGiftBoxOpeningProcess}
                />
            );
            break;
        case 'card':
            pageContent = (
                <BirthdayCardDisplay
                    friendName={FRIEND_NAME}
                    yourName={YOUR_NAME}
                    wishText={WISH_TEXT}
                    animationClass="animate__animated animate__fadeIn"
                    cardSpecificAnimation="animate__animated animate__jackInTheBox"
                />
            );
            break;
        default:
            pageContent = <div>Loading...</div>;
    }

    return (
        <>
            <Head>
                <title>สุขสันต์วันเกิดนะหยก!</title>
                <meta name="description" content={`เว็บอวยพรวันเกิดสุดพิเศษสำหรับ ${FRIEND_NAME}`} />
            </Head>
            <audio ref={audioRef} preload="auto" /> {/* loop is now controlled by playMusic */}
            {pageContent}
        </>
    );
}