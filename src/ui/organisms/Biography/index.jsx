"use client";

import "./styles.css";

import { ParagraphText } from "@/atoms/texts";
import { BiographySkeleton } from "./skeletons";
import { useProfile } from "@/hooks";

const Biography = () => {
  const { data: profile, isLoading, isError } = useProfile(1);

  if (isLoading) {
    return (
      <>
        <h2 className="biography-title">biography</h2>
        <BiographySkeleton />
      </>
    );
  }

  if (isError || !profile?.biography) {
    return (
      <>
        <h2 className="biography-title">biography</h2>
        <p>Unable to load biography.</p>
      </>
    );
  }

  return (
    <>
      <h2 className="biography-title">biography</h2>
      {profile.biography.map((row, idx) => (
        <ParagraphText key={idx} text={row} />
      ))}
    </>
  );
};

export default Biography;
