import { BaseProvider } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';

export default class OpenAIProvider extends BaseProvider {
  name = 'OpenAI';
  getApiKeyLink = 'https://build.nvidia.com/'; // NVIDIA API link

  config = {
    apiTokenKey: 'OPENAI_API_KEY',
  };

  staticModels: ModelInfo[] = [
    { name: 'deepseek-ai/deepseek-v4-pro', label: 'DeepSeek V4 Pro', provider: 'OpenAI', maxTokenAllowed: 128000, maxCompletionTokens: 16384 },
    { name: 'mistralai/mistral-small-4-119b-2603', label: 'Mistral Small', provider: 'OpenAI', maxTokenAllowed: 128000, maxCompletionTokens: 16384 },
    { name: 'qwen/qwen3.5-122b-a10b', label: 'Qwen 3.5', provider: 'OpenAI', maxTokenAllowed: 128000, maxCompletionTokens: 16384 },
  ];

  async getDynamicModels(
    apiKeys?: Record<string, string>,
    settings?: IProviderSetting,
    serverEnv?: Record<string, string>,
  ): Promise<ModelInfo[]> {
    const { apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: settings,
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: '',
      defaultApiTokenKey: 'OPENAI_API_KEY',
    });

    if (!apiKey) {
      throw `Missing Api Key configuration for ${this.name} provider`;
    }

    try {
      // NVIDIA API Endpoint
      const response = await fetch(`https://integrate.api.nvidia.com/v1/models`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      const res = (await response.json()) as any;
      
      // Map dynamic models from NVIDIA to fit the UI
      return res.data.map((m: any) => ({
        name: m.id,
        label: m.id,
        provider: 'OpenAI',
        maxTokenAllowed: 128000,
        maxCompletionTokens: 16384,
      }));
    } catch (error) {
      console.error('Failed to fetch NVIDIA models, using static list', error);
      return this.staticModels;
    }
  }
}
