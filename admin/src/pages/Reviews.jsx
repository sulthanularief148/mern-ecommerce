import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../lib/apiClient';
import { handleAxiosError } from '../utils/handleAxiosError';

const Stars = ({ rating }) => (
  <span className="text-amber-400 text-sm">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
);

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/reviews/admin/list', { params: { limit: 50 } });
      setReviews(res.data.data.reviews);
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to load reviews'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const removeReview = async (id) => {
    try {
      await api.delete(`/api/reviews/admin/${id}`);
      toast.success('Review removed');
      fetchReviews();
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to remove review'));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-medium">Reviews</p>

      {loading ? (
        <p className="py-8 text-center text-gray-400">Loading…</p>
      ) : reviews.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-soft py-12 text-center text-gray-400">
          No reviews yet.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white border border-gray-100 rounded-2xl shadow-soft p-5 flex items-start gap-4">
              {r.productImage && <img src={r.productImage} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-sm font-medium">{r.productName}</p>
                  <Stars rating={r.rating} />
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{r.customerName} ({r.customerEmail}) · {new Date(r.createdAt).toLocaleDateString()}</p>
                {r.comment && <p className="text-sm text-gray-600 mt-2">{r.comment}</p>}
              </div>
              <button
                onClick={() => removeReview(r.id)}
                className="text-xs text-red-500 hover:underline shrink-0"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
