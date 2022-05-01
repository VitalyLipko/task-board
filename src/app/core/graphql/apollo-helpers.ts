import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type BoardKeySpecifier = ('parentId' | 'columns' | BoardKeySpecifier)[];
export type BoardFieldPolicy = {
	parentId?: FieldPolicy<any> | FieldReadFunction<any>,
	columns?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ColumnKeySpecifier = ('label' | 'items' | ColumnKeySpecifier)[];
export type ColumnFieldPolicy = {
	label?: FieldPolicy<any> | FieldReadFunction<any>,
	items?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CommentKeySpecifier = ('id' | 'parentId' | 'created' | 'creator' | 'message' | CommentKeySpecifier)[];
export type CommentFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	parentId?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	creator?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FileKeySpecifier = ('name' | 'url' | 'mimeType' | 'size' | 'encoding' | FileKeySpecifier)[];
export type FileFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>,
	mimeType?: FieldPolicy<any> | FieldReadFunction<any>,
	size?: FieldPolicy<any> | FieldReadFunction<any>,
	encoding?: FieldPolicy<any> | FieldReadFunction<any>
};
export type LabelKeySpecifier = ('id' | 'title' | 'backgroundColor' | 'isSystem' | LabelKeySpecifier)[];
export type LabelFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	backgroundColor?: FieldPolicy<any> | FieldReadFunction<any>,
	isSystem?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MutationKeySpecifier = ('createProject' | 'updateProject' | 'deleteProject' | 'createTask' | 'updateTask' | 'changeTaskStatus' | 'login' | 'logout' | 'createUser' | 'updateUser' | 'updateProfile' | 'deleteUser' | 'createLabel' | 'updateLabel' | 'deleteLabel' | 'createComment' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	createProject?: FieldPolicy<any> | FieldReadFunction<any>,
	updateProject?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteProject?: FieldPolicy<any> | FieldReadFunction<any>,
	createTask?: FieldPolicy<any> | FieldReadFunction<any>,
	updateTask?: FieldPolicy<any> | FieldReadFunction<any>,
	changeTaskStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	login?: FieldPolicy<any> | FieldReadFunction<any>,
	logout?: FieldPolicy<any> | FieldReadFunction<any>,
	createUser?: FieldPolicy<any> | FieldReadFunction<any>,
	updateUser?: FieldPolicy<any> | FieldReadFunction<any>,
	updateProfile?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteUser?: FieldPolicy<any> | FieldReadFunction<any>,
	createLabel?: FieldPolicy<any> | FieldReadFunction<any>,
	updateLabel?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteLabel?: FieldPolicy<any> | FieldReadFunction<any>,
	createComment?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProfileKeySpecifier = ('avatar' | ProfileKeySpecifier)[];
export type ProfileFieldPolicy = {
	avatar?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProjectKeySpecifier = ('id' | 'name' | 'created' | 'tasks' | 'status' | 'icon' | ProjectKeySpecifier)[];
export type ProjectFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	tasks?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	icon?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('board' | 'isLoggedIn' | 'label' | 'labels' | 'project' | 'projects' | 'task' | 'tasks' | 'user' | 'users' | 'comments' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	board?: FieldPolicy<any> | FieldReadFunction<any>,
	isLoggedIn?: FieldPolicy<any> | FieldReadFunction<any>,
	label?: FieldPolicy<any> | FieldReadFunction<any>,
	labels?: FieldPolicy<any> | FieldReadFunction<any>,
	project?: FieldPolicy<any> | FieldReadFunction<any>,
	projects?: FieldPolicy<any> | FieldReadFunction<any>,
	task?: FieldPolicy<any> | FieldReadFunction<any>,
	tasks?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	users?: FieldPolicy<any> | FieldReadFunction<any>,
	comments?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SubscriptionKeySpecifier = ('commentCreated' | SubscriptionKeySpecifier)[];
export type SubscriptionFieldPolicy = {
	commentCreated?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaskKeySpecifier = ('id' | 'title' | 'description' | 'created' | 'parentId' | 'assignees' | 'creator' | 'labels' | 'status' | TaskKeySpecifier)[];
export type TaskFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	parentId?: FieldPolicy<any> | FieldReadFunction<any>,
	assignees?: FieldPolicy<any> | FieldReadFunction<any>,
	creator?: FieldPolicy<any> | FieldReadFunction<any>,
	labels?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserKeySpecifier = ('id' | 'username' | 'email' | 'firstName' | 'lastName' | 'fullName' | 'trashed' | 'profile' | UserKeySpecifier)[];
export type UserFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	username?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	firstName?: FieldPolicy<any> | FieldReadFunction<any>,
	lastName?: FieldPolicy<any> | FieldReadFunction<any>,
	fullName?: FieldPolicy<any> | FieldReadFunction<any>,
	trashed?: FieldPolicy<any> | FieldReadFunction<any>,
	profile?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StrictTypedTypePolicies = {
	Board?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
		keyFields?: false | BoardKeySpecifier | (() => undefined | BoardKeySpecifier),
		fields?: BoardFieldPolicy,
	},
	Column?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
		keyFields?: false | ColumnKeySpecifier | (() => undefined | ColumnKeySpecifier),
		fields?: ColumnFieldPolicy,
	},
	Comment?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
		keyFields?: false | CommentKeySpecifier | (() => undefined | CommentKeySpecifier),
		fields?: CommentFieldPolicy,
	},
	File?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
		keyFields?: false | FileKeySpecifier | (() => undefined | FileKeySpecifier),
		fields?: FileFieldPolicy,
	},
	Label?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
		keyFields?: false | LabelKeySpecifier | (() => undefined | LabelKeySpecifier),
		fields?: LabelFieldPolicy,
	},
	Mutation?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
		keyFields?: false | MutationKeySpecifier | (() => undefined | MutationKeySpecifier),
		fields?: MutationFieldPolicy,
	},
	Profile?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
		keyFields?: false | ProfileKeySpecifier | (() => undefined | ProfileKeySpecifier),
		fields?: ProfileFieldPolicy,
	},
	Project?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
		keyFields?: false | ProjectKeySpecifier | (() => undefined | ProjectKeySpecifier),
		fields?: ProjectFieldPolicy,
	},
	Query?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		fields?: QueryFieldPolicy,
	},
	Subscription?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
		keyFields?: false | SubscriptionKeySpecifier | (() => undefined | SubscriptionKeySpecifier),
		fields?: SubscriptionFieldPolicy,
	},
	Task?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
		keyFields?: false | TaskKeySpecifier | (() => undefined | TaskKeySpecifier),
		fields?: TaskFieldPolicy,
	},
	User?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
		keyFields?: false | UserKeySpecifier | (() => undefined | UserKeySpecifier),
		fields?: UserFieldPolicy,
	}
};
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;