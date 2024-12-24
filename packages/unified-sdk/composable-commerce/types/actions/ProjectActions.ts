import { ProjectSettings } from 'shared/types/ProjectSettings';
import { SDKResponse, ServerOptions } from '@royalcyber/unified-commerce';

type GetProjectSettingsAction = (options?: {
  serverOptions?: ServerOptions;
}) => Promise<SDKResponse<ProjectSettings>>;

export { type GetProjectSettingsAction };
