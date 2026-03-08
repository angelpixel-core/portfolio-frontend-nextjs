import type { ComponentType } from "react";

import AzureFunctionsIconAsset from "@/atoms/icons/AzureFunctionsIcon/index.svg";
import CiCdIconAsset from "@/atoms/icons/CiCdIcon/index.svg";
import CocoapodsIconAsset from "@/atoms/icons/CocoapodsIcon/index.svg";
import DartIconAsset from "@/atoms/icons/DartIcon/index.svg";
import AWSDynamoDBIconAsset from "@/atoms/icons/AWSDynamoDBIcon/index.svg";
import EventHubIconAsset from "@/atoms/icons/EventHubIcon/index.svg";
import FlipperIconAsset from "@/atoms/icons/FlipperIcon/index.svg";
import FlutterIconAsset from "@/atoms/icons/FlutterIcon/index.svg";
import HotwireIconAsset from "@/atoms/icons/HotwireIcon/index.svg";
import JestIconAsset from "@/atoms/icons/JestIcon/index.svg";
import PusherIconAsset from "@/atoms/icons/PusherIcon/index.svg";
import SidekiqIconAsset from "@/atoms/icons/SidekiqIcon/index.svg";
import StimulusIconAsset from "@/atoms/icons/StimulusIcon/index.svg";
import TwilioIconAsset from "@/atoms/icons/TwilioIcon/index.svg";
import WebhooksIconAsset from "@/atoms/icons/WebhooksIcon/index.svg";
import AWSIcon from "@/atoms/icons/AWSIcon";
import CucumberIcon from "@/atoms/icons/CucumberIcon";
import DockerIcon from "@/atoms/icons/DockerIcon";
import FigmaIcon from "@/atoms/icons/FigmaIcon";
import GitIcon from "@/atoms/icons/GitIcon";
import GraphQLIcon from "@/atoms/icons/GraphQLIcon";
import JenkinsIcon from "@/atoms/icons/JenkinsIcon";
import KafkaIcon from "@/atoms/icons/KafkaIcon";
import LinuxIcon from "@/atoms/icons/LinuxIcon";
import MongoIcon from "@/atoms/icons/MongoIcon";
import NextIcon from "@/atoms/icons/NextIcon";
import NodeIcon from "@/atoms/icons/NodeIcon";
import PostgresIcon from "@/atoms/icons/PostgresIcon";
import QuestionIcon from "@/atoms/icons/QuestionIcon";
import RailsIcon from "@/atoms/icons/RailsIcon";
import ReactIcon from "@/atoms/icons/ReactIcon";
import RedisIcon from "@/atoms/icons/RedisIcon";
import ReduxIcon from "@/atoms/icons/ReduxIcon";
import RubyIcon from "@/atoms/icons/RubyIcon";
import RSpecIcon from "@/atoms/icons/RSpecIcon";
import StorybookIcon from "@/atoms/icons/StorybookIcon";
import TailwindIcon from "@/atoms/icons/TailwindIcon";
import TerraformIcon from "@/atoms/icons/TerraformIcon";
import TypeScriptIcon from "@/atoms/icons/TypeScriptIcon";

type IconAsset = { src: string } | string;

const toAssetSrc = (asset: IconAsset): string =>
  typeof asset === "string" ? asset : asset.src;

export const ICON_COMPONENTS: Record<string, ComponentType> = {
  AWSIcon,
  CucumberIcon,
  DockerIcon,
  FigmaIcon,
  GitIcon,
  GraphQLIcon,
  JenkinsIcon,
  KafkaIcon,
  LinuxIcon,
  MongoIcon,
  NextIcon,
  NodeIcon,
  PostgresIcon,
  PostgreSQLIcon: PostgresIcon,
  QuestionIcon,
  RailsIcon,
  ReactIcon,
  RedisIcon,
  ReduxIcon,
  RubyIcon,
  RSpecIcon,
  StorybookIcon,
  TailwindIcon,
  TerraformIcon,
  TypeScriptIcon,
  DDDIcon: QuestionIcon,
  ViewComponentIcon: QuestionIcon,
};

export const ICON_ASSETS: Record<string, string> = {
  AzureFunctionsIcon: toAssetSrc(AzureFunctionsIconAsset),
  CiCdIcon: toAssetSrc(CiCdIconAsset),
  CocoapodsIcon: toAssetSrc(CocoapodsIconAsset),
  DartIcon: toAssetSrc(DartIconAsset),
  DynamoDBIcon: toAssetSrc(AWSDynamoDBIconAsset),
  EventHubIcon: toAssetSrc(EventHubIconAsset),
  FlipperIcon: toAssetSrc(FlipperIconAsset),
  FlutterIcon: toAssetSrc(FlutterIconAsset),
  HotwireIcon: toAssetSrc(HotwireIconAsset),
  JestIcon: toAssetSrc(JestIconAsset),
  PusherIcon: toAssetSrc(PusherIconAsset),
  SidekiqIcon: toAssetSrc(SidekiqIconAsset),
  StimulusIcon: toAssetSrc(StimulusIconAsset),
  TwilioIcon: toAssetSrc(TwilioIconAsset),
  WebhooksIcon: toAssetSrc(WebhooksIconAsset),
};
