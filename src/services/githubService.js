const axios = require('axios');

class GithubService {
  constructor() {
    this.baseUrl = 'https://api.github.com';
  }

  /**
   * Extract owner and repo name from GitHub URL
   * @param {string} url - GitHub repository URL
   * @returns {object|null} - Object with owner and repo properties or null if invalid
   */
  parseRepoUrl(url) {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname !== 'github.com') {
        return null;
      }
      
      const pathParts = parsedUrl.pathname.split('/').filter(part => part.length > 0);
      if (pathParts.length < 2) {
        return null;
      }
      
      return {
        owner: pathParts[0],
        repo: pathParts[1]
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Fetch repository information from GitHub API
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @returns {Promise<object>} - Repository information
   */
  async getRepoInfo(owner, repo) {
    try {
      const response = await axios.get(`${this.baseUrl}/repos/${owner}/${repo}`, {
        headers: {
          'User-Agent': 'SkillLink-App'
        }
      });
      
      return {
        url: response.data.html_url,
        name: response.data.name,
        description: response.data.description,
        stars: response.data.stargazers_count,
        forks: response.data.forks_count,
        language: response.data.language,
        createdAt: response.data.created_at,
        updatedAt: response.data.updated_at
      };
    } catch (error) {
      throw new Error(`Failed to fetch repository info: ${error.message}`);
    }
  }

  /**
   * Fetch the latest commit information
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @returns {Promise<object>} - Latest commit information
   */
  async getLatestCommit(owner, repo) {
    try {
      const response = await axios.get(`${this.baseUrl}/repos/${owner}/${repo}/commits`, {
        headers: {
          'User-Agent': 'SkillLink-App'
        },
        params: {
          per_page: 1
        }
      });
      
      if (response.data.length === 0) {
        return null;
      }
      
      const commit = response.data[0];
      return {
        message: commit.commit.message,
        author: commit.commit.author.name,
        date: commit.commit.author.date,
        sha: commit.sha
      };
    } catch (error) {
      throw new Error(`Failed to fetch latest commit: ${error.message}`);
    }
  }

  /**
   * Fetch README content
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @returns {Promise<string>} - README content
   */
  async getReadme(owner, repo) {
    try {
      const response = await axios.get(`${this.baseUrl}/repos/${owner}/${repo}/readme`, {
        headers: {
          'User-Agent': 'SkillLink-App',
          'Accept': 'application/vnd.github.VERSION.html'
        }
      });
      
      return response.data;
    } catch (error) {
      // If README doesn't exist, return empty string
      if (error.response && error.response.status === 404) {
        return '';
      }
      throw new Error(`Failed to fetch README: ${error.message}`);
    }
  }

  /**
   * Validate and fetch GitHub repository information
   * @param {string} repoUrl - GitHub repository URL
   * @returns {Promise<object>} - Combined repository information
   */
  async fetchRepoData(repoUrl) {
    const repoInfo = this.parseRepoUrl(repoUrl);
    if (!repoInfo) {
      throw new Error('Invalid GitHub repository URL');
    }
    
    const { owner, repo } = repoInfo;
    
    try {
      // Fetch all required information in parallel
      const [repoDetails, latestCommit, readme] = await Promise.all([
        this.getRepoInfo(owner, repo),
        this.getLatestCommit(owner, repo),
        this.getReadme(owner, repo)
      ]);
      
      return {
        ...repoDetails,
        latestCommit,
        readme
      };
    } catch (error) {
      throw new Error(`Failed to fetch GitHub data: ${error.message}`);
    }
  }
}

module.exports = new GithubService();