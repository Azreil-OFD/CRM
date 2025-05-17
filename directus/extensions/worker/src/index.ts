import { defineModule } from '@directus/extensions-sdk';
import ModuleComponent from './pages/module.vue';
import HomeComponent from './pages/home.vue';
import OrdersComponent from './pages/orders.vue';

export default defineModule({
	id: 'worker',
	name: 'work',
	icon: 'work',
	routes: [
		{
			path: '',
			component: ModuleComponent,
		},
		{
			path: 'home',
			component: HomeComponent,
		},
		{
			path: 'orders',
			component: OrdersComponent,
		},
	],
});
