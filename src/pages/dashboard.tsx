import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiLogOut, FiEdit3 } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
// import topLogo from '../assets/top.png';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface User {
  name: string;
  email: string;
  dateOfBirth: string;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User>({
    name: 'Jonas Khanwald',
    email: 'jonas_kahnwald@gmail.com',
    dateOfBirth: '11 December 1997'
  });

  useEffect(() => {
    // Load user data from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser({
        name: userData.name || 'Jonas Khanwald',
        email: userData.email || 'jonas_kahnwald@gmail.com',
        dateOfBirth: userData.dateOfBirth || '11 December 1997'
      });
    }
  }, []);
  
  const [notes, setNotes] = useState<Note[]>([]);
  
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAddNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        title: newNote.title,
        content: newNote.content,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setNotes([note, ...notes]);
      setNewNote({ title: '', content: '' });
      setShowAddNote(false);
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleEditNote = (id: string) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      setNewNote({ title: note.title, content: note.content });
      setEditingNote(id);
      setShowAddNote(true);
    }
  };

  const handleUpdateNote = () => {
    if (editingNote && newNote.title.trim() && newNote.content.trim()) {
      setNotes(notes.map(note => 
        note.id === editingNote 
          ? { ...note, title: newNote.title, content: newNote.content }
          : note
      ));
      setNewNote({ title: '', content: '' });
      setEditingNote(null);
      setShowAddNote(false);
    }
  };

  const handleSignOut = () => {
    // Clear user data and redirect to signin
    localStorage.removeItem('user');
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">HD</div>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={handleSignOut}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* User Info Card */}
        <div className="px-4 mb-6 mt-4">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Welcome, {user.name}!</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-900">{user.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-gray-900">Email: {user.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Create Note Button */}
        <div className="px-4 mb-4">
          <button
            onClick={() => setShowAddNote(true)}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="h-5 w-5" />
            <span>Create Note</span>
          </button>
        </div>

        {/* Add/Edit Note Form */}
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

        {/* Notes List */}
        <div className="px-4 pb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{note.title}</h3>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="HD Logo" className="h-8 w-16" />
            </div>
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <FiLogOut className="h-5 w-5" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex">
          {/* Sidebar */}
          <div className="w-1/3 bg-white shadow-sm min-h-screen p-6">
            {/* User Info */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">User Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                  <p className="text-gray-900">{user.dateOfBirth}</p>
                </div>
              </div>
            </div>

            {/* Add Note Button */}
            <button
              onClick={() => setShowAddNote(true)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="h-5 w-5" />
              <span>Add New Note</span>
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6">
            {/* Add/Edit Note Form */}
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

            {/* Notes List */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Notes</h2>
              <div className="grid gap-4">
                {notes.map((note) => (
                  <div key={note.id} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{note.title}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditNote(note.id)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <FiEdit3 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <FiTrash2 className="h-5 w-5" />
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

export default Dashboard;
