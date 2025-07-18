import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from '../components/Layout';
import { PavilionCard } from '../components/PavilionCard';
import { Search, Filter } from 'lucide-react';
import type { Pavilion, PavilionCategory } from '../types';
import { CATEGORY_LABELS } from '../utils/categories';
import { githubService } from '../services/github';

export const Home: React.FC = () => {
  const [pavilions, setPavilions] = useState<Pavilion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PavilionCategory | 'all'>('all');

  useEffect(() => {
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

    loadPavilions();
  }, []);

  const filteredPavilions = useMemo(() => {
    return pavilions.filter(pavilion => {
      const matchesSearch = pavilion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (pavilion.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      const matchesCategory = selectedCategory === 'all' || pavilion.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [pavilions, searchTerm, selectedCategory]);

  return (
    <Layout>
      <div className="px-4 py-5 sm:p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">パビリオン一覧</h1>
          <p className="text-gray-600">大阪・関西万博の各パビリオン情報をご覧いただけます</p>
        </div>

        {/* 検索・フィルター */}
        <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="パビリオン名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as PavilionCategory | 'all')}
            >
              <option value="all">すべてのカテゴリー</option>
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* パビリオン一覧 */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-600">読み込み中...</p>
          </div>
        ) : filteredPavilions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">該当するパビリオンが見つかりませんでした</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPavilions.map(pavilion => (
              <PavilionCard key={pavilion.id} pavilion={pavilion} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};