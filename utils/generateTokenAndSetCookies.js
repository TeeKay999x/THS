import jwt from 'jsonwebtoken'


export const generateTokenAndSetCookies = (res, adminId) => {
    const token = jwt.sign(
        { adminId },
        process.env.JWT_SECRET,
        { expiresIn: '15d' }
    )

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 24 * 60 * 60 * 1000
    }

    res.cookie('token', token, cookieOptions)

    return token
}