'use client';

import { createComment } from '@/app/actions';
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

interface CommentFormProps {
    postId: string;
}

export default function CommentForm({ postId }: CommentFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Math Challenge State
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [challengeSolved, setChallengeSolved] = useState(false);

    useEffect(() => {
        generateChallenge();
    }, []);

    const generateChallenge = () => {
        setNum1(Math.floor(Math.random() * 10));
        setNum2(Math.floor(Math.random() * 10));
        setUserAnswer('');
        setChallengeSolved(false);
    };

    const handleChallengeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setUserAnswer(val);
        if (parseInt(val) === num1 + num2) {
            setChallengeSolved(true);
        } else {
            setChallengeSolved(false);
        }
    };

    const formRef = useRef<HTMLFormElement>(null);



    const handleButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log('Manual button click triggered');

        // Double check client side
        if (parseInt(userAnswer) !== num1 + num2) {
            toast.error('Lütfen güvenlik sorusunu doğru cevaplayınız.');
            return;
        }

        if (!formRef.current) return;

        setIsSubmitting(true);
        const formData = new FormData(formRef.current);

        // Append path for revalidation
        formData.append('path', window.location.pathname);

        try {
            console.log('Calling server action programmatically...');
            const result = await createComment(formData);
            console.log('Server action result:', result);

            if (result?.success) {
                toast.success(result.message);
                // Reset form
                formRef.current.reset();
                generateChallenge();
            } else {
                toast.error(result?.error ?? 'Bir hata oluştu.');
            }
        } catch (error) {
            console.error('Submission error:', error);
            toast.error('Beklenmedik bir hata oluştu.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white border top-gray-200 p-8 rounded-xl shadow-sm mt-12">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Yorum Yap</h3>

            <form ref={formRef} className="space-y-4">
                <input type="hidden" name="postId" value={postId} />

                {/* Honeypot Field - Hidden for users, visible to bots */}
                <div style={{ display: 'none' }}>
                    <label>Website</label>
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            İsim Soyisim <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            placeholder="Adınız"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            E-posta <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            placeholder="mail@ornek.com"
                        />
                        <p className="text-xs text-gray-500 mt-1">E-posta adresiniz yayınlanmayacaktır.</p>
                    </div>
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                        Yorumunuz <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="content"
                        id="content"
                        required
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        placeholder="Düşüncelerinizi paylaşın..."
                    ></textarea>
                </div>

                {/* Math Challenge */}
                <div className={`p-4 rounded-lg flex items-center gap-4 border transition-colors ${challengeSolved ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
                    <div className="flex-1">
                        <label htmlFor="challenge" className="block text-sm font-bold text-gray-900 mb-1">
                            Güvenlik Sorusu: <span className="text-lg font-mono">{num1} + {num2} = ?</span>
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                id="challenge"
                                value={userAnswer}
                                onChange={handleChallengeChange}
                                required
                                className={`w-24 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all ${challengeSolved
                                    ? 'border-green-500 ring-green-500 bg-green-100'
                                    : 'border-blue-200 focus:ring-blue-500'
                                    }`}
                                placeholder="Sonuç"
                            />
                            {challengeSolved && (
                                <span className="text-green-600 font-bold flex items-center gap-1 text-sm animate-in fade-in zoom-in">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Doğru
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 max-w-[200px]">
                        Lütfen işlemi cevaplayın (Spam koruması).
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="button"
                        onClick={handleButtonClick}
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Gönderiliyor...
                            </>
                        ) : (
                            'Yorumu Gönder'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
