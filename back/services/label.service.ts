import { LeanDocument } from 'mongoose';

import { LabelModel, labelModel } from '../models/db.schema';
import { CreateLabelInput, Label } from '../models/label.interface';

export default class LabelService {
  async createLabel(
    label: CreateLabelInput,
  ): Promise<LeanDocument<LabelModel>> {
    const res = await labelModel.create(label);

    return res.toJSON();
  }

  async getLabels(): Promise<Array<LeanDocument<Label>>> {
    const labels = await labelModel.find();

    return labels.map((label) => label.toJSON());
  }

  async getLabel(id: string): Promise<LeanDocument<Label> | null> {
    const label = await labelModel.findById(id);
    return label ? label.toJSON() : null;
  }
}
