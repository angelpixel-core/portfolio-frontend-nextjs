import "./styles.css";

import { ExtraInfo } from "@/molecules/about/_index";

import { fetchExtras } from "@/lib/data/_index";

export async function Extras() {
  const extras = await fetchExtras({
    email: process.env.PROFILE_EMAIL,
  });

  const ExtrasContent = () => {
    return (
      <>
        {extras.map(({ number, subtitle }, index) => (
          <ExtraInfo key={index} number={number} subtitle={subtitle} />
        ))}
      </>
    );
  };

  return (
    <div className="extras-container">
      <ExtrasContent />
    </div>
  );
}
