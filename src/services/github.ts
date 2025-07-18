import type { Pavilion } from '../types';

const GITHUB_TOKEN_KEY = 'github-personal-access-token';

export class GitHubService {
  private owner: string;
  private repo: string;
  private token: string | null;

  constructor() {
    // リポジトリ情報は後で設定
    this.owner = '';
    this.repo = '';
    this.token = localStorage.getItem(GITHUB_TOKEN_KEY);
  }

  setRepository(owner: string, repo: string) {
    this.owner = owner;
    this.repo = repo;
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem(GITHUB_TOKEN_KEY, token);
  }

  hasToken(): boolean {
    return !!this.token;
  }

  async fetchPavilions(): Promise<Pavilion[]> {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${this.owner}/${this.repo}/contents/src/data/pavilions.json`,
        {
          headers: this.token ? {
            'Authorization': `token ${this.token}`,
            'Accept': 'application/vnd.github.v3+json'
          } : {}
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch pavilions');
      }

      const data = await response.json();
      const content = atob(data.content);
      const { pavilions } = JSON.parse(content);
      return pavilions;
    } catch (error) {
      console.error('Error fetching pavilions:', error);
      // フォールバック: ローカルデータを使用
      const module = await import('../data/pavilions.json');
      return module.default.pavilions as Pavilion[];
    }
  }

  async updatePavilions(pavilions: Pavilion[]): Promise<boolean> {
    if (!this.token) {
      throw new Error('GitHub token not set');
    }

    try {
      // 現在のファイル情報を取得（SHAが必要）
      const fileResponse = await fetch(
        `https://api.github.com/repos/${this.owner}/${this.repo}/contents/src/data/pavilions.json`,
        {
          headers: {
            'Authorization': `token ${this.token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      if (!fileResponse.ok) {
        throw new Error('Failed to fetch current file');
      }

      const fileData = await fileResponse.json();
      const content = btoa(JSON.stringify({ pavilions }, null, 2));

      // ファイルを更新
      const updateResponse = await fetch(
        `https://api.github.com/repos/${this.owner}/${this.repo}/contents/src/data/pavilions.json`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `token ${this.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: 'Update pavilions data',
            content: content,
            sha: fileData.sha
          })
        }
      );

      return updateResponse.ok;
    } catch (error) {
      console.error('Error updating pavilions:', error);
      return false;
    }
  }
}

export const githubService = new GitHubService();