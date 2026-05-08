import React from "react";

import PublicResumeRequestClient from "./PublicResumeRequestClient";

type Params = { params: Promise<{ token: string }> };

export default async function ResumeRequestPublicPage({
  params,
}: Params): Promise<React.JSX.Element> {
  const { token } = await params;

  return <PublicResumeRequestClient token={token} />;
}
