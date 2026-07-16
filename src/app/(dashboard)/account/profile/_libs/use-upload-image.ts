import { useState } from "react";

type UploadState = {
  uploading: boolean;
  error: string | null;
};

const useUploadImage = () => {
  const [state, setState] = useState<UploadState>({
    uploading: false,
    error: null,
  });

  const upload = async (
    file: File,
  ): Promise<string | null> => {
    setState({ uploading: true, error: null });

    try {
      const res = await fetch("/api/upload/signature", { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Falha ao obter assinatura");
      }

      const { signature, timestamp, cloudName, apiKey, folder } =
        await res.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", String(timestamp));
      formData.append("api_key", apiKey);
      formData.append("folder", folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData },
      );

      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(err.error?.message || "Falha ao fazer upload");
      }

      const result = await uploadRes.json();
      setState({ uploading: false, error: null });
      return result.secure_url as string;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao fazer upload";
      setState({ uploading: false, error: message });
      return null;
    }
  };

  const reset = () => setState({ uploading: false, error: null });

  return { ...state, upload, reset };
};

export { useUploadImage };
