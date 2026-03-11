import jwt from 'jsonwebtoken';
import { config } from '../config';
import {UserRole, users} from "@prisma/client";
import dayjs from "dayjs";

const issuer = `api.lexidrift.com`;
const jwtKey = config.JWT_SECRET;

type UserProjection = Pick<users, 'id' | 'email' | 'roles'>;

export interface JWTPayload {
  sub: string,
  email: string,
  iss: string,
  exp: number
  roles: string[]
}

function tokenPayload(user: UserProjection): JWTPayload {
  return {
    sub: user.id,
    email: user.email,
    iss: issuer,
    roles: user.roles,
    exp: dayjs().add(1, 'month').unix()
  };
}

export function tokenizeUser(user: UserProjection): string {
  return jwt.sign(tokenPayload(user), jwtKey);
}

export function verifyToken(token: string):  UserProjection {
  const payload = jwt.verify(token, jwtKey) as  JWTPayload;

  return {
    id: payload.sub,
    email: payload.email,
    roles: payload.roles as UserRole[]
  }
}
