import { DrawingButtonsModeName } from '../enums/drawing-buttons-mode-name.enum';
import { DrawingButtonsIcon } from '../enums/drawing-buttons-icon.enum';
import { DrawingModes } from '../enums/drawing-mode.enum';

export class DrawingButtons {

  public list = [
    {
      name: DrawingButtonsModeName.marker,
      isChecked: false,
      icon: DrawingButtonsIcon[DrawingButtonsModeName.marker],
      title: `Set ${ DrawingButtonsModeName[DrawingButtonsModeName.marker] }`,
      isShow: true,
      mode: DrawingModes.marker,
    },
    {
      name: DrawingButtonsModeName.circle,
      isChecked: false,
      icon: DrawingButtonsIcon[DrawingButtonsModeName.circle],
      title: `Set ${ DrawingButtonsModeName[DrawingButtonsModeName.circle] }`,
      isShow: true,
      mode: DrawingModes.circle,
    },
    {
      name: DrawingButtonsModeName.area,
      isChecked: false,
      icon: DrawingButtonsIcon[DrawingButtonsModeName.area],
      title: `Set ${ DrawingButtonsModeName[DrawingButtonsModeName.area] }`,
      isShow: true,
      mode: DrawingModes.area,
    },

  ];

}
