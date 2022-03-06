import { Board, Column } from '../models/interfaces/board.interface';

import LabelService from './label.service';
import TaskService from './task.service';

const tasksService = new TaskService();
const labelService = new LabelService();

const BOARD_SCOPE = 'priority';
export default class BoardService {
  async getBoard(parentId: string): Promise<Board> {
    const [tasks, scopedLabels] = await Promise.all([
      tasksService.getTasks(parentId),
      labelService.getLabels({
        title: new RegExp(`^${BOARD_SCOPE}::`),
      }),
    ]);

    return {
      parentId,
      columns: scopedLabels.map<Column>((scopedLabel) => ({
        label: scopedLabel,
        items: tasks.filter(({ labels }) =>
          labels.find(
            (label) =>
              label && 'title' in label && label.title === scopedLabel.title,
          ),
        ),
      })),
    };
  }
}
