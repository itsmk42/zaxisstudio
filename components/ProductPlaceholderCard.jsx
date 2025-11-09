export default function ProductPlaceholderCard() {
  return (
    <div className="card placeholder" aria-hidden="true">
      <div className="card-media placeholder-media" />
      <div className="card-body">
        <div className="placeholder-line" />
        <div className="placeholder-line short" />
      </div>
    </div>
  );
}
