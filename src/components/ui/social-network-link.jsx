import { motion } from "framer-motion";

export default function SocialNetworkLink({
  children,
  href = "#",
  target = "_blank",
  className = "",
}) {
  return (
    <motion.a
      href={href}
      target={target}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.9 }}
      className={`${className} rounded-full`}
    >
      {children}
    </motion.a>
  );
}
