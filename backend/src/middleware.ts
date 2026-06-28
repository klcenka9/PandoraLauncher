import { Request, Response, NextFunction } from 'express'
import { verifyToken, getUserById, User } from './auth'

export interface AuthenticatedRequest extends Request {
  userId?: string
  user?: User
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Chybí autentifikační token',
      })
    }

    const decoded = verifyToken(token)

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Neplatný nebo vypršený token',
      })
    }

    const user = await getUserById(decoded.userId)

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Uživatel nenalezen',
      })
    }

    req.userId = decoded.userId
    req.user = user

    next()
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Chyba při ověřování',
    })
  }
}
