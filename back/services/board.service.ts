import { Board, Column } from '../models/interfaces/board.interface';

import labelService from './label.service';
import taskService from './task.service';

const BOARD_SCOPE = 'priority';
class BoardService {
  async getBoard(parentId: string): Promise<Board> {
    const [tasks, scopedLabels] = await Promise.all([
      taskService.getTasks(parentId),
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

export default new BoardService();
