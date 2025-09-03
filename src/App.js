import React, { useState, useEffect } from 'react';
import Signup from './pages/signup.jsx';
import Signin from './pages/signin.jsx';
import { API_ENDPOINTS } from './config';

const App = () => {
  const [currentPage, setCurrentPage] = useState('signup');
  const [userData, setUserData] = useState(null);

  // Check for existing authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserData(user);
        setCurrentPage('dashboard');
      } catch (error) {
        // Invalid stored data, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const Dashboard = () => {
    const [notes, setNotes] = useState([]);
    const [showAddNote, setShowAddNote] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', content: '' });
    const [editingNote, setEditingNote] = useState(null);
  

    useEffect(() => {
      loadNotes();
    }, []);

    const loadNotes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(API_ENDPOINTS.NOTES, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        const data = await response.json();
        if (data.success) {
          setNotes(data.notes || []);
        } else if (response.status === 401 || response.status === 403) {
          // Token expired or invalid, redirect to signin
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setCurrentPage('signin');
          setUserData(null);
        }
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    };

    const handleAddNote = async () => {
      if (newNote.title.trim() && newNote.content.trim()) {
        setLoading(true);
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(API_ENDPOINTS.NOTES, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              title: newNote.title,
              content: newNote.content
            }),
          });
          const data = await response.json();
          if (data.success) {
            setNotes([...notes, data.note]);
            setNewNote({ title: '', content: '' });
            setShowAddNote(false);
          } else if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setCurrentPage('signin');
            setUserData(null);
          }
        } catch (error) {
          console.error('Error adding note:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    const handleEditNote = (id) => {
      const note = notes.find(n => n.id === id);
      if (note) {
        setEditingNote(note);
        setNewNote({ title: note.title, content: note.content });
        setShowAddNote(true);
      }
    };

    const handleUpdateNote = async () => {
      if (editingNote && newNote.title.trim() && newNote.content.trim()) {
        setLoading(true);
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_ENDPOINTS.NOTES}/${editingNote.id}`, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              title: newNote.title,
              content: newNote.content
            }),
          });
          const data = await response.json();
          if (data.success) {
            setNotes(notes.map(note => 
              note.id === editingNote.id 
                ? { ...note, title: newNote.title, content: newNote.content }
                : note
            ));
            setNewNote({ title: '', content: '' });
            setEditingNote(null);
            setShowAddNote(false);
          } else if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setCurrentPage('signin');
            setUserData(null);
          }
        } catch (error) {
          console.error('Error updating note:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    const handleDeleteNote = async (id) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_ENDPOINTS.NOTES}/${id}`, {
          method: 'DELETE',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        const data = await response.json();
        if (data.success) {
          setNotes(notes.filter(note => note.id !== id));
          if (editingNote && editingNote.id === id) {
            setEditingNote(null);
            setShowAddNote(false);
          }
        } else if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setCurrentPage('signin');
          setUserData(null);
        }
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    };

    const handleSignOut = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setCurrentPage('signin');
      setUserData(null);
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="md:hidden">
          <div className="bg-white shadow-sm border-b">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">HD</div>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
              <button onClick={handleSignOut} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Sign Out
              </button>
            </div>
          </div>

          <div className="px-4 mb-6 mt-4">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Welcome, {userData?.name}!</h2>
              <div className="space-y-3">
                <div><p className="text-gray-900">{userData?.dateOfBirth}</p></div>
                <div><p className="text-gray-900">Email: {userData?.email}</p></div>
              </div>
            </div>
          </div>

          <div className="px-4 mb-4">
            <button
              onClick={() => setShowAddNote(true)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
            >
              <span className="text-xl">➕</span>
              <span>Create Note</span>
            </button>
          </div>

          {showAddNote && (
            <div className="px-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {editingNote ? 'Edit Note' : 'Add New Note'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={newNote.title}
                      onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Enter note title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                      value={newNote.content}
                      onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Enter note content"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={editingNote ? handleUpdateNote : handleAddNote}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {editingNote ? 'Update Note' : 'Add Note'}
                    </button>
                    <button
                      onClick={() => {
                        setShowAddNote(false);
                        setEditingNote(null);
                        setNewNote({ title: '', content: '' });
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="px-4 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="bg-white rounded-lg shadow-sm border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{note.title}</h3>
                    <button onClick={() => handleDeleteNote(note.id)} className="text-red-600 hover:text-red-800">
                      <span className="text-xl">🗑️</span>
                    </button>
                  </div>
                  <p className="text-gray-600 mt-2">{note.content}</p>
                  <p className="text-sm text-gray-400 mt-2">Created: {note.createdAt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="bg-white shadow-sm border-b">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center space-x-2">
                <img src="/logo.png" alt="HD Logo" className="h-8 w-16" />
              </div>
              <div className="flex items-center space-x-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <button onClick={handleSignOut} className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                  <span className="text-xl">🚪</span>
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex">
            <div className="w-1/3 bg-white shadow-sm min-h-screen p-6">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">User Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-gray-900">{userData?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{userData?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                    <p className="text-gray-900">{userData?.dateOfBirth}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowAddNote(true)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
              >
                <span className="text-xl">➕</span>
                <span>Add New Note</span>
              </button>
            </div>

            <div className="flex-1 p-6">
              {showAddNote && (
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {editingNote ? 'Edit Note' : 'Add New Note'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={newNote.title}
                        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Enter note title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                      <textarea
                        value={newNote.content}
                        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Enter note content"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={editingNote ? handleUpdateNote : handleAddNote}
                        className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {editingNote ? 'Update Note' : 'Add Note'}
                      </button>
                      <button
                        onClick={() => {
                          setShowAddNote(false);
                          setEditingNote(null);
                          setNewNote({ title: '', content: '' });
                        }}
                        className="bg-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Notes</h2>
                <div className="grid gap-4">
                  {notes.map((note) => (
                    <div key={note.id} className="bg-white rounded-lg shadow-sm border p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">{note.title}</h3>
                        <div className="flex space-x-2">
                          <button onClick={() => handleEditNote(note.id)} className="text-blue-600 hover:text-blue-800 p-1">
                            <span className="text-xl">✏️</span>
                          </button>
                          <button onClick={() => handleDeleteNote(note.id)} className="text-red-600 hover:text-red-800 p-1">
                            <span className="text-xl">🗑️</span>
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">{note.content}</p>
                      <p className="text-sm text-gray-400">Created: {note.createdAt}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (currentPage === 'signin') {
    return <Signin setCurrentPage={setCurrentPage} setUserData={setUserData} />;
  }
  
  if (currentPage === 'dashboard') {
    return <Dashboard />;
  }

  return <Signup setCurrentPage={setCurrentPage} setUserData={setUserData} />;
};

export default App;