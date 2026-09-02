import { Router } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma.js";

export const authRouter = Router();

function signToken(userId: number) {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: "30d" });
}

function publicUser(user: {
  id: number;
  firstName: string;
  lastName: string | null;
  username: string | null;
  photoUrl: string | null;
}) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    photoUrl: user.photoUrl,
  };
}

interface GoogleTokenInfo {
  sub: string;
  aud: string;
  email?: string;
  email_verified?: string;
  given_name?: string;
  family_name?: string;
  name?: string;
  picture?: string;
}

authRouter.post("/google", async (req, res) => {
  const { credential } = req.body as { credential?: string };
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    return res.status(500).json({ error: "Server sozlanmagan: GOOGLE_CLIENT_ID yo'q" });
  }
  if (!credential) {
    return res.status(400).json({ error: "credential yo'q" });
  }

  let info: GoogleTokenInfo;
  try {
    const resp = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
    );
    if (!resp.ok) {
      return res.status(401).json({ error: "Google autentifikatsiya xato: token tekshirilmadi" });
    }
    info = (await resp.json()) as GoogleTokenInfo;
  } catch (e) {
    console.error(e);
    return res.status(502).json({ error: "Google bilan bog'lanib bo'lmadi" });
  }

  if (info.aud !== clientId) {
    return res.status(401).json({ error: "Google autentifikatsiya xato: aud mos kelmadi" });
  }

  const firstName = info.given_name ?? info.name ?? "Foydalanuvchi";

  const user = await prisma.user.upsert({
    where: { googleId: info.sub },
    update: {
      firstName,
      lastName: info.family_name,
      photoUrl: info.picture,
      email: info.email,
    },
    create: {
      googleId: info.sub,
      firstName,
      lastName: info.family_name,
      photoUrl: info.picture,
      email: info.email,
    },
  });

  res.json({ token: signToken(user.id), user: publicUser(user) });
});
