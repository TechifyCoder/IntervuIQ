import { useMutation,useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { sessionApi } from "../api/session";

export const useCreateSession = () => {
    const result = useMutation({
        mutationKey:["createSession"],
        mutationFn:sessionApi.createSession,
        onSuccess: () => toast.success("Session Creates successfully"),
        onError: (error) => toast.error(error.response?.data?.message || "Failed to create room")
    });
    return result;
};

export const useActiveSession = () => {
    const result = useQuery({
        queryKey: ["activeSession"],
        queryFn: sessionApi.getActiveSession,
    });
    return result;
};

export const useMyPastSession = () => {
    const result = useQuery({
        queryKey: ["myRecentSession"],
        queryFn: sessionApi.getMyPastSession,
    });
    return result;
};

export const useSessionById = (id) => {
  return useQuery({
    queryKey: ["session", id],
    queryFn: () => sessionApi.getSessionById(id),
  });
};


export const useJoinSession = () => {
  const result = useMutation({
    mutationKey: ["joinSession"],
    mutationFn: sessionApi.joinSession,
    onSuccess: () => toast.success("Joined session successfully!"),
    onError: (error) => toast.error(error.response?.data?.message || "Failed to join session"),
  });

  return result;
};

export const useEndSession = () => {
  return useMutation({
    mutationKey: ["endSession"],
    mutationFn: (id) => sessionApi.endSession(id),
    onSuccess: () => toast.success("Session ended successfully!"),
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to end session"),
  });
};
