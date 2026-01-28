/**
 * MainContainer - Main page content wrapper with padding
 *
 * Story 12.6: Added support for rest props (e.g., data-testid)
 *
 * @param {ReactNode} children - Child content
 * @param {string} className - Additional CSS classes
 * @param {object} rest - Additional props passed to the container div
 */
import "./styles.css";

export const MainContainer = ({ children, className, ...rest }) => {
  return (
    <div className={`main-container ${className}`} {...rest}>
      {children}
    </div>
  );
};
