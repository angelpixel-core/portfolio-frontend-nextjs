interface FileType {
  ext: string;
  mimetype: string;
}

interface JobType {
  name: string;
}

const fileTypes: FileType[] = [
  { ext: "pdf", mimetype: "application/pdf" },
  { ext: "doc", mimetype: "application/msword" },
  {
    ext: "docx",
    mimetype:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
];

const hoursJobTypes: JobType[] = [
  { name: "hours" },
  { name: "part-time" },
  { name: "full-time" },
];

export { fileTypes, hoursJobTypes };
export type { FileType, JobType };
