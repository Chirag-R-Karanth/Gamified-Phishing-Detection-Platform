'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { createMission } from '@/lib/api/missions';

export default function CreateMissionPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  
  const [formData, setFormData] = useState({
    title: '',
    mission_number: '',
    difficulty: '1',
    category: 'credential_theft',
    ranger_name: '',
    ranger_email: '',
    ranger_request: '',
    email_from: '',
    email_subject: '',
    email_body_html: '',
    correct_verdict: 'phishing',
    is_published: true,
    required_level: '1',
  });

  const [clues, setClues] = useState<any[]>([
    { indicator: '', category: 'sender', severity: 'medium', explanation: '' }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addClue = () => {
    setClues([
      ...clues,
      { indicator: '', category: 'sender', severity: 'medium', explanation: '' }
    ]);
  };

  const removeClue = (index: number) => {
    setClues(clues.filter((_, i) => i !== index));
  };

  const updateClue = (index: number, field: string, value: string) => {
    const updated = [...clues];
    updated[index][field] = value;
    setClues(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('You must be logged in');
      return;
    }

    const missionData = {
      ...formData,
      mission_number: parseInt(formData.mission_number),
      difficulty: parseInt(formData.difficulty),
      required_level: parseInt(formData.required_level),
      clues: clues.filter(c => c.indicator.trim() !== ''),
      feedback_templates: {
        perfect_score: '🎉 Excellent work! You correctly identified this as ' + formData.correct_verdict + '!',
        partial_score: '👍 Good job! Review the clues to improve next time.',
        failed: '❌ This was ' + formData.correct_verdict + '. Review the red flags and try again!'
      }
    };

    try {
      setLoading(true);
      await createMission(missionData, token);
      alert('Mission created successfully!');
      router.push('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Create New Mission</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Mission Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Suspicious PayPal Email"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Mission Number *</label>
              <input
                type="number"
                name="mission_number"
                value={formData.mission_number}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Difficulty (1-5) *</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="1">1 - Beginner</option>
                <option value="2">2 - Easy</option>
                <option value="3">3 - Medium</option>
                <option value="4">4 - Hard</option>
                <option value="5">5 - Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="credential_theft">Credential Theft</option>
                <option value="malware">Malware</option>
                <option value="business_compromise">Business Compromise</option>
                <option value="gift_card_scam">Gift Card Scam</option>
                <option value="impersonation">Impersonation</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Required Level *</label>
              <input
                type="number"
                name="required_level"
                value={formData.required_level}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Correct Verdict *</label>
              <select
                name="correct_verdict"
                value={formData.correct_verdict}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="phishing">Phishing</option>
                <option value="legitimate">Legitimate</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ranger Request */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Ranger Help Request</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Ranger Name *</label>
              <input
                type="text"
                name="ranger_name"
                value={formData.ranger_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Sarah Johnson"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Ranger Email *</label>
              <input
                type="email"
                name="ranger_email"
                value={formData.ranger_email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., sarah.j@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Help Request Message *</label>
              <textarea
                name="ranger_request"
                value={formData.ranger_request}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="What did the ranger say when forwarding this email?"
              />
            </div>
          </div>
        </div>

        {/* Email Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Email Content</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">From Address *</label>
              <input
                type="text"
                name="email_from"
                value={formData.email_from}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., security@paypa1-support.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Subject Line *</label>
              <input
                type="text"
                name="email_subject"
                value={formData.email_subject}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Urgent: Verify Your Account"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Email Body (HTML) *</label>
              <textarea
                name="email_body_html"
                value={formData.email_body_html}
                onChange={handleChange}
                required
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                placeholder="<p>Dear customer...</p>"
              />
            </div>
          </div>
        </div>

        {/* Clues */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Red Flag Indicators</h3>
            <button
              type="button"
              onClick={addClue}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
            >
              + Add Clue
            </button>
          </div>

          {clues.map((clue, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold">Clue #{index + 1}</h4>
                {clues.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeClue(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Indicator</label>
                  <input
                    type="text"
                    value={clue.indicator}
                    onChange={(e) => updateClue(index, 'indicator', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Misspelled domain name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Category</label>
                    <select
                      value={clue.category}
                      onChange={(e) => updateClue(index, 'category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="sender">Sender</option>
                      <option value="content">Content</option>
                      <option value="links">Links</option>
                      <option value="attachments">Attachments</option>
                      <option value="headers">Headers</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">Severity</label>
                    <select
                      value={clue.severity}
                      onChange={(e) => updateClue(index, 'severity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Explanation</label>
                  <textarea
                    value={clue.explanation}
                    onChange={(e) => updateClue(index, 'explanation', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Why is this a red flag?"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Creating...' : 'Create Mission'}
          </button>
        </div>
      </form>
    </div>
  );
}
