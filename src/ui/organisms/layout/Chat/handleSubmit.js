"use server";

export async function createMessage(prevState, formData) {
  const email = formData.get("email");
  const jobTypes = {
    hours: formData.get("hours"),
    partTime: formData.get("part-time"),
    fullTime: formData.get("full-time"),
  };
  const message = formData.get("message");
  const attachment = formData.get("job_attachment");

  console.log("holaaaaa", { email, jobTypes, message, attachment });
}
