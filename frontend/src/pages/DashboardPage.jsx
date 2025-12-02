import React, { useState } from 'react';
import { useNavigate } from 'react-router'
import { useUser } from "@clerk/clerk-react"
import { useActiveSession, useCreateSession, useMyPastSession } from '../hooks/useSession';
import Navbar from '../component/Navbar'
import WelcomeSection from '../component/WelcomeSection';
import StatusCard from '../component/StatusCard'
import RecentSession from '../component/RecentSession'
import CreateSessionModal from '../component/CreateSessionModal'
import ActiveSession from '../component/ActiveSession';

const DashboardPage = () => {
    const navigate = useNavigate()
    const { user } = useUser();
    const [showCreateModel, setShowCreateModel] = useState(false);
    const [roomConfig, setRoomConfig] = useState({ problem: "", difficulty: "" });

    const createSessionMutation = useCreateSession();

    const { data: activeSessionData, isLoding: loadingActiveSessions } = useActiveSession();
    const { data: recentSessionData, isLoding: loadingRecentSession } = useMyPastSession();

    const handleCreateRoom = () => {
        if (!roomConfig.problem || !roomConfig.difficulty) {
            toast.error("Please select a problem");
            return;
        }

        createSessionMutation.mutate(
            {
                problem: roomConfig.problem,
                difficulty: roomConfig.difficulty,
            },
            {
                onSuccess: (data) => {
                    console.log("Session created:", data); // ← ye laga do pehle
                    setShowCreateModel(false);

                    // Ye line safe bana do
                    const sessionId = data?.session?._id || data?._id;
                    if (sessionId) {
                        navigate(`/session/${sessionId}`);
                    } else {
                        toast.error("Session created but ID not found");
                    }
                },
                onError: (error) => {
                    toast.error(error.response?.data?.msg || "Failed to create session");
                }
            }
        );
    };

    const activeSessions = activeSessionData?.sessions || [];
    const recentSessions = recentSessionData?.sessions || [];

    const isUserInSession = (session) => {
        if (!user.id) return false;

        return session.host?.clerkId === user.id || session.paticipant?.clerkId === user.id;
    };

    return (
        <>
            <div className='min-h-screen bg-base-300'>
                <Navbar />

                <WelcomeSection onCreateSession={() => setShowCreateModel(true)} />

                {/* Grid layout */}
                <div className='container mx-auto px-6 pb-16'>
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                        <StatusCard
                            activeSessionsCount={activeSessions.length}
                            recentSessionsCount={recentSessions.length}
                        />
                        <ActiveSession
                            sessions={activeSessions}
                            isLoading={loadingActiveSessions}
                            isUserInSession={isUserInSession}
                        />
                    
                </div>
                <RecentSession sessions={recentSessions} isLoding={loadingRecentSession} />
            </div>
        </div >
            <CreateSessionModal
                isOpen={showCreateModel}
                onClose={() => setShowCreateModel(false)}
                roomConfig={roomConfig}
                setRoomConfig={setRoomConfig}
                onCreateRoom={handleCreateRoom}
                isCreating={createSessionMutation.isPending}
            />
        
        </>
    );
}

export default DashboardPage;
