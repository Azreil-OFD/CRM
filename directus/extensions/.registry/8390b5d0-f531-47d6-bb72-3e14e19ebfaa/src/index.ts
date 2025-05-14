import { defineInterface } from '@directus/shared/utils';
import CustomButtons from './components/CustomButtons.vue';



export default defineInterface({
	id: 'custom-buttons',
	icon: 'smart_button',
	name: 'Custom Buttons',
	component: CustomButtons,
	types: ['alias'],
	options: [],
  });
	