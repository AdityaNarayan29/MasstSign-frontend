import api from "@/lib/src/api-config";


export interface Document {
  id: number;
  fileUrl: string;
  status: "PENDING" | "SIGNED" | "VERIFIED" | "REJECTED";
  signer?: { email: string };
  uploader?: { email: string };
}

export const fetchUploadedDocuments = async (): Promise<Document[]> => {
  const { data } = await api.get("/documents/uploaded");
  return data;
};

export const fetchAssignedDocuments = async (): Promise<Document[]> => {
  const { data } = await api.get("/documents/assigned");
  return data;
};
