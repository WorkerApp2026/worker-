import { useCallback, useState } from "react";
import { createComment, getCommentsByTaskId } from "../services/commentService";

export default function useComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadComments = useCallback(async (taskId) => {
    setLoading(true);
    setError("");

    const result = await getCommentsByTaskId(taskId);

    if (result.error) {
      setError(result.error.message || "Kommentare konnten nicht geladen werden.");
      setComments([]);
    } else {
      setComments(result.data || []);
    }

    setLoading(false);
  }, []);

  const addComment = async (payload) => {
    const result = await createComment(payload);
    if (!result.error) {
      await loadComments(payload.task_id);
    }
    return result;
  };

  return {
    comments,
    loading,
    error,
    loadComments,
    addComment,
  };
}