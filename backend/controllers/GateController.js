const express = require('express');
const router = express.Router();
const GateService = require('../services/GateService');
const knex = require('../config/database');

router.post('/screen', async (req, res) => {
    try {
        const { embedding, type } = req.body;

        if (!embedding || !type) {
            return res.status(400).json({ message: 'Data scan tidak lengkap' });
        }

        const user = await GateService.identifyUser(embedding);

        if (!user) {
            return res.status(404).json({ message: 'Wajah ga nemu' });
        }

        const activePermission = await GateService.checkActivePermission(user.id);
        const isLate = (currentTime, endTime) => {
            return new Date(currentTime) > new Date(endTime);
        }

        if (type === 'IN') {
            const lastPermission = await knex('permissions')
                .where({ user_id: user.id, status: 'accepted' })
                .orderBy('created_at', 'desc')
                .first();

            if (lastPermission && isLate(new Date(), lastPermission.end_time)) {
                await knex('permissions')
                    .where({ id: lastPermission.id })
                    .update({ status: 'violation', reason: 'Terlambat kembali ke asrama' });

                return res.status(200).json({
                    message: `Selamat datang kembali, tapi Anda terlambat! Status dicatat sebagai Violation.`,
                    status: 'LATE'
                });
            }
        } else if (activePermission) {
            await knex('attendance_logs').insert({
                permission_id: activePermission.id,
                user_id: user.id,
                type: type
            })

            return res.status(200).json({
                message: `Akses diterima. Silakan ${type}, ${user.nama}!`,
                status: 'AUTHORIZED'
            })
        } else {
            const [violation] = await knex('permissions').insert({
                user_id: user.id,
                status: 'violation',
                reason: `Mencoba ${type} tanpa izin resmi di sistem.`,
                start_time: knex.fn.now(),
                end_time: knex.fn.now()
            }).returning('*')

            await knex('attendance_logs').insert({
                permission_id: violation.id,
                user_id: user.id,
                type: type
            });

            return res.status(403).json({
                message: `Akses ditolak! Pelanggaran tercatat atas nama ${user.nama}.`,
                status: 'VIOLATION'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error server' })
    }
})

module.exports = router;
