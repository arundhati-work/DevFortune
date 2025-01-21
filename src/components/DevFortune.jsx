import {useState, useEffect} from 'react';
import { Share2, XCircle } from 'lucide-react';

function DevFortune(){

    const fortunes = [
        {
            text: "Mercury is in retrograde. Double-check your git commits and maybe... triple-check those production deploys.",
            luckyLanguage: "Python",
            luckyTool: "VS Code"
        },
        {
            text: "The stars align for fixing that bug that's been in your backlog for months. Coffee is your lucky charm today.",
            luckyLanguage: "JavaScript",
            luckyTool: "Chrome DevTools"
        },
        {
            text: "Your code review karma is strong. Expect surprisingly positive feedback on that PR you've been nervous about.",
            luckyLanguage: "TypeScript",
            luckyTool: "ESLint"
        },
        {
            text: "A mysterious bug will appear, but fear not - the solution will come to you during your coffee break.",
            luckyLanguage: "Java",
            luckyTool: "IntelliJ"
        },
        {
            text: "Your debugging skills are heightened today. That console.log you placed randomly? It'll actually be useful.",
            luckyLanguage: "Ruby",
            luckyTool: "Terminal"
        }
    ]

    const skepticMessages = [
        "But what does the compiler know about astrology anyway?",
        "404: Scientific evidence not found",
        "Are we really trusting cosmic bits and bytes?",
        "This fortune was definitely NOT peer-reviewed",
        "The stars must be using legacy code..."
    ];

    const [fortune, setFortune] = useState(null);
    const [isRevealing, setIsRevealing] = useState(false);
    const [nextFortuneTime, setNextFortuneTime] = useState(null);
    const [shareTooltip, setShareTooltip] = useState('');
    const [showSkepticism, setShowSkepticism] = useState(false);

    const shareFortune = async () => {
        if (!fortune) return;

        const shareMessage = `🔮 My dev horoscope says: ${fortune.text}\nIf I code in ${fortune.luckyLanguage} using ${fortune.luckyTool} today, the bugs shall fear me!`;

        try{
            await navigator.clipboard.writeText(shareMessage);
            setShareTooltip('Copied to clipboard! ✨');
            setTimeout(() => setShareTooltip(''), 2000);
        } catch(err){
            setShareTooltip('Failed to copy 😅');
            setTimeout(() => setShareTooltip(''), 2000);
        }
    }

    useEffect(() => {
        const checkStoredFortune = () => {
            const stored = localStorage.getItem('devFortune');
            if (stored){
                const {fortune: storedFortune, timestamp} = JSON.parse(stored);
                const now = new Date();
                const fortuneDate = new Date(timestamp);

                if (fortuneDate.toDateString() === now.toDateString()){
                    setFortune(storedFortune);
                    const tomorrow = new Date(now);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    tomorrow.setHours(0, 0, 0, 0);
                    setNextFortuneTime(tomorrow);
                    return true;
                }
            }
            return false;
        }

        checkStoredFortune();

    }, []);

    const getFortune = () => {
        setIsRevealing(true);
        setFortune(null);
        setShowSkepticism(false);

        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * fortunes.length);
            const newFortune = fortunes[randomIndex];
            setFortune(newFortune);
            setIsRevealing(false);

            const now = new Date();
            localStorage.setItem('devFortune', JSON.stringify({
                fortune: newFortune,
                timestamp: now.toISOString()
            }));

            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            setNextFortuneTime(tomorrow);
        }, 1500);
        //console.log("Getting fortune...");
    }

    const getTimeUntilNext = () => {
        if (!nextFortuneTime) return '';
        const now = new Date();
        const diff = nextFortuneTime - now;
        const hours = Math.floor(diff / (1000*60*60));
        const minutes = Math.floor((diff % (1000*60*60)) / (1000 * 60));
        //console.log(hours+" "+minutes);
        return `Next fortune in: ${hours}h ${minutes}m`;
    }

    const toggleSkepticism = () => {
        setShowSkepticism(!showSkepticism);
    }

    return(
        <div className='max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden'>
            <div className='p-8'>
                <div className='text-center min-h-[100px]'>
                    {
                        isRevealing? (
                            <p className='text-gray-500 animate-pulse'>
                                Consulting the debug logs...
                            </p>
                        ) : fortune? (
                            <div className='space-y-4'>
                                <p className="text-gray-700">{fortune.text}</p>
                                <div className='text-sm text-gray-600'>
                                    <p>🍀 Lucky Language: {fortune.luckyLanguage}</p>
                                    <p>⚙️ Lucky Tool: {fortune.luckyTool}</p>
                                    
                                </div>
                                {
                                        showSkepticism && (
                                            <p className='text-purple-400 italic text-sm text-center mt-4'>
                                                {skepticMessages[Math.floor(Math.random() * skepticMessages.length)]}
                                            </p>
                                        )
                                    }
                            </div>
                        ) : (
                            <p className='text-gray-500 italic'>
                                Your cosmic code fortune awaits...
                            </p>
                        )
                    }
                </div>
                {
                    nextFortuneTime && (
                        <p className='text-sm text-center text-gray-500 mt-4'>
                            {getTimeUntilNext()}
                        </p>
                    )
                }

                <div className='relative flex items-center gap-2 mt-6'>
                    <button onClick={getFortune} disabled={isRevealing || (nextFortuneTime && new Date() < nextFortuneTime)} className='w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50'>
                        {isRevealing? "Consulting..." : "Reveal My Fortune"}
                    </button>

                    { fortune && (
                        <div className='relative'>
                            <button onClick={shareFortune}
                            className='bg-purple-100 text-purple-600 p-2 rounded-lg hover:bg-purple-200 transition-colors'
                            title="Share Fortune">
                                <Share2 size={20}/>
                            </button>
                            {shareTooltip && (
                                <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap'>
                                    {shareTooltip}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {
                    fortune && (
                        <button
                            onClick={toggleSkepticism}
                            className='mt-4 w-full text-gray-500 text-sm hover:text-gray-700 transition-colors flex items-center justify-center gap-2'>
                                <XCircle size={16} />
                                {showSkepticism ? "Hide Skepticism" : "Doubt the Fortune"}
                            </button>
                    )
                }
            </div>
        </div>
    )
}

export default DevFortune;