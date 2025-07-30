import express from 'express';
import { login, register, getMyProfile, logout } from '../controllers/user.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// router.get('/all', getAllUsers)

router.post('/new', register)

router.post('/login', login)

router.get('/logout', isAuthenticated, logout)

router.get('/me', isAuthenticated, getMyProfile)

export default router;


// -------------------------------------------------------///



// router.get('/userid/:id', getUserDetails)

// router.put('/userid/:id', updateUser)

// router.delete('/userid/:id', deleteUser)

// router.route('/userid/:id')
//         .get(getUserDetails)
        // .put(updateUser)
        // .delete(deleteUser)