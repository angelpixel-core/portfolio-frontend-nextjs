interface SubmitProps {
  text: string;
}

export function Submit({ text }: SubmitProps) {
  return (
    <div className="form-send">
      <button className="form-send_input" type="submit">
        {text}
      </button>
    </div>
  );
}
