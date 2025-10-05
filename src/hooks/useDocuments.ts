import { useQuery } from "@tanstack/react-query";
import { fetchUploadedDocuments, fetchAssignedDocuments, Document } from "src/services/documents.service";
import { useAuth } from "@/context/AuthContext";

export function useDocuments() {
  const { user } = useAuth();

  return useQuery<Document[]>({
    queryKey: ["documents", user?.role],
    queryFn: async () => {
      if (user?.role === "UPLOADER") return fetchUploadedDocuments();
      if (user?.role === "SIGNER") return fetchAssignedDocuments();
      return [];
    },
    enabled: !!user,
  });
}
