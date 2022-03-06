import { LeanDocument } from 'mongoose';

import { extractLabel } from '../../shared-utils/extract-label';
import { CreateLabelInput, Label } from '../models/interfaces/label.interface';
import { LabelModel, labelModel } from '../models/schemas/db.schema';

export default class LabelService {
  async createLabel(
    label: CreateLabelInput,
  ): Promise<LeanDocument<LabelModel>> {
    const res = await labelModel.create(label);

    return res.toJSON();
  }

  async getLabels(filterOptions?: {
    title?: string | RegExp;
  }): Promise<Array<LeanDocument<Label>>> {
    return labelModel.find({ ...filterOptions });
  }

  async getLabel(id: string): Promise<LeanDocument<Label> | null> {
    return labelModel.findById(id);
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
