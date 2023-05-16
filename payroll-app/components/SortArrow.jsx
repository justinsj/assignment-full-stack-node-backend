// Component to render the sorting arrow
export function SortArrow({ direction }) {
  if (direction === 'asc') {
    return <span>&#9650;</span>; // Up arrow
  } else if (direction === 'desc') {
    return <span>&#9660;</span>; // Down arrow
  } else {
    return null;
  }
}

export function nextDirection(direction) {
  if (direction === 'asc') return 'desc';
  if (direction === 'desc') return null;
  return 'asc';
}