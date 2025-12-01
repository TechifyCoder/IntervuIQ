import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router'
import { PROBLEMS } from '../data/problem'
import Navbar from '../component/Navbar'
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from '../component/ProblemDescription';
import CodeEditorPannel from '../component/CodeEditorPannel';
import OutputPannel from '../component/OutputPannel';

const ProblemDetailPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [currentProblemId, setCurrentProblemId] = useState("two-sum")
    const [selectedLanguage, setSelectedLanguage] = useState("javascript")
    const [code, setCode] = useState(PROBLEMS[currentProblemId].starterCode.javascript);
    const [output, setOutput] = useState(null)
    const [isRunning, setIsRunning] = useState(false)

    const currentProblem = PROBLEMS[currentProblemId]
    useEffect(() => {
        if (id && PROBLEMS[id]) {
            setCurrentProblemId(id);
            setCode(PROBLEMS[id].starterCode[selectedLanguage])
            setOutput(null)
        }
    }, [id, selectedLanguage])

    const handleLanguageChange = (e) => { };
    const handleProblemChange = (newProblemId) => navigate(`/problem/${newProblemId}`);
    const triggerConfetti = () => { }
    const normalizeOutput = () => { }
    const checkIfTestIsPassed = () => { }
    const handleRunCode = () => { }

    return (
        <div className='h-screen bg-base-100 flex flex-col'>
            <Navbar />

            <div className='flex-1'>
                <PanelGroup direction='horizontal'>
                    {/* left pannel - fronlem desciption */}
                    <Panel defaultSize={40} minSize={30}>
                        <ProblemDescription
                            problem={currentProblem}
                            currentProblem={currentProblemId}
                            onProblemChange={handleProblemChange}
                            allProblems={Object.values(PROBLEMS)}
                        />
                    </Panel>
                    <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />
                    <Panel defaultSize={60} minSize={30}>
                        <PanelGroup direction="vertical">
                            {/* Top panel - Code editor */}
                            <Panel defaultSize={70} minSize={30}>
                                <CodeEditorPannel
                                    selectedLanguage={selectedLanguage}
                                    code={code}
                                    isRunning={isRunning}
                                    onLanguageChange={handleLanguageChange}
                                    onCodeChange={setCode}
                                    onRunCode={handleRunCode}
                                />
                            </Panel>

                            <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

                            {/* Bottom panel - Output Panel*/}

                            <Panel defaultSize={60} minSize={20}>
                                <OutputPannel output={output} />
                            </Panel>
                        </PanelGroup>
                    </Panel>
                </PanelGroup>
            </div>
        </div>
    );
}

export default ProblemDetailPage;
