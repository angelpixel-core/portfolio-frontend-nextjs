export function Submit({ text }) {
  return (
    <div className="form-send">
      <button className="form-send_input" type="submit">
        {text}
      </button>
    </div>
  );
}
