export const authClient = {
  useSession: () => ({ data: null, isPending: false }),
  signIn: {
    email: jest.fn(),
    social: jest.fn(),
  },
  signUp: {
    email: jest.fn(),
  },
  signOut: jest.fn(),
  getSession: jest.fn(),
};
