import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import * as reviewApi from '../services/reviewApi';
import * as questionApi from '../services/questionApi';
import { handleAxiosError } from '../../utils/handleAxiosError';
import { toast } from 'react-toastify';
import StarRating from './StarRating';

const SPEC_LABELS = {
    fabric: 'Fabric', fabricComposition: 'Composition', pattern: 'Pattern', color: 'Color',
    occasion: 'Occasion', collectionName: 'Collection', gsm: 'Fabric Weight (GSM)', dimensions: 'Dimensions',
};

const DescriptionReview = ({ productId, description, productData = {} }) => {
    const { user } = useContext(ShopContext);
    const [tab, setTab] = useState('description');
    const specEntries = Object.entries(SPEC_LABELS)
        .filter(([key]) => productData[key])
        .map(([key, label]) => [label, key === 'gsm' ? `${productData[key]} GSM` : productData[key]]);
    const hasDetails = specEntries.length > 0 || productData.careInstructions;
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [questionsLoading, setQuestionsLoading] = useState(true);
    const [newQuestion, setNewQuestion] = useState('');
    const [submittingQuestion, setSubmittingQuestion] = useState(false);

    const loadQuestions = async () => {
        setQuestionsLoading(true);
        try {
            setQuestions(await questionApi.fetchQuestions(productId));
        } catch (error) {
            console.error(error);
        } finally {
            setQuestionsLoading(false);
        }
    };

    useEffect(() => {
        loadQuestions();
    }, [productId]);

    const handleAskQuestion = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to ask a question');
            return;
        }
        if (newQuestion.trim().length < 5) {
            toast.error('Please ask a more complete question');
            return;
        }
        setSubmittingQuestion(true);
        try {
            await questionApi.askQuestion(productId, newQuestion.trim());
            toast.success("Question submitted — we'll notify you once it's answered");
            setNewQuestion('');
        } catch (error) {
            toast.error(handleAxiosError(error, 'Failed to submit question'));
        } finally {
            setSubmittingQuestion(false);
        }
    };

    const loadReviews = async () => {
        setLoading(true);
        try {
            const data = await reviewApi.fetchReviews(productId);
            setReviews(data.reviews);
            setAverageRating(data.averageRating);
            setReviewCount(data.reviewCount);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReviews();
    }, [productId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to leave a review');
            return;
        }
        if (rating === 0) {
            toast.error('Please select a star rating');
            return;
        }
        setSubmitting(true);
        try {
            await reviewApi.submitReview(productId, { rating, comment });
            toast.success('Thanks for your review!');
            setRating(0);
            setComment('');
            await loadReviews();
        } catch (error) {
            toast.error(handleAxiosError(error, 'Failed to submit review'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-20">
            <div className="flex cursor-pointer">
                <strong
                    onClick={() => setTab('description')}
                    className={`border border-gray-300 px-5 py-3 text-sm ${tab === 'description' ? 'bg-gray-50' : 'text-gray-400 font-normal'}`}
                >
                    Description
                </strong>
                {hasDetails && (
                    <p
                        onClick={() => setTab('details')}
                        className={`border border-gray-300 border-l-0 px-5 py-3 text-sm ${tab === 'details' ? 'bg-gray-50 font-semibold text-ink' : 'text-gray-400'}`}
                    >
                        Fabric &amp; Care
                    </p>
                )}
                <p
                    onClick={() => setTab('reviews')}
                    className={`border border-gray-300 border-l-0 px-5 py-3 text-sm ${tab === 'reviews' ? 'bg-gray-50 font-semibold text-ink' : 'text-gray-400'}`}
                >
                    Reviews ({reviewCount})
                </p>
                <p
                    onClick={() => setTab('qa')}
                    className={`border border-gray-300 border-l-0 px-5 py-3 text-sm ${tab === 'qa' ? 'bg-gray-50 font-semibold text-ink' : 'text-gray-400'}`}
                >
                    Q&amp;A ({questions.length})
                </p>
            </div>

            {tab === 'description' && (
                <div className="flex flex-col gap-4 border border-gray-300 border-t-0 px-6 py-6 text-sm text-gray-500">
                    <p>{description}</p>
                </div>
            )}

            {tab === 'details' && (
                <div className="border border-gray-300 border-t-0 px-6 py-6 flex flex-col gap-6 text-sm">
                    {specEntries.length > 0 && (
                        <div>
                            <p className="font-medium text-ink mb-3">Fabric Details</p>
                            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
                                {specEntries.map(([label, value]) => (
                                    <div key={label}>
                                        <dt className="text-xs text-gray-400">{label}</dt>
                                        <dd className="text-gray-700">{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    )}
                    {productData.careInstructions && (
                        <div className={specEntries.length > 0 ? "pt-5 border-t border-gray-100" : ""}>
                            <p className="font-medium text-ink mb-2">Care Instructions</p>
                            <p className="text-gray-500 whitespace-pre-line">{productData.careInstructions}</p>
                        </div>
                    )}
                </div>
            )}

            {tab === 'reviews' && (
                <div className="border border-gray-300 border-t-0 px-6 py-6 flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                        <p className="text-3xl font-medium text-ink">{averageRating || '—'}</p>
                        <div>
                            <StarRating rating={averageRating} />
                            <p className="text-xs text-gray-400 mt-0.5">Based on {reviewCount} review{reviewCount === 1 ? '' : 's'}</p>
                        </div>
                    </div>

                    {loading ? (
                        <p className="text-sm text-gray-400">Loading reviews…</p>
                    ) : reviews.length === 0 ? (
                        <p className="text-sm text-gray-400">No reviews yet — be the first to share your thoughts.</p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {reviews.map((r) => (
                                <div key={r.id} className="border-b border-gray-100 pb-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">{r.authorName}</p>
                                        <p className="text-xs text-gray-400">{new Date(r.createdAt).toDateString()}</p>
                                    </div>
                                    <StarRating rating={r.rating} size="w-3" />
                                    {r.comment && <p className="text-sm text-gray-600 mt-1">{r.comment}</p>}
                                </div>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="border-t border-gray-100 pt-5 flex flex-col gap-3">
                        <p className="text-sm font-medium">Write a review</p>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <svg
                                    key={i}
                                    onClick={() => setRating(i)}
                                    viewBox="0 0 20 20"
                                    className={`w-6 h-6 cursor-pointer ${i <= rating ? 'fill-amber-400' : 'fill-gray-200'}`}
                                >
                                    <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6z" />
                                </svg>
                            ))}
                        </div>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience with this product (optional)"
                            className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none bg-gray-50 focus:border-accent-500 focus:bg-white transition-colors duration-250"
                            rows={3}
                        />
                        <button
                            type="submit"
                            disabled={submitting}
                            className="self-start bg-ink text-white text-sm px-6 py-2 rounded-full hover:bg-accent-600 hover:shadow-soft transition-all duration-250 disabled:opacity-60"
                        >
                            {submitting ? 'Submitting…' : 'Submit Review'}
                        </button>
                        <p className="text-xs text-gray-400">Only customers who purchased this product can leave a review.</p>
                    </form>
                </div>
            )}

            {tab === 'qa' && (
                <div className="border border-gray-300 border-t-0 px-6 py-6 flex flex-col gap-6">
                    {questionsLoading ? (
                        <p className="text-sm text-gray-400">Loading questions…</p>
                    ) : questions.length === 0 ? (
                        <p className="text-sm text-gray-400">No questions yet — be the first to ask.</p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {questions.map((q) => (
                                <div key={q.id} className="border-b border-gray-100 pb-4">
                                    <p className="text-sm font-medium">Q: {q.question}</p>
                                    <p className="text-sm text-gray-600 mt-1">A: {q.answer}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {q.user?.name || 'Customer'} · {new Date(q.answeredAt).toDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleAskQuestion} className="border-t border-gray-100 pt-5 flex flex-col gap-3">
                        <p className="text-sm font-medium">Ask a question</p>
                        <textarea
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder="Ask about sizing, fabric, care, anything else…"
                            className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none bg-gray-50 focus:border-accent-500 focus:bg-white transition-colors duration-250"
                            rows={3}
                        />
                        <button
                            type="submit"
                            disabled={submittingQuestion}
                            className="self-start bg-ink text-white text-sm px-6 py-2 rounded-full hover:bg-accent-600 hover:shadow-soft transition-all duration-250 disabled:opacity-60"
                        >
                            {submittingQuestion ? 'Submitting…' : 'Submit Question'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default DescriptionReview;
