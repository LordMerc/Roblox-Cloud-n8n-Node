import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class RobloxCloudApi implements ICredentialType {
	name = 'robloxCloudApi';
	displayName = 'Roblox Cloud API';

	properties: INodeProperties[] = [
		{
			displayName: 'User API Key',
			name: 'userApiKey',
			type: 'string',
			default: '',
			typeOptions: { password: true },
			required: false,
		},
		{
			displayName: 'Group API Key',
			name: 'groupApiKey',
			type: 'string',
			default: '',
			typeOptions: { password: true },
			required: false,
		},
		{
			displayName: 'Universe ID',
			name: 'universeId',
			type: 'string',
			default: '',
		},
	];
}
