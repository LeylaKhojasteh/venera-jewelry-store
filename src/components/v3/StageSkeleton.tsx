export function StageSkeleton({ ready = false }: { ready?: boolean }) {
  return (
    <div className={`v3-stage-skeleton${ready ? ' is-ready' : ''}`} aria-hidden="true">
      <span className="v3-stage-mark" />
    </div>
  );
}
