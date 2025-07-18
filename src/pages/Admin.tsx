import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Plus, Edit2, Trash2, Save, X, MoveUp, MoveDown, Github } from 'lucide-react';
import type { Pavilion, PavilionCategory } from '../types';
import { CATEGORY_LABELS } from '../utils/categories';
import { githubService } from '../services/github';

export const Admin: React.FC = () => {
  const [pavilions, setPavilions] = useState<Pavilion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showGitHubSetup, setShowGitHubSetup] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [githubOwner, setGithubOwner] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  
  const [formData, setFormData] = useState<Partial<Pavilion>>({
    name: '',
    url: '',
    category: 'other',
    description: '',
  });

  useEffect(() => {
    loadPavilions();
  }, []);

  const loadPavilions = async () => {
    try {
      const data = await githubService.fetchPavilions();
      setPavilions(data.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error loading pavilions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!githubService.hasToken()) {
      setShowGitHubSetup(true);
      return;
    }

    setIsSaving(true);
    try {
      const success = await githubService.updatePavilions(pavilions);
      if (success) {
        alert('保存しました');
      } else {
        alert('保存に失敗しました');
      }
    } catch (error) {
      alert('エラーが発生しました: ' + error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGitHubSetup = () => {
    githubService.setToken(githubToken);
    githubService.setRepository(githubOwner, githubRepo);
    setShowGitHubSetup(false);
    alert('GitHub設定を保存しました');
  };

  const handleAdd = () => {
    const newPavilion: Pavilion = {
      id: `pav-${Date.now()}`,
      name: formData.name || '',
      url: formData.url || '',
      category: formData.category as PavilionCategory || 'other',
      order: pavilions.length + 1,
      description: formData.description,
    };
    
    setPavilions([...pavilions, newPavilion]);
    setFormData({ name: '', url: '', category: 'other', description: '' });
  };

  const handleEdit = (pavilion: Pavilion) => {
    setEditingId(pavilion.id);
    setFormData(pavilion);
  };

  const handleUpdate = () => {
    setPavilions(pavilions.map(p => 
      p.id === editingId 
        ? { ...p, ...formData } as Pavilion
        : p
    ));
    setEditingId(null);
    setFormData({ name: '', url: '', category: 'other', description: '' });
  };

  const handleDelete = (id: string) => {
    if (confirm('本当に削除しますか？')) {
      setPavilions(pavilions.filter(p => p.id !== id));
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newPavilions = [...pavilions];
    [newPavilions[index - 1], newPavilions[index]] = [newPavilions[index], newPavilions[index - 1]];
    newPavilions.forEach((p, i) => p.order = i + 1);
    setPavilions(newPavilions);
  };

  const handleMoveDown = (index: number) => {
    if (index === pavilions.length - 1) return;
    const newPavilions = [...pavilions];
    [newPavilions[index], newPavilions[index + 1]] = [newPavilions[index + 1], newPavilions[index]];
    newPavilions.forEach((p, i) => p.order = i + 1);
    setPavilions(newPavilions);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 py-5 sm:p-6">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">パビリオン管理</h1>
          <div className="space-x-2">
            <button
              onClick={() => setShowGitHubSetup(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Github className="h-4 w-4 mr-2" />
              GitHub設定
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>

        {/* 新規追加フォーム */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">新規パビリオン追加</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <input
              type="text"
              placeholder="パビリオン名"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="url"
              placeholder="URL"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as PavilionCategory })}
            >
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <button
              onClick={handleAdd}
              disabled={!formData.name || !formData.url}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              追加
            </button>
          </div>
          <input
            type="text"
            placeholder="説明（任意）"
            className="mt-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {/* パビリオン一覧 */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {pavilions.map((pavilion, index) => (
              <li key={pavilion.id} className="px-6 py-4">
                {editingId === pavilion.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <input
                        type="text"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                      <input
                        type="url"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      />
                      <select
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as PavilionCategory })}
                      >
                        {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="text"
                      placeholder="説明（任意）"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleUpdate}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        保存
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setFormData({ name: '', url: '', category: 'other', description: '' });
                        }}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <X className="h-4 w-4 mr-1" />
                        キャンセル
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{pavilion.name}</h3>
                      <p className="text-sm text-gray-500">{pavilion.url}</p>
                      {pavilion.description && (
                        <p className="text-sm text-gray-600 mt-1">{pavilion.description}</p>
                      )}
                      <span className="inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {CATEGORY_LABELS[pavilion.category]}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="p-1 rounded-md text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      >
                        <MoveUp className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === pavilions.length - 1}
                        className="p-1 rounded-md text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      >
                        <MoveDown className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(pavilion)}
                        className="p-1 rounded-md text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(pavilion.id)}
                        className="p-1 rounded-md text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* GitHub設定モーダル */}
        {showGitHubSetup && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">GitHub設定</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Personal Access Token</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder="ghp_..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">リポジトリオーナー</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={githubOwner}
                    onChange={(e) => setGithubOwner(e.target.value)}
                    placeholder="username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">リポジトリ名</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={githubRepo}
                    onChange={(e) => setGithubRepo(e.target.value)}
                    placeholder="expo-pavilion-portal"
                  />
                </div>
              </div>
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={handleGitHubSetup}
                  className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  保存
                </button>
                <button
                  onClick={() => setShowGitHubSetup(false)}
                  className="flex-1 inline-flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};