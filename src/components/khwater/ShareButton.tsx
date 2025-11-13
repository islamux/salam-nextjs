// Share button component for sharing chapters

'use client';

import { useState } from 'react';

interface ShareButtonProps {
  chapterId: string;
  chapterTitle?: string;
}

export default function ShareButton({ chapterId, chapterTitle }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/khwater/${chapterId}` : '';

  const handleShare = async () => {
    const shareData = {
      title: chapterTitle || `الفصل ${chapterId} - كتاب خواطر`,
      text: `اقرأ الفصل ${chapterId} من كتاب خواطر`,
      url: shareUrl,
    };

    // Try Web Share API first (works on mobile and modern browsers)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        // User cancelled or error occurred
        console.log('Error sharing:', error);
      }
    }

    // Fallback to copying to clipboard
    await copyToClipboard();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      aria-label="مشاركة الفصل"
      title="مشاركة"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
        />
      </svg>
      <span>{copied ? 'تم النسخ!' : 'مشاركة'}</span>
    </button>
  );
}
