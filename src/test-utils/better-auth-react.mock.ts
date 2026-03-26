import { authClient } from "./auth-client.mock";

export const createAuthClient = () => authClient;

export const useSession = authClient.useSession;
