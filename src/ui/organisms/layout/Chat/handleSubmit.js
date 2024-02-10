export async function handleSubmit(event) {
  event.preventDefault();

  console.log("Disable Contact Form Inputs");
  const response = await fetch("/api/messages", {
    method: "POST",
    body: new FormData(event.target),
  })
    .then((res) => res)
    .catch((err) => console.error(err));

  if (response.ok) {
    console.log("Close Form");
  } else {
    console.log("Enable Inputs");
    const { message } = await response.json();
    console.error(`ERROR | ${message}`);
  }
}
