import React, { use, useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react'
import { useNavigate, useParams } from 'react-router'
import { useSessionById, useJoinSession, useEndSession } from '../hooks/useSession';
import { PROBLEMS } from '../data/problem';
import Navbar from '../component/Navbar';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { problemDifficulty } from '../lib/utilis';
import { Loader2Icon, LogOutIcon, PhoneOffIcon } from "lucide-react";
import CodeEditorPanel from '../component//CodeEditorPannel';
import OutputPanel from '../component/OutputPannel'
import { executeCode } from '../lib/piston';
import { StreamVideo, StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import useStreamClient from "../hooks/useStreamClient";
import VideoCallUI from "../component/VideoCallUI";

const SessionPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const [output, setOutput] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const { data: sessionData, isLoading: lodingSession, refetch } = useSessionById(id)
  const joinSessionMutation = useJoinSession()
  const endSessionMutation = useEndSession()

  const session = sessionData?.session;
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participant?.clerkId === user?.id;


  const { streamClient, call, chatClient, isInitializingCall, channel } = useStreamClient(
    session,
    lodingSession,
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
    if (isHost || isParticipant) return;
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

    const result = await executeCode(selectedLanguage, code);
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
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className='flex-1'>
        <PanelGroup direction={isMobile ? "vertical" : "horizontal"} id="main-group">
          {/* LEFT PANEL: Problem & Editor */}
          <Panel defaultSize={50} minSize={35} id="left-panel" order={1}>
            <PanelGroup direction="vertical" id="left-group">
              {/* Problem Description (Top) */}
              <Panel defaultSize={50} minSize={20} id="problem-panel" order={1}>
                <div className="h-full overflow-y-auto bg-base-200">
                  {/* HEADER SECTION - Keep existing header code but simplified for context */}
                  <div className="p-6 bg-base-100 border-b border-base-300">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h1 className="text-3xl font-bold text-base-content">
                          {session?.problem || "Loading..."}
                        </h1>
                        {problemData?.category && (
                          <p className="text-base-content/60 mt-1">{problemData.category}</p>
                        )}
                        <p className="text-base-content/60 mt-2">
                          Host: {session?.host?.name || "Loading..."} •{" "}
                          {session?.participant ? 2 : 1}/2 participants
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`badge badge-lg ${problemDifficulty(session?.difficulty)}`}>
                          {session?.difficulty.slice(0, 1).toUpperCase() + session?.difficulty.slice(1) || "Easy"}
                        </span>
                        {isHost && session?.status === "active" && (
                          <button onClick={handleEndSession} disabled={endSessionMutation.isPending} className="btn btn-error btn-sm gap-2">
                            {endSessionMutation.isPending ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <LogOutIcon className="w-4 h-4" />}
                            End Session
                          </button>
                        )}
                        {session?.status === "completed" && <span className="badge badge-ghost badge-lg">Completed</span>}
                      </div>
                    </div>
                  </div>

                  {/* Problem Details */}
                  <div className="p-6 space-y-6">
                    {problemData?.description && (
                      <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                        <h2 className="text-xl font-bold mb-4 text-base-content">Description</h2>
                        <div className="space-y-3 text-base leading-relaxed">
                          <p className="text-base-content/90">{problemData.description.text}</p>
                          {problemData.description.notes?.map((note, idx) => (
                            <p key={idx} className="text-base-content/90">{note}</p>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Examples */}
                    {problemData?.examples && problemData.examples.length > 0 && (
                      <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                        <h2 className="text-xl font-bold mb-4 text-base-content">Examples</h2>
                        <div className="space-y-4">
                          {problemData.examples.map((example, idx) => (
                            <div key={idx}>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="badge badge-sm">{idx + 1}</span>
                                <p className="font-semibold text-base-content">Example {idx + 1}</p>
                              </div>
                              <div className="bg-base-200 rounded-lg p-4 font-mono text-sm space-y-1.5">
                                <div className="flex gap-2"><span className="text-primary font-bold min-w-[70px]">Input:</span><span>{example.input}</span></div>
                                <div className="flex gap-2"><span className="text-secondary font-bold min-w-[70px]">Output:</span><span>{example.output}</span></div>
                                {example.explanation && <div className="pt-2 border-t border-base-300 mt-2"><span className="text-base-content/60 font-sans text-xs"><span className="font-semibold">Explanation:</span> {example.explanation}</span></div>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Constraints */}
                    {problemData?.constraints && problemData.constraints.length > 0 && (
                      <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                        <h2 className="text-xl font-bold mb-4 text-base-content">Constraints</h2>
                        <ul className="space-y-2 text-base-content/90">
                          {problemData.constraints.map((constraint, idx) => (
                            <li key={idx} className="flex gap-2"><span className="text-primary">•</span><code className="text-sm">{constraint}</code></li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

              {/* Code Editor (Bottom) */}
              <Panel defaultSize={50} minSize={20} id="editor-panel" order={2}>
                <PanelGroup direction="vertical" id="editor-group">
                  <Panel defaultSize={70} minSize={20} id="code-panel" order={1}>
                    <CodeEditorPanel
                      selectedLanguage={selectedLanguage}
                      code={code}
                      isRunning={isRunning}
                      onLanguageChange={handleLanguageChange}
                      onCodeChange={(value) => setCode(value)}
                      onRunCode={handleRunCode}
                    />
                  </Panel>
                  <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />
                  <Panel defaultSize={30} minSize={15} id="output-panel" order={2}>
                    <OutputPanel output={output} />
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

          {/* RIGHT PANEL: Video Call */}
          <Panel defaultSize={50} minSize={30} id="right-panel" order={2}>
            {streamClient && call ? (
              <StreamVideo client={streamClient}>
                <StreamCall call={call}>
                  <VideoCallUI chatClient={chatClient} channel={channel} />
                </StreamCall>
              </StreamVideo>
            ) : (
              <div className="h-full flex items-center justify-center bg-base-100">
                <Loader2Icon className="w-8 h-8 animate-spin" />
                <span className="ml-2">Connecting to session...</span>
              </div>
            )}
          </Panel>
        </PanelGroup>

      </div>
    </div>
  );
}

export default SessionPage;