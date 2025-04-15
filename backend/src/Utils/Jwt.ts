import { Request, NextFunction } from "express";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import fs from "fs";
import Config from "../config";
import { MongooseService } from "../mongoDB-setup";
const DB_COLLECTIONS = Config.DB_COLLECTIONS;
const service = new MongooseService();
declare module "express-serve-static-core" {
  interface Request {
    user?: string | JwtPayload;
  }
}

const privateKey = fs.readFileSync(Config.JWT_PRIVATE_KEY_PATH, "utf8");
const publicKey = fs.readFileSync(Config.JWT_PUBLIC_KEY_PATH, "utf8");

export function verifyToken(req: Request, res: any, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization header malformed" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(
      token,
      publicKey,
      { algorithms: ["RS256"] },
      async (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: "Invalid or expired token" });
        }
        const { email, _id, loginCount } = decoded as any;
        req.user = { email, _id };

        const user = await service.findOne(DB_COLLECTIONS.bussinessAccounts, {
          _id,
          loginCount,
        });
        if (!user)
          return res
            .status(400)
            .json({
              msg: "This account has been logged in from another device.",
            });
        next();
      }
    );
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export function generateToken(payload: Record<string, any>): string {
  try {
    const signOptions: SignOptions = {
      algorithm: "RS256",
      expiresIn: "1d",
      keyid: "key-1",
    };

    return jwt.sign(payload, privateKey as jwt.Secret, signOptions);
  } catch (error: any) {
    console.error("Error generating token:", error.message);
    throw new Error("Token generation failed");
  }
}
