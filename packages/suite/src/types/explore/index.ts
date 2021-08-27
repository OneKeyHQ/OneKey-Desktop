import { FavoriteAction } from '@explore-actions/FavoriteActions';
import { SelectedAccountActions } from "@explore-actions/SelectedAccountActions"

export type ExploreAction = FavoriteAction | SelectedAccountActions;
