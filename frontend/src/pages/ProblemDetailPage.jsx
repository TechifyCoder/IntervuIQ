import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router'
import { PROBLEMS } from '../data/problem'
import Navbar from '../component/Navbar'
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from '../component/ProblemDescription';
import CodeEditorPannel from '../component/CodeEditorPannel';
import OutputPannel from '../component/OutputPannel';
import { executeCode } from '../lib/piston';
import toast from 'react-hot-toast'
import confetti from "canvas-confetti";

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

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;

        setSelectedLanguage(newLang);

        // ALWAYS use PROBLEMS with updated currentProblemId (not old currentProblem)
        setCode(PROBLEMS[currentProblemId].starterCode[newLang] || "");

        setOutput(null);
    };

    const handleProblemChange = (newProblemId) => navigate(`/problem/${newProblemId}`);
    const triggerConfetti = () => {
        confetti({
            particleCount: 80,
            spread: 250,
            origin: { x: 0.2, y: 0.6 },
        });

        confetti({
            particleCount: 80,
            spread: 250,
            origin: { x: 0.8, y: 0.6 },
        });
    };
    const normalizeOutput = (output) => {
        // normalize output for comparison (trim whitespace, handle different spacing)
        return output
            .trim()
            .split("\n")
            .map((line) =>
                line
                    .trim()
                    // remove spaces after [ and before ]
                    .replace(/\[\s+/g, "[")
                    .replace(/\s+\]/g, "]")
                    // normalize spaces around commas to single space after comma
                    .replace(/\s*,\s*/g, ",")
            )
            .filter((line) => line.length > 0)
            .join("\n");
    };

    const checkIfTestIsPassed = (actualOutput, expectedOutput) => {
        const normalizedActual = normalizeOutput(actualOutput)
        const normalizedExpected = normalizeOutput(expectedOutput)

        return normalizedActual === normalizedExpected
    }
    const handleRunCode = async () => {
        setIsRunning(true);
        setOutput(false);

        const result = await executeCode(selectedLanguage, code)
        setOutput(result);
        setIsRunning(false)

        if (result.success) {
            const expectedOutput = currentProblem.expectedOutput[selectedLanguage]
            const testPassed = checkIfTestIsPassed(result.output, expectedOutput);

            if (testPassed) {
                triggerConfetti();
                toast.success("All tests passed Great job!")
            } else {
                toast.error("Tests failed . Check your outPut!")
            }
        } else {
            toast.error("Code execution failed")
        }
    }

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
                                    onRuncode={handleRunCode}
                                />
                            </Panel>

                            <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

                            {/* Bottom panel - Output Panel*/}

                            <Panel defaultSize={30} minSize={20}>
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
