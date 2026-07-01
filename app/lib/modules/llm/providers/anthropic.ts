import { BaseProvider } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { LanguageModelV1 } from 'ai';
import type { IProviderSetting } from '~/types/model';
import { createAnthropic } from '@ai-sdk/anthropic';

export default class AnthropicProvider extends BaseProvider {
  name = 'Anthropic';
  getApiKeyLink = 'https://console.anthropic.com/settings/keys';

  config = {
    apiTokenKey: 'ANTHROPIC_API_KEY',
  };

  staticModels: ModelInfo[] = [
    { name: 'claude-opus-4-8', label: 'Claude Opus 4.8', provider: 'Anthropic', maxTokenAllowed: 200000, maxCompletionTokens: 32000 },
    { name: 'claude-opus-4-7', label: 'Claude Opus 4.7', provider: 'Anthropic', maxTokenAllowed: 200000, maxCompletionTokens: 32000 },
    { name: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6', provider: 'Anthropic', maxTokenAllowed: 200000, maxCompletionTokens: 64000 },
    { name: 'claude-opus-4-6', label: 'Claude Opus 4.6', provider: 'Anthropic', maxTokenAllowed: 200000, maxCompletionTokens: 32000 },
    { name: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5', provider: 'Anthropic', maxTokenAllowed: 200000, maxCompletionTokens: 32000 }
  ];

  async getDynamicModels(
    apiKeys?: Record<string, string>,
    settings?: IProviderSetting,
    serverEnv?: Record<string, string>,
  ): Promise<ModelInfo[]> {
    return this.staticModels;
  }

  getModelInstance: (options: {
    model: string;
    serverEnv: Env;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }) => LanguageModelV1 = (options) => {
    const { apiKeys, providerSettings, serverEnv, model } = options;
    const { apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings,
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: '',
      defaultApiTokenKey: 'ANTHROPIC_API_KEY',
    });
    
    const anthropic = createAnthropic({
      apiKey,
      baseURL: 'https://capi.aerolink.lat/v1',
    });

    return anthropic(model);
  };
      }
      
