import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { Pavilion } from '../types';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../utils/categories';

interface PavilionCardProps {
  pavilion: Pavilion;
}

export const PavilionCard: React.FC<PavilionCardProps> = ({ pavilion }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{pavilion.name}</h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${CATEGORY_COLORS[pavilion.category]}`}>
            {CATEGORY_LABELS[pavilion.category]}
          </span>
        </div>
        
        {pavilion.description && (
          <p className="text-gray-600 text-sm mb-4">{pavilion.description}</p>
        )}
        
        <a
          href={pavilion.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-500 font-medium text-sm"
        >
          パビリオンを見る
          <ExternalLink className="ml-1 h-4 w-4" />
        </a>
      </div>
    </div>
  );
};