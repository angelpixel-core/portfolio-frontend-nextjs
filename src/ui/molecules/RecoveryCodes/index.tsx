import "./styles.css";

interface RecoveryCodesProps {
  codes: string[];
  onAcknowledge?: () => void;
  acknowledged?: boolean;
}

const RecoveryCodes = ({
  codes,
  onAcknowledge,
  acknowledged = false,
}: RecoveryCodesProps) => {
  return (
    <section className="recovery-codes" data-testid="recovery-codes">
      <div className="recovery-codes__header">
        <div>
          <p className="recovery-codes__eyebrow">Recovery codes</p>
          <h4 className="recovery-codes__title">Save these codes</h4>
        </div>
        <button
          type="button"
          className="recovery-codes__button focus-ring"
          onClick={onAcknowledge}
          disabled={acknowledged}
        >
          {acknowledged ? "Saved" : "I saved these"}
        </button>
      </div>
      <p className="recovery-codes__hint">
        Store these codes somewhere safe. Each code can be used once to access your
        account if you lose your device.
      </p>
      <div className="recovery-codes__grid">
        {codes.map((code) => (
          <div key={code} className="recovery-codes__item">
            {code}
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecoveryCodes;
