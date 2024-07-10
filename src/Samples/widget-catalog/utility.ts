import * as SDK from 'azure-devops-extension-sdk';
import { CommonServiceIds, IProjectPageService,  getClient } from 'azure-devops-extension-api';
import { Build, BuildDefinition, BuildQueryOrder, BuildRestClient, BuildStatus } from 'azure-devops-extension-api/Build';

async function getCurrentProjectId(): Promise<string | undefined> {
  const pps = await SDK.getService<IProjectPageService>(
    CommonServiceIds.ProjectPageService
  );
  const project = await pps.getProject();
  return project?.id;
}

export async function getLastestBuild( pipelineId: number ): Promise<Build | undefined> {
  const projectId = await getCurrentProjectId();
  const builds = await getClient(BuildRestClient).getBuilds(
    projectId!, 
    [pipelineId],
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    BuildStatus.Completed,
    undefined,
    undefined,
    undefined,
    1 /*top*/,
    undefined,
    undefined,
    undefined,
    BuildQueryOrder.StartTimeDescending,
    undefined,
    undefined,
    undefined,
    undefined
  );
  return builds.length > 0 ? builds[0] : undefined;
}

export async function getPipelineDefinition(pipelineId: number): Promise<BuildDefinition> {
  const projectId = await getCurrentProjectId();
  return await getClient(BuildRestClient).getDefinition(projectId!, pipelineId);
}
