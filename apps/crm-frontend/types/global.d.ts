import { components } from "./directus-types"; 
export {}

declare global {
 type ItemsTask = components["schemas"]["ItemsTasks"];
 type Report = components["schemas"]["ItemsReport"];
 type Comment = components["schemas"]["Comments"];
}