import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type BoardKeySpecifier = ('columns' | 'parentId' | BoardKeySpecifier)[];
export type BoardFieldPolicy = {
	columns?: FieldPolicy<any> | FieldReadFunction<any>,
	parentId?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ColumnKeySpecifier = ('items' | 'label' | ColumnKeySpecifier)[];
export type ColumnFieldPolicy = {
	items?: FieldPolicy<any> | FieldReadFunction<any>,
	label?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CommentKeySpecifier = ('created' | 'creator' | 'id' | 'message' | 'parentId' | CommentKeySpecifier)[];
export type CommentFieldPolicy = {
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	creator?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	parentId?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FileKeySpecifier = ('encoding' | 'mimeType' | 'name' | 'size' | 'url' | FileKeySpecifier)[];
export type FileFieldPolicy = {
	encoding?: FieldPolicy<any> | FieldReadFunction<any>,
	mimeType?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	size?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type HistoryEntryKeySpecifier = ('created' | 'event' | 'id' | 'parentId' | 'user' | HistoryEntryKeySpecifier)[];
export type HistoryEntryFieldPolicy = {
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	event?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	parentId?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type LabelKeySpecifier = ('backgroundColor' | 'id' | 'isSystem' | 'title' | LabelKeySpecifier)[];
export type LabelFieldPolicy = {
	backgroundColor?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isSystem?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MutationKeySpecifier = ('changePassword' | 'changeTaskStatus' | 'createComment' | 'createLabel' | 'createProject' | 'createTask' | 'createUser' | 'deleteLabel' | 'deleteProject' | 'deleteUser' | 'login' | 'logout' | 'updateLabel' | 'updateProfile' | 'updateProject' | 'updateTask' | 'updateUser' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	changePassword?: FieldPolicy<any> | FieldReadFunction<any>,
	changeTaskStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	createComment?: FieldPolicy<any> | FieldReadFunction<any>,
	createLabel?: FieldPolicy<any> | FieldReadFunction<any>,
	createProject?: FieldPolicy<any> | FieldReadFunction<any>,
	createTask?: FieldPolicy<any> | FieldReadFunction<any>,
	createUser?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteLabel?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteProject?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteUser?: FieldPolicy<any> | FieldReadFunction<any>,
	login?: FieldPolicy<any> | FieldReadFunction<any>,
	logout?: FieldPolicy<any> | FieldReadFunction<any>,
	updateLabel?: FieldPolicy<any> | FieldReadFunction<any>,
	updateProfile?: FieldPolicy<any> | FieldReadFunction<any>,
	updateProject?: FieldPolicy<any> | FieldReadFunction<any>,
	updateTask?: FieldPolicy<any> | FieldReadFunction<any>,
	updateUser?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProfileKeySpecifier = ('avatar' | 'email' | 'firstName' | 'fullName' | 'lastName' | ProfileKeySpecifier)[];
export type ProfileFieldPolicy = {
	avatar?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	firstName?: FieldPolicy<any> | FieldReadFunction<any>,
	fullName?: FieldPolicy<any> | FieldReadFunction<any>,
	lastName?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProjectKeySpecifier = ('created' | 'icon' | 'id' | 'name' | 'status' | 'tasks' | ProjectKeySpecifier)[];
export type ProjectFieldPolicy = {
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	icon?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	tasks?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('board' | 'comments' | 'historyEntries' | 'isLoggedIn' | 'label' | 'labels' | 'project' | 'projects' | 'task' | 'tasks' | 'user' | 'users' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	board?: FieldPolicy<any> | FieldReadFunction<any>,
	comments?: FieldPolicy<any> | FieldReadFunction<any>,
	historyEntries?: FieldPolicy<any> | FieldReadFunction<any>,
	isLoggedIn?: FieldPolicy<any> | FieldReadFunction<any>,
	label?: FieldPolicy<any> | FieldReadFunction<any>,
	labels?: FieldPolicy<any> | FieldReadFunction<any>,
	project?: FieldPolicy<any> | FieldReadFunction<any>,
	projects?: FieldPolicy<any> | FieldReadFunction<any>,
	task?: FieldPolicy<any> | FieldReadFunction<any>,
	tasks?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	users?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SubscriptionKeySpecifier = ('commentCreated' | 'historyEntryAdded' | SubscriptionKeySpecifier)[];
export type SubscriptionFieldPolicy = {
	commentCreated?: FieldPolicy<any> | FieldReadFunction<any>,
	historyEntryAdded?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaskKeySpecifier = ('assignees' | 'commentCount' | 'created' | 'creator' | 'description' | 'id' | 'labels' | 'parentId' | 'status' | 'title' | TaskKeySpecifier)[];
export type TaskFieldPolicy = {
	assignees?: FieldPolicy<any> | FieldReadFunction<any>,
	commentCount?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	creator?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	labels?: FieldPolicy<any> | FieldReadFunction<any>,
	parentId?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserKeySpecifier = ('id' | 'profile' | 'trashed' | 'username' | UserKeySpecifier)[];
export type UserFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	profile?: FieldPolicy<any> | FieldReadFunction<any>,
	trashed?: FieldPolicy<any> | FieldReadFunction<any>,
	username?: FieldPolicy<any> | FieldReadFunction<any>
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
	HistoryEntry?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
		keyFields?: false | HistoryEntryKeySpecifier | (() => undefined | HistoryEntryKeySpecifier),
		fields?: HistoryEntryFieldPolicy,
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