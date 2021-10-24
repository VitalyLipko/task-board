import { LeanDocument } from 'mongoose';

import { extractLabel } from '../../shared-utils/extract-label';
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

  async getTaskLabels(
    labelIds: Array<string>,
  ): Promise<Array<LeanDocument<Label>>> {
    const newLabels: Array<LeanDocument<Label>> = [];
    const labels = await Promise.all(
      labelIds.map((id) => this.getLabel(id)),
    ).then(
      (labels) =>
        labels.filter((label) => !!label) as Array<LeanDocument<Label>>,
    );

    labels.forEach((label) => {
      const { scope, title } = extractLabel(label.title);
      const alreadyHas = !!newLabels.find((i) => {
        const { scope: itemScope, title: itemTitle } = extractLabel(i.title);
        return scope && itemScope ? scope === itemScope : itemTitle === title;
      });

      if (!alreadyHas) {
        newLabels.push(label);
      }
    });

    return newLabels;
  }
}
