import {FastifyReply, FastifyRequest, RouteGenericInterface} from "fastify";
import {server} from '@passwordless-id/webauthn'
import {config} from "../../config";
import {
    RegistrationJSON,
    AuthenticationJSON,
} from "@passwordless-id/webauthn/dist/esm/types";
import {prisma} from "../../db";
import {z} from "zod";
import {tokenizeUser} from "../../helpers/tokenize";

interface RegistrationChecks {
    challenge: string | Function;
    origin: string | Function;
}

interface GenerateRegistrationOptionsRouteGeneric extends RouteGenericInterface {
    Querystring: {
        email: string
    }
}

class MemoryChallengeStore {
    private challenges: string[] = [];

    generateChallenge(): string {
        const challenge = server.randomChallenge();
        this.challenges.push(challenge);

        // Ensure FIFO behavior: Remove the oldest challenge if we exceed 100
        if (this.challenges.length > 100) {
            this.challenges.shift();
        }

        return challenge;
    }

    exists(challenge: string): boolean {
        return this.challenges.includes(challenge);
    }

    remove(challenge: string): void {
        const index = this.challenges.indexOf(challenge);
        if (index !== -1) {
            this.challenges.splice(index, 1);
        }
    }
}

const challengeStore = new MemoryChallengeStore();

const generateMongoId = (): string => {
    const timestamp = Math.floor(Date.now() / 1000).toString(16);
    const randomBytes = [...Array(16)]
        .map(() => Math.floor(Math.random() * 256).toString(16).padStart(2, '0'))
        .join('');

    return timestamp + randomBytes.substring(0, 16);
};

export const generateRegistrationOptions = async (
    req: FastifyRequest<GenerateRegistrationOptionsRouteGeneric>,
    reply: FastifyReply,
) => {
    const email = req.query.email;
    if (!email) throw new Error('No email');

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
        where: {
            email: email,
        },
        select: {
            id: true,
        },
    })

    if (existingUser) throw new Error('User already exists');

    const challenge = challengeStore.generateChallenge();
    return {challenge, userId: generateMongoId()};
}

interface GenerateAuthenticationOptionsRouteGeneric extends RouteGenericInterface {
}

export const generateAuthenticationOptions = async (
    req: FastifyRequest<GenerateAuthenticationOptionsRouteGeneric>,
    reply: FastifyReply,
) => {
    const challenge = challengeStore.generateChallenge();
    return {challenge};
}

interface VerifyRegistrationRouteGeneric extends RouteGenericInterface {
    Body: {
        challenge: string,
        registration:RegistrationJSON
    }
}

export const verifyRegistration = async (
    req: FastifyRequest<VerifyRegistrationRouteGeneric>,
    reply: FastifyReply,
) => {
    const {challenge, registration} = req.body;

    if (!challengeStore.exists(challenge)) throw new Error(`Challenge ${challenge} not found`);

    console.log("config.APP_URL", config.APP_URL);

    const expected: RegistrationChecks = {
        challenge,
        origin: config.APP_URL,
    }

    console.log("registration", registration);
    console.log("expected", expected);

    const id = registration.user.id;
    const email = registration.user.name;
    const fullName = registration.user.displayName;

    console.log("email", email);

    if (!id) throw new Error('No id');
    if (!email) throw new Error('No email');
    if (!fullName) throw new Error('No fullName');


    const existingUser = await prisma.users.findUnique({
        where: {
            email: email,
        },
        select: {
            id: true,
        },
    })

    console.log("existingUser", existingUser);

    if (existingUser) throw new Error('User already exists');


    const registrationParsed = await server.verifyRegistration(registration, expected)

    // TODO: add real account creation

    console.log("registrationParsed", registrationParsed);

    const user = await prisma.users.create({
        data: {
            id,
            email: email,
            roles: [],
            fullName,
            avatar: `https://ui-avatars.com/api/?name=${fullName.replace(' ', '+')}`,
        }
    })

    await prisma.credentials.create({
        data: {
           id: registrationParsed.credential.id,
            algorithm: registrationParsed.credential.algorithm,
            publicKey: registrationParsed.credential.publicKey,
            transports: registrationParsed.credential.transports,
            userId: user.id,
        }
    })

    challengeStore.remove(challenge);

    return {
        // registration can be removed (used only for debug)
        registration: registrationParsed,
        user: {
            id: user.id,
            email: user.email,
            avatar: user.avatar,
            fullName: user.fullName,
            roles: user.roles,
            language: user.language,
            defaultLanguageToLearn: user.defaultLanguageToLearn,
            createdAt: user.createdAt,
        },
        token: tokenizeUser(user)
    };
}

interface VerifyAuthenticationRouteGeneric extends RouteGenericInterface {
    Body: {
        challenge: string,
        authentication:AuthenticationJSON
    }
}

const credentialKeyModel = z.object({
    id: z.string(),
    publicKey: z.string(),
    algorithm: z.enum([ "RS256" ,"EdDSA", "ES256"]),
    transports: z.array(z.enum([ "smart-card", "ble", "hybrid", "internal", "nfc", "usb"])),
})

export const verifyAuthentication = async (
    req: FastifyRequest<VerifyAuthenticationRouteGeneric>,
    reply: FastifyReply,
) => {

    const {challenge, authentication} = req.body;

    if (!challengeStore.exists(challenge)) throw new Error(`Challenge ${challenge} not found`);

    console.log("config.APP_URL", config.APP_URL);

    // const credentialKey = { // obtained from database by looking up `authentication.id`
    //     id: "3924HhJdJMy_svnUowT8eoXrOOO6NLP8SK85q2RPxdU",
    //     publicKey: "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEgyYqQmUAmDn9J7dR5xl-HlyAA0R2XV5sgQRnSGXbLt_xCrEdD1IVvvkyTmRD16y9p3C2O4PTZ0OF_ZYD2JgTVA==",
    //     algorithm: "ES256",
    //     transports: ['internal']
    // } as const

    const credentialKey = await prisma.credentials.findUnique({
        where: {
            id: authentication.id,
        },
        select: {
            id: true,
            publicKey: true,
            algorithm: true,
            transports: true,
        },
    })

    if (!credentialKey) throw new Error('Credential not found');

    const expected = {
        challenge: challenge,
        origin: config.APP_URL,
        userVerified: false,
        // userVerified: true, // should be set if `userVerification` was set to `required` in the authentication options (default)
        // counter: 123 // Optional. You should verify the authenticator "usage" counter increased since last time.
    }

    const parsedCredentialKey = credentialKeyModel.parse(credentialKey)

    const authenticationParsed = await server.verifyAuthentication(
        authentication, parsedCredentialKey, expected);

    console.log("authenticationParsed", authenticationParsed);

    challengeStore.remove(challenge);

    const base64UserId = authenticationParsed.userId;

    if(!base64UserId) throw new Error('No base64 userId');

    const userId = Buffer.from(base64UserId, 'base64').toString('utf8');

    const user = await prisma.users.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            email: true,
            avatar: true,
            fullName: true,
            roles: true,
            language: true,
            defaultLanguageToLearn: true,
            createdAt: true,
        },
    })

    if (!user) throw new Error('User not found');

    return {
        // authentication can be removed (used only for debug)
        authentication: authenticationParsed,
        user: {
            id: user.id,
            email: user.email,
            avatar: user.avatar,
            fullName: user.fullName,
            roles: user.roles,
            language: user.language,
            defaultLanguageToLearn: user.defaultLanguageToLearn,
            createdAt: user.createdAt,
        },
        token: tokenizeUser(user)
    };

}