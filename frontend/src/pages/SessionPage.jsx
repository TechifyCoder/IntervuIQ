import React, { use, useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react'
import { useNavigate, useParams } from 'react-router'
import { useSessionById } from '../hooks/useSessions';
import { PROBLEMS } from '../data/problem';

const SessionPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useUser();
    const [output, setOutput] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const { data: sessionData, isLoading: lodingSession, refetch } = useSessionById(id)
    const joinSessionMutation = useJoinSession()
    const endSessionMutation = useEndSession()

    const session = sessionData?.session;
    const isHost = session?.host?.clerkId === user?.id;
    const isParticipant = session?.participant?.clerkId === user?.id;


    const { call, channel, chatClient, isInitializingCall, streamClient } = useStreamClient(
        session,
        loadingSession,
        isHost,
        isParticipant
    );

    const problemData = session?.problem
        ? Object.values(PROBLEMS).find((problem) => problem.title === session.problem)
        : null;

    const [selectedLanguage, setSelectedLanguage] = useState("javascript");
    const [code, setCode] = useState(problemData?.starterCode?.[selectedLanguage] || "");

    useEffect(() => {
        if (!session || !user || lodingSession) return;
        if (!isHost && !isParticipant) return
        joinSessionMutation.mutate(id, { onSuccess: refetch })
    }, [session, user, lodingSession, isHost, isParticipant, id]);

    useEffect(() => {
        if (!session || !user || lodingSession) return;

        if (session.status === "completed") navigate(`/dashboard`);

    }, [session, user, lodingSession, navigate]);

    useEffect(() => {
        if (problemData?.starterCode?.[selectedLanguage])
            setCode(problemData.starterCode[selectedLanguage]);
    }, [problemData, selectedLanguage]);

    const handleLanguageChange = (e) => {
        const newLanguage = e.target.value;
        setSelectedLanguage(newLanguage);

        const starterCode = problemData?.starterCode?.[newLanguage] || "";
        setCode(starterCode);
        setOutput(null);
    }

    const handleRunCode = async () => {
        setIsRunning(true);
        setOutput(null);

        const result = await runCode(selectedLanguage, code);
        setOutput(result);
        setIsRunning(false);
    }
    const handleEndSession = () => {
        if (window.confirm("Are you sure you want to end the session?")) {
            endSessionMutation.mutate(id, {
                onSuccess: () => {
                    navigate('/dashboard');
                }
            });
        }
    }
    return (
        <div>

        </div>
    );
}

export default SessionPage;
