import {
  WwwIcon,
  UnixIcon,
  LinuxIcon,
  BashIcon,
  GitIcon,
  DockerIcon,
  JenkinsIcon,
  TerraformIcon,
  HerokuIcon,
  AwsIcon,
  RubyIcon,
  RailsIcon,
  RSpecIcon,
  CucumberIcon,
  PostgresIcon,
  MongoIcon,
  RedisIcon,
  GraphQLIcon,
  KafkaIcon,
  Html5Icon,
  FigmaIcon,
  StorybookIcon,
  Css3Icon,
  SassIcon,
  TailwindIcon,
  JavaScriptIcon,
  NodeIcon,
  ReactIcon,
  ReduxIcon,
  SvelteIcon,
  NextIcon,
  TypeScriptIcon,
  RustIcon,
  SolidityIcon,
} from "@/atoms/icons/_index";

const icons = {
  www: WwwIcon,

  unix: UnixIcon,
  linux: LinuxIcon,
  bash: BashIcon,
  git: GitIcon,
  docker: DockerIcon,
  jenkins: JenkinsIcon,
  terraform: TerraformIcon,
  heroku: HerokuIcon,
  aws: AwsIcon,

  ruby: RubyIcon,
  rails: RailsIcon,
  rspec: RSpecIcon,
  cucumber: CucumberIcon,

  postgres: PostgresIcon,
  mongo: MongoIcon,
  redis: RedisIcon,
  graphql: GraphQLIcon,
  kafka: KafkaIcon,

  html5: Html5Icon,
  figma: FigmaIcon,
  storybook: StorybookIcon,

  css3: Css3Icon,
  sass: SassIcon,
  tailwind: TailwindIcon,

  javascript: JavaScriptIcon,
  node: NodeIcon,
  react: ReactIcon,
  redux: ReduxIcon,
  svelte: SvelteIcon,
  next: NextIcon,
  typescript: TypeScriptIcon,

  solidity: SolidityIcon,
  rust: RustIcon,
};

export function Icon({ name, className = "" }) {
  const IconComponent = icons[name];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="4rem"
      height="4rem"
      viewBox="-25 -25 180 180"
      className={className}
    >
      <IconComponent />;
    </svg>
  );
}
