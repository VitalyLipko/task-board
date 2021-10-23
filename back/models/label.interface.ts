export interface Label {
  id: string;
  title: string;
  isSystem: boolean;
  backgroundColor?: string;
}

export interface CreateLabelInput {
  title: Label['title'];
  backgroundColor?: Label['backgroundColor'];
  isSystem?: Label['isSystem'];
}

export interface UpdateLabelInput extends Partial<CreateLabelInput> {
  id: Label['id'];
}
