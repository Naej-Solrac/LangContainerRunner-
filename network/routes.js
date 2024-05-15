import express from 'express';

import exect from '../components/testing/exect_network.js'

const router = express.Router();

router.use('/exect', exect)

module.exports = router;
