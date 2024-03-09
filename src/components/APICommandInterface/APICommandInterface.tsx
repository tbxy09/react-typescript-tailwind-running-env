import React, { useEffect, useState } from 'react';

interface Project {
  id: string;
  name: string;
  description: string;
}

interface Message {
  sender: string;
  message: string;
}

const BASE_URL = 'https://solid-palm-tree-v6695g7xjqqhxwj4-8000.app.github.dev';

const APICommandInterface: React.FC = () => {
  const [view, setView] = useState<'document' | 'both' | 'canvas'>('both');
  const [projects, setProjects] = useState<Project[]>([]);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [command, setCommand] = useState<string>('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${BASE_URL}/projects`);
      const data: Project[] = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const makeAPIRequest = async (endpoint: string, method: string, params: any) => {
    const url = new URL(`${BASE_URL}${endpoint}`);

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    try {
      const response = await fetch(url, { method });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const command = event.currentTarget.value;
      setCommand('');

      displayMessage('user', command);

      const [endpoint, ...paramParts] = command.split(' ');
      const params: { [key: string]: string } = {};

      paramParts.forEach(part => {
        const [key, value] = part.split('=');
        params[key] = value;
      });

      try {
        const data = await makeAPIRequest(endpoint, 'GET', params);
        displayMessage('assistant', JSON.stringify(data, null, 2));
      } catch (error) {
        displayMessage('assistant', 'Error: ' + (error as any).message);
      }
    }
  };

  const displayMessage = (sender: string, message: string) => {
    setChatHistory(prevChatHistory => [
      ...prevChatHistory,
      { sender, message },
    ]);
  };

  const deployProject = async (projectId: string) => {
    try {
      await makeAPIRequest('/deploy', 'POST', { projectID: projectId });
      alert('Deployment started');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const downloadProjectZip = async (projectId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/zipit?projectID=${projectId}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `project-${projectId}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const switchView = (view: 'document' | 'both' | 'canvas') => {
    setView(view);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-center space-x-4 my-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => switchView('document')}
        >
          Document
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => switchView('both')}
        >
          Both
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => switchView('canvas')}
        >
          Canvas
        </button>
      </div>
      <div className="flex flex-1">
        {(view === 'document' || view === 'both') && (
          <div className="w-1/2 p-4 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Project Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map(project => (
                <div key={project.id} className="project-card">
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <button onClick={() => deployProject(project.id)}>Deploy</button>
                  <button onClick={() => downloadProjectZip(project.id)}>
                    Download Zip
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {(view === 'both' || view === 'canvas') && (
          <>
            <div className="w-1 bg-gray-300 cursor-col-resize" id="splitHandle"></div>
            <div className="w-1/2 p-4 flex flex-col">
              <h2 className="text-2xl font-bold mb-4">API Command Interface</h2>
              <div className="flex-1 overflow-y-auto mb-4 p-4 bg-white border border-gray-300 rounded">
                {chatHistory.map((message, index) => (
                  <div key={index}>
                    <strong>{message.sender}:</strong> {message.message}
                  </div>
                ))}
              </div>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded"
                placeholder="Enter a command..."
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default APICommandInterface;