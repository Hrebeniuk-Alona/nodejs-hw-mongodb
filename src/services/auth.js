import { UserCollection } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { SessionCollection } from '../db/models/session.js';
import { FIFTEEN_MINUTES, THIRTY_DAYS} from '../constants/index.js';
import { randomBytes } from 'crypto';



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
