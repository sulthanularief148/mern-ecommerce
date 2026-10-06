import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function uniqueReferralCode() {
    for (let attempt = 0; attempt < 5; attempt++) {
        const code = crypto.randomBytes(4).toString('hex').toUpperCase();
        const existing = await prisma.user.findUnique({ where: { referralCode: code } });
        if (!existing) return code;
    }
    throw new Error('Failed to generate a unique referral code');
}

async function main() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        console.error('ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin seed');
        return;
    }

    // ADMIN_EMAIL is the store owner's own account — it always gets
    // SUPER_ADMIN (full control, including managing other admins). Every
    // admin created afterwards via the admin panel's "promote" action gets
    // plain ADMIN instead; SUPER_ADMIN is never granted through the UI.
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        if (existing.role !== 'SUPER_ADMIN') {
            await prisma.user.update({ where: { email }, data: { role: 'SUPER_ADMIN' } });
            console.log(`Promoted existing user ${email} to SUPER_ADMIN`);
        } else {
            console.log(`Super admin ${email} already exists`);
        }
        return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const referralCode = await uniqueReferralCode();
    await prisma.user.create({
        data: { name: 'Admin', email, password: passwordHash, role: 'SUPER_ADMIN', referralCode },
    });
    console.log(`Created super admin user ${email}`);
}

main()
    .catch((err) => {
        console.error('Seed failed:', err);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
