declare module "@storybook/react" {
  export type Meta<T = any> = any;
  export type StoryObj<T = any> = any;
}

declare module "@storybook/test" {
  export const fn: (...args: any[]) => any;
}
