const fileTypes = [
  { ext: "pdf", mimetype: "application/pdf" },
  { ext: "doc", mimetype: "application/msword" },
  {
    ext: "docx",
    mimetype:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
];

const hoursJobTypes = [
  { name: "hours" },
  { name: "part-time" },
  { name: "full-time" },
];

export { fileTypes, hoursJobTypes };
