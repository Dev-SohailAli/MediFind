import { strings } from '../content/strings';

export interface LoadMoreButtonProps {
  onPress: () => void;
}

/** Explicit, local "Load more" action. There is no infinite scroll. */
export function LoadMoreButton({ onPress }: LoadMoreButtonProps) {
  return (
    <button type="button" onClick={onPress} className="load-more-button">
      {strings.loadMoreLabel}
    </button>
  );
}
