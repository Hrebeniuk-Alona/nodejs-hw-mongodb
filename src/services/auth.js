import { UserCollection } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { SessionCollection } from '../db/models/session.js';
import { FIFTEEN_MINUTES, SMTP, THIRTY_DAYS, TEMPLATES_DIR} from '../constants/index.js';
import { randomBytes } from 'crypto';
import jwt from "jsonwebtoken";
import { getEnvVar } from '../utils/getEnvVar.js';
import {sendEmail } from '../utils/sendMail.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';


export const registerUser = async (paylod) => {
    const user = await UserCollection.findOne({ email: paylod.email });
    if (user) throw new createHttpError(409, 'Email in use');

    paylod.password = await bcrypt.hash(paylod.password, 10);

    return await UserCollection.create(paylod);
};


export const loginUser = async (paylod) => {
    const user = await UserCollection.findOne({email: paylod.email});
    if (!user) throw new createHttpError(404, 'User not found');

    const isEqual = await bcrypt.compare(paylod.password, user.password);
    if (!isEqual) throw new createHttpError(401, 'Unauthorized');

    await SessionCollection.deleteOne({ userId: user._id });

    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    return await SessionCollection.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
    });

};


export const logoutUser = async (sessionId) => {
    await SessionCollection.deleteOne({ _id: sessionId });
};



const createSession = () => {
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    return {
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS)
    };
};


export const refreshUsersSession = async ({
    sessionId, refreshToken }) => {
    const session = await SessionCollection.findOne({
        _id: sessionId,
        refreshToken
    });

    if (!session) throw new createHttpError(401, 'Session not found');

    const isSessionTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);

    if (isSessionTokenExpired) throw new createHttpError(401, 'Session not found');
    
    const newSession = createSession();

    await SessionCollection.deleteOne({ _id: sessionId, refreshToken });

    return await SessionCollection.create({
        userId: session.userId,
        ...newSession,
    });
};



export const requestResetToken = async (email) => {
    const user = await UserCollection.findOne({ email });
    if (!user) throw createHttpError(404, 'User not found');

    const token = jwt.sign({
        sub: user._id,
        email},
        getEnvVar('JWT_SECRET'),
        { expiresIn: '5m' });
    
    const resetPasswordTemplatePath = path.join(TEMPLATES_DIR, 'reset-password-email.html');

    const templateSource = (
        await fs.readFile(resetPasswordTemplatePath)).toString();
    
    const template = handlebars.compile(templateSource);

    const html = template({
        name: user.name,
        link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${token}`,
    });

    try {
        await sendEmail({
        from: getEnvVar(SMTP.SMTP_FROM),
        to: email,
        subject: 'Reset your password',
        html,
    });
    } catch {
        throw createHttpError(500, "Failed to send the email, please try again later.");
    }
    
};



export const resetPassword = async (paylod) => {
    let entries;

    try {
        entries = jwt.verify(paylod.token, getEnvVar('JWT_SECRET'));
    } catch (err) {
        if (err instanceof Error) throw createHttpError(401, "Token is expired or invalid.");
        throw err;
    }

    const user = await UserCollection.findOne({
        email: entries.email,
        _id: entries.sub,
    });

    if (!user) throw createHttpError(404, 'User not found');

    const encryptedPassword = await bcrypt.hash(paylod.password, 10);

    await UserCollection.updateOne(
        { _id: user.id },
        { password: encryptedPassword }
    );

    await SessionCollection.deleteOne({
        _id: entries.sub,
        email: entries.email
    });

};