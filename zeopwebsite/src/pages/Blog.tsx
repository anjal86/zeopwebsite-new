import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Import Link
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import PageHeader from '../components/PageHeader/PageHeader';
import SEO from '../components/SEO/SEO';
import { useApi } from '../hooks/useApi';
import { createBlogListSchema, createBreadcrumbSchema } from '../utils/schema';
import LoadingSpinner from '../components/UI/LoadingSpinner';

interface BlogPost {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    image: string;
    author: string;
    date: string;
    readTime: string;
    category: string;
}

const BlogPage: React.FC = () => {
    const { data: posts, loading, error } = useApi<BlogPost[]>('/api/posts');
    const [selectedCategory, setSelectedCategory] = React.useState('All');

    const structuredData = useMemo(() => {
        if (!posts) return [];
        return [
            createBlogListSchema(posts.map(post => ({
                title: post.title,
                url: `https://zeotourism.com/blog/${post.slug}`,
                date: post.date
            }))),
            createBreadcrumbSchema([
                { name: "Home", url: "https://zeotourism.com" },
                { name: "Blog", url: "https://zeotourism.com/blog" }
            ])
        ];
    }, [posts]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error || !posts) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                Failed to load blog posts. Please try again later.
            </div>
        )
    }

    const categories = ['All', ...new Set(posts.map(post => post.category))];
    const filteredPosts = selectedCategory === 'All'
        ? posts
        : posts.filter(post => post.category === selectedCategory);

    return (
        <div className="blog-page-container">
            <SEO
                title="Travel Blog & Guides - Zeo Tourism"
                description="Explore our latest travel guides, tips, and stories about trekking in Nepal, Kailash Mansarovar Yatra, and spiritual journeys."
                keywords="travel blog, nepal travel guide, kailash mansarovar tips, trekking blog"
                url="https://zeotourism.com/blog"
                type="website"
                structuredData={structuredData}
            />

            <div className="blog-page bg-white">
                <PageHeader
                    title="Travel Stories & Guides"
                    subtitle="Inspiration and practical advice for your next adventure in the Himalayas."
                    breadcrumb="Blog"
                    backgroundImage="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2070"
                />

                {/* Category Filter */}
                <section className="py-20 lg:py-24">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col items-center mb-16">
                            <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4">Discover Content</span>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-10 text-center">
                                Browse by <span className="text-gradient">Categories</span>
                            </h2>
                            <div className="flex flex-wrap justify-center gap-3">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-8 py-3 rounded-none text-sm font-bold transition-all duration-300 ${selectedCategory === cat
                                            ? 'bg-primary text-white shadow-xl shadow-primary/25 scale-105'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Posts Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {filteredPosts.map((post, index) => (
                                <motion.article
                                    key={post.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group flex flex-col h-full bg-white rounded-none overflow-hidden border border-gray-100/50 hover:border-primary/20 hover:shadow-2xl transition-all duration-500"
                                >
                                    <Link to={`/blog/${post.slug}`} className="relative h-64 overflow-hidden block">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute bottom-4 left-4">
                                            <span className="bg-white/90 backdrop-blur-md text-gray-900 px-4 py-1.5 rounded-none text-xs font-bold shadow-lg">
                                                {post.category}
                                            </span>
                                        </div>
                                    </Link>

                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 mb-5 tracking-wide">
                                            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
                                        </div>

                                        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors leading-tight">
                                            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                                        </h3>

                                        <p className="text-gray-600 mb-8 line-clamp-3 leading-relaxed">
                                            {post.excerpt}
                                        </p>

                                        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-end">
                                            <Link
                                                to={`/blog/${post.slug}`}
                                                className="text-primary font-bold text-sm inline-flex items-center group/btn"
                                            >
                                                Read More
                                                <ArrowRight className="w-4 h-4 ml-1.5 transform group-hover/btn:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </div>

                        {filteredPosts.length === 0 && (
                            <div className="text-center py-20 bg-gray-50 rounded-none border-2 border-dashed border-gray-200">
                                <p className="text-gray-500 text-lg font-medium">No posts found in this category.</p>
                                <button
                                    onClick={() => setSelectedCategory('All')}
                                    className="mt-4 text-primary font-bold hover:underline"
                                >
                                    Show all posts
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default BlogPage;
