import jwt  from 'jsonwebtoken';
import type {Secret, SignOptions, JwtPayload} from 'jsonwebtoken';


const JWT_SECRET: Secret = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_EXPIRATION: SignOptions = { expiresIn: (process.env.JWT_EXPIRATION as any) || "1h" };

interface UserPayload {
  userId: string;
  username: string
  role: string;
}

export function generateToken(user: UserPayload): string {
  const payload = {
    userId: user.userId,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET, JWT_EXPIRATION);
}


export function authenticateToken(token: string): UserPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (decoded && typeof decoded === 'object' && 'userId' in decoded && 'role' in decoded && 'username' in decoded) {
      return {
        userId: decoded.userId as string,
        username: decoded.username as string,
        role: decoded.role as string
      };
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}
