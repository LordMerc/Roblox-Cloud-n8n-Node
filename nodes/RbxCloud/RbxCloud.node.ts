import { IExecuteFunctions } from 'n8n-core';
import { INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import axios from 'axios';
// …imports unchanged …

export class RbxCloud implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'RbxCloud',
		name: 'rbxCloud',
		icon: 'file:rbxCloud.svg',
		group: ['transform'],
		version: 1,
		description: 'Interact with Roblox Cloud APIs',
		defaults: {
			name: 'RbxCloud',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [{ name: 'robloxCloudApi', required: true }],
		properties: [
			{
				displayName: 'API Key Type',
				name: 'apiKeyType',
				type: 'options',
				options: [
					{ name: 'User API Key', value: 'user' },
					{ name: 'Group API Key', value: 'group' },
				],
				default: 'user',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Get Place', value: 'getPlace' },
					{ name: 'Publish Place Version', value: 'publishPlace' },
				],
				default: 'getPlace',
			},
			{
				displayName: 'Group ID',
				name: 'groupId',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['getGroup'] } },
			},
			// …rest unchanged …
		],
	};

	async execute(this: IExecuteFunctions) {
		const items = this.getInputData();
		const returnItems: INodeExecutionData[] = [];
		const creds = await this.getCredentials('robloxCloudApi');

		for (let i = 0; i < items.length; i++) {
			const keyType = this.getNodeParameter('apiKeyType', i) as string;
			const apiKey =
				keyType === 'group' ? (creds.groupApiKey as string) : (creds.userApiKey as string);

			const headers = { 'x-api-key': apiKey };

			const operation = this.getNodeParameter('operation', i) as string;

			if (operation === 'getPlace') {
				const placeId = this.getNodeParameter('placeId', i) as string;
				const res = await axios.get(`https://apis.roblox.com/universes/v1/places/${placeId}`, {
					headers,
				});
				returnItems.push({ json: res.data });
			} else if (operation === 'publishPlace') {
				const placeId = this.getNodeParameter('placeId', i) as string;
				const binProp = this.getNodeParameter('rbxlBinary', i) as string;
				const binaryData = this.helpers.getBinaryDataBuffer(i, binProp);
				const res = await axios.post(
					`https://apis.roblox.com/universes/v1/places/${placeId}/versions`,
					binaryData,
					{ headers: { ...headers, 'Content-Type': 'application/octet-stream' } },
				);
				returnItems.push({ json: res.data });
			} else if (operation === 'getGroup') {
				const groupId = this.getNodeParameter('groupId', i) as string;
				const res = await axios.get(`https://apis.roblox.com/groups/v1/groups/${groupId}`, {
					headers,
				});
				returnItems.push({ json: res.data });
			}
		}
		return [returnItems];
	}
}
