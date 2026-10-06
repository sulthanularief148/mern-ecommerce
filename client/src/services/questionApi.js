import { api } from '../lib/apiClient';

export async function fetchQuestions(productId) {
    const res = await api.get(`/api/questions/product/${productId}`);
    return res.data.data.questions;
}

export async function askQuestion(productId, question) {
    const res = await api.post('/api/questions', { productId, question });
    return res.data.data.question;
}
