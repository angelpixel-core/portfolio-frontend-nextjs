import { Social } from "@/models/_index";
import { SocialLink } from "@/atoms/links/_index";

export async function SocialLinks() {
  return (
    <>
      {await Social.all().then((items) =>
        items.map(({ href, name, styles }, idx) => (
          <SocialLink
            key={idx}
            href={href}
            iconName={name}
            iconClassName={styles}
          />
        ))
      )}
    </>
  );
}
