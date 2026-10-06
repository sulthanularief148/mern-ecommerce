import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../lib/apiClient';
import { handleAxiosError } from '../utils/handleAxiosError';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState({});
  const [submitting, setSubmitting] = useState(null);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/questions/admin/list');
      setQuestions(res.data.data.questions || []);
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to load questions'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuestions(); }, []);

  const submitAnswer = async (id) => {
    const answer = (drafts[id] || '').trim();
    if (!answer) {
      toast.error('Enter an answer first');
      return;
    }
    setSubmitting(id);
    try {
      await api.patch(`/api/questions/admin/${id}`, { answer });
      toast.success('Answer submitted');
      fetchQuestions();
    } catch (error) {
      toast.error(handleAxiosError(error, 'Failed to submit answer'));
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) return <div className="py-16 text-center text-gray-400">Loading questions…</div>;
  if (!questions.length) return <div className="py-16 text-center text-gray-400">No questions yet.</div>;

  const pending = questions.filter((q) => !q.answer);
  const answered = questions.filter((q) => q.answer);

  return (
    <div className="flex flex-col gap-6">
      <p className="text-lg font-medium">Product Questions</p>

      {pending.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-amber-600">Pending ({pending.length})</p>
          {pending.map((q) => (
            <div key={q.id} className="border border-gray-100 p-5 rounded-2xl shadow-soft bg-white flex flex-col gap-3">
              <div className="flex items-center gap-3">
                {q.product?.images?.[0] && <img src={q.product.images[0]} className="w-10 h-10 object-cover rounded-lg" alt="" />}
                <div>
                  <p className="text-sm font-medium">{q.product?.name}</p>
                  <p className="text-xs text-gray-400">{q.user?.name} · {q.user?.email}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700">{q.question}</p>
              <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-50">
                <input
                  type="text"
                  value={drafts[q.id] || ''}
                  onChange={(e) => setDrafts((prev) => ({ ...prev, [q.id]: e.target.value }))}
                  placeholder="Write an answer…"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-accent-500 outline-none text-xs"
                />
                <button
                  type="button"
                  onClick={() => submitAnswer(q.id)}
                  disabled={submitting === q.id}
                  className="text-xs px-4 py-2 bg-ink text-white rounded-full hover:bg-accent-600 transition-colors duration-250 disabled:opacity-60 shrink-0"
                >
                  {submitting === q.id ? 'Submitting…' : 'Submit Answer'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {answered.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-gray-500">Answered ({answered.length})</p>
          {answered.map((q) => (
            <div key={q.id} className="border border-gray-100 p-5 rounded-2xl shadow-soft bg-white flex flex-col gap-1">
              <p className="text-xs text-gray-400">{q.product?.name}</p>
              <p className="text-sm font-medium">Q: {q.question}</p>
              <p className="text-sm text-gray-600">A: {q.answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Questions;
