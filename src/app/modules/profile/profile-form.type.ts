import { UpdateProfileInput } from '../../core/graphql/graphql';

export type ProfileForm = Required<Omit<UpdateProfileInput, 'id'>>;
