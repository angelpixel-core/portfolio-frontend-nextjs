import { useSelector, useDispatch } from "react-redux";
import { markCopied, resetCopied } from "./slice";

export const useEmailCopy = () => {
  const copied = useSelector((state) => state.emailCopy.copied);
  const dispatch = useDispatch();

  return {
    copied,
    markCopied: () => dispatch(markCopied()),
    resetCopied: () => dispatch(resetCopied()),
  };
};

// USAGE SAMPLE
//
// import { useEmailCopy } from '@/state/slices/emailCopy';
//
// const EmailButton = () => {
//   const { copied, markCopied, resetCopied } = useEmailCopy();
//
//   const handleCopy = async () => {
//     await navigator.clipboard.writeText('email@example.com');
//     markCopied();
//     setTimeout(() => resetCopied(), 2000); // vuelve a false luego de 2s
//   };
//
//   return (
//     <button onClick={handleCopy}>
//       {copied ? '✅ Copiado' : '📋 Copiar'}
//     </button>
//   );
// };
