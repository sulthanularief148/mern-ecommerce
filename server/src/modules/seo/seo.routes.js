import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { generateSitemap } from './seo.service.js';

const router = Router();

router.get('/sitemap.xml', asyncHandler(async (req, res) => {
    const xml = await generateSitemap();
    res.setHeader('Content-Type', 'application/xml');
    res.send(xml);
}));

export default router;
