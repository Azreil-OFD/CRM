import { defineModule } from '@directus/extensions-sdk';
import ModuleComponent from './module.vue';

export default defineModule({
	id: 'worker',
	name: 'work',
	icon: 'work',
	routes: [
		{
			path: '',
			component: ModuleComponent,
		},
	],
});
