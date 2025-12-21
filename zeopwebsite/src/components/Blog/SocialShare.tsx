import React from 'react';
import { Facebook, Twitter, Linkedin, Link as LinkIcon, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

interface SocialShareProps {
    url: string;
    title: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ url, title }) => {
    const shareLinks = [
        {
            name: 'Facebook',
            icon: Facebook,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            color: 'bg-[#1877F2]'
        },
        {
            name: 'Twitter',
            icon: Twitter,
            url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
            color: 'bg-[#1DA1F2]'
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
            color: 'bg-[#0A66C2]'
        },
        {
            name: 'WhatsApp',
            icon: Phone, // Lucide doesn't have WhatsApp, using Phone or similar. Or check if MessageCircle exists.
            url: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
            color: 'bg-[#25D366]'
        }
    ];

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy details: ', err);
        }
    };

    return (
        <div className="flex items-center space-x-4">
            <span className="text-gray-600 font-medium">Share:</span>
            <div className="flex space-x-2">
                {shareLinks.map((link) => (
                    <motion.a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -2 }}
                        className={`${link.color} text-white p-2 rounded-full hover:shadow-lg transition-all duration-300`}
                        aria-label={`Share on ${link.name}`}
                    >
                        <link.icon className="w-4 h-4" />
                    </motion.a>
                ))}
                <motion.button
                    onClick={handleCopyLink}
                    whileHover={{ y: -2 }}
                    className="bg-gray-600 text-white p-2 rounded-full hover:shadow-lg transition-all duration-300"
                    aria-label="Copy Link"
                >
                    <LinkIcon className="w-4 h-4" />
                </motion.button>
            </div>
        </div>
    );
};

export default SocialShare;
