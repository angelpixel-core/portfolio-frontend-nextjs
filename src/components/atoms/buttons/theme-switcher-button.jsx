import useThemeSwitcher from "@/hooks/use-theme-switcher";

import MoonIcon from "@/atoms/icons/moon-icon";
import SunIcon from "@/atoms/icons/sun-icon";

const DARK = "dark";
const LIGHT = "light";

export default function ThemeSwitcherButton({}) {
  const [mode, setMode] = useThemeSwitcher();

  return (
    <button
      onClick={() => setMode(mode === LIGHT ? DARK : LIGHT)}
      className="
        flex
        items-center
        justify-center
        rounded-full
        p-1
        ml-3 sm:ml-1
        bg-dark dark:bg-light
        text-light dark:text-dark
      "
    >
      {mode === DARK ? (
        <MoonIcon className="fill-dark" />
      ) : (
        <SunIcon className="fill-dark" />
      )}
    </button>
  );
}
