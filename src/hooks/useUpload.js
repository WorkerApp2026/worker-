import { useCallback, useState } from "react";
import { createTaskImageRecord, getImagesByTaskId, uploadTaskImage } from "../services/uploadService";

export default function useUploads() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadImages = useCallback(async (taskId) => {
    setLoading(true);
    setError("");

    const result = await getImagesByTaskId(taskId);

    if (result.error) {
      setError(result.error.message || "Bilder konnten nicht geladen werden.");
      setImages([]);
    } else {
      setImages(result.data || []);
    }

    setLoading(false);
  }, []);

  const addImage = async ({ taskId, file, uploadedBy }) => {
    const uploadResult = await uploadTaskImage({ taskId, file });

    if (uploadResult.error) {
      return uploadResult;
    }

    const saveResult = await createTaskImageRecord({
      task_id: taskId,
      file_url: uploadResult.publicUrl,
      uploaded_by: uploadedBy,
    });

    if (!saveResult.error) {
      await loadImages(taskId);
    }

    return saveResult;
  };

  return {
    images,
    loading,
    error,
    loadImages,
    addImage,
  };
}