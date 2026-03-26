declare module "@storybook/react" {
  export type Meta<_T = any> = any;
  export type StoryObj<_T = any> = any;
}

declare module "@storybook/test" {
  export const fn: (..._args: any[]) => any;
}
