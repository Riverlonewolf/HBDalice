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
const FRIEND_NAME = "อลิซ";
const YOUR_NAME = "ริเวอร์";

// <<<< ตรวจสอบ Path และชื่อไฟล์เพลงให้ถูกต้อง (รวม .mp3) >>>>
const PRE_QUIZ_AND_QUIZ_SONG = "/audio/song0.mp3";
const INTRO_STORY_SONG = "/audio/song1.mp3";
const GIFT_SONG = "/audio/song2.mp3"; // เพลง/เสียงตอนเปิดกล่อง
const CARD_SONG = "/audio/song3.mp3"; // เพลงสำหรับการ์ด

const storyContentsData = [
  {
    id: 'story-prologue',
    title: 'Chaperter 0',
    image: '/audio/cafe1.jpg',
    text: `   อลิซ...ยังจำวันนั้นได้ไหม?
       ตอนที่คนชวนไปทะเลบิดไม่ไป แล้วอยู่ดีๆก็
      ได้ไปกันเฉยเลยเป็นวันเดย์ทริปเเบบงงๆ
      เริ่มต้นกันที่ "วันเวลาคาเฟ่ :)`,
    isPrologue: true,
    hasMusicButton: true,
    reveal: null
  },
   {
    id: 'memory-1',
    title: 'Chapter 1: วันเวลาคาเฟ่',
   
    text: `   บรรยากาศในคาเฟ่วันนั้นอบอวลด้วย
    กลิ่นกาแฟและเสียงเพลงเบาๆ`,
    reveal: null,
    music: '/music/story-music.mp3'
  },
   {
    id: 'memory-1.1',
    title: '',
    image: '/picture/cafe0.jpg',
    text: ` `,
    reveal: null,
    music: '/music/story-music.mp3'
  },
  
  {
    id: 'memory-1.5',
    title: '',
    image: '/picture/cafe1.jpg',
    text: `  ตอนเเรกนั่งข้างนอก ไปๆมานั่งข้างในตามกัน
    ได้ใช้เวลากันซักพักถ่ายรูปกินของหวาน`,
    reveal: null,
    music: '/music/story-music.mp3'
  },
   {
    id: 'memory-1.6',
    title: '',
    image: '/picture/cafe2.jpg',
    text: `  `,
    reveal: null,
    music: '/music/story-music.mp3'
  },
  
  {
    id: 'memory-2',
    title: 'Chapter 2: ตลาดน้ำสี่ภาค',
    image: '/picture/market0.jpg',
    reveal: null,
    
  },
  {
    id: 'memory-2.1',
    title: '',
     text: `   หลังจากนั้น เราก็ไปเดินเล่นที่ตลาดน้ำสี่ภาค
เราเดินกันเกือบทุกซุ้ม ถ่ายรูปกันเยอะมาก!`,
    reveal: null,
    music: '/music/story-music.mp3'
  },
   {
    id: 'memory-2.2',
    title: '',
    image: '/picture/market1.jpg',
    reveal: null,
    
  },
   {
    id: 'memory-2.3',
    title: '',
    image: '/picture/market2.jpg',
    reveal: null,
    
  },
  
  {
    id: 'memory-3',
    title: 'Chapter 3: Underwater World ',
    
    text: `  ช่วงบ่าย พวกเราแวะไปที่ Under Water World
รอบตัวเต็มไปด้วยปลาในอุโมงค์แก้ว โคตรสวย :)`,
    reveal: null,
  },
  {
    id: 'memory-3.1',
    title: ' ',
    image: '/picture/underwater1.jpg',
    text: ` `,
    reveal: null,
  },
  {
    id: 'memory-3.1',
    title: ' ',
    image: '/picture/underwater2.jpg',
    text: ` `,
    reveal: null,
  },
  {
    id: 'memory-3.1',
    title: ' ',
    image: '/picture/underwater3.jpg',
    text: ` `,
    reveal: null,
  },
  {
    id: 'memory-3.1',
    title: ' ',
    image: '/picture/underwater4.jpg',
    text: ` `,
    reveal: null,
  },
  {
    id: 'memory-4',
    title: 'Chapter 4: ริมหาดยามเย็น',
    image: '/picture/beach1.jpg',
    text: ` `,
    reveal: null,
    music: '/music/story-music.mp3'
  },
  {
    id: 'memory-4.1',
    title: '',
    image: '',
    text: `  ท้ายที่สุด... เราก็มาถึงริมทะเลยามเย็น
พระอาทิตย์ตกช้าๆ ขอบฟ้าเป็นสีส้มอมชมพู`, 
    reveal: null,
  },
  {
    id: 'memory-4',
    title: '...',
    image: '/picture/beach1.jpg',
    text: `   ฟังเสียงคลื่นซัดไปมา 
    เเล้วก็ได้ใช้เวลาร่วมกันอย่างสนุกสนาน`,
    reveal: null,
  },
   {
    id: 'memory-4',
    title: '...',
    image: '/picture/beach2.jpg',
    text: `  `,
    reveal: null,
  },
   {
    id: 'memory-4',
    title: '...',
    image: '/picture/beach3.jpg',
    text: `  `,
    reveal: null,
  },
];


const quizQuestionText = `อลิซเรียนคณะไรเอ่ย ติ๊กต่อกๆๆ`;
const quizOptionsData = [
    { text: "ก. คณะวิศวกรรมศาสตร์", value: "ตีเเบด" },
    { text: "ข.  คณะบริหารธุรกิจ", value: "คณะบริหารธุรกิจ" },
    { text: "ค. คณะศิลปศาสตร์", value: "คณะศิลปศาสตร์" },
    { text: "ง. คณะวิศวกรรมศาสตร์", value: "คณะวิศวกรรมศาสตร์" }
];
const quizCorrectAnswerValue = "คณะศิลปศาสตร์";
const WISH_TEXT = `ขอให้วันเกิดปีนี้เป็นวันที่พิเศษสุดๆ<br>
เต็มไปด้วยความสุข รอยยิ้ม และเสียงหัวเราะนะ<br>
สุขภาพแข็งแรง คิดอะไรก็สมหวัง<br>
ขอให้เจอแต่สิ่งดีๆ คนดีๆ โอกาสดีๆ ในทุกๆ วันของชีวิต<br>
ถ้าเจอเรื่องแย่ๆ ก็ขอให้ผ่านไปไวเหมือนกับตอนไปเที่ยวนะ55555<br>
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
                <title>สุขสันต์วันเกิดนะ!</title>
                <meta name="description" content={`เว็บอวยพรวันเกิดสุดพิเศษสำหรับ ${FRIEND_NAME}`} />
            </Head>
            <audio ref={audioRef} preload="auto" /> {/* loop is now controlled by playMusic */}
            {pageContent}
        </>
    );
}